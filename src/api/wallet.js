import httpClient from "../helper/httpClient";
import { businessWallets, walletTransactions } from "../data/siteData";

const WALLET_ENDPOINT = process.env.NEXT_PUBLIC_WALLET_API_URL || "/wallet";

const asArray = (value) => (Array.isArray(value) ? value : []);

const firstValue = (source, keys) => {
  if (!source || typeof source !== "object") {
    return undefined;
  }

  for (const key of keys) {
    if (source[key] !== undefined && source[key] !== null && source[key] !== "") {
      return source[key];
    }
  }

  return undefined;
};

const formatToman = (amount) => `${new Intl.NumberFormat("fa-IR").format(Number(amount) || 0)} تومان`;

const normalizeWallet = (wallet) => {
  const balance = Number(firstValue(wallet, ["balance", "amount", "credit", "wallet_balance", "walletBalance"])) || 0;
  const title = firstValue(wallet, ["title", "name", "business", "business_name", "businessName"]) || "کسب‌وکار";

  return {
    id: firstValue(wallet, ["id", "business_id", "businessId", "business_slug", "businessSlug", "slug"]) || title,
    title,
    balance,
    balanceLabel: firstValue(wallet, ["balanceLabel", "balance_label", "formatted_balance", "formattedBalance"]) || formatToman(balance),
    status: firstValue(wallet, ["status", "description"]) || (balance > 0 ? `قابل استفاده در ${title}` : "هنوز شارژ نشده"),
    image: firstValue(wallet, ["image", "logo", "logo_url", "logoUrl", "avatar"]) || "/home/img/restaurant-melal.png",
  };
};

const normalizeTransaction = (transaction) => {
  const amount = firstValue(transaction, ["amount", "value", "credit"]);
  const type = firstValue(transaction, ["type", "title", "description"]) || "تراکنش کیف پول";
  const business = firstValue(transaction, ["business", "business_name", "businessName", "name"]) || "کسب‌وکار";
  const signedAmount = typeof amount === "number"
    ? `${amount >= 0 ? "+" : ""}${formatToman(amount)}`
    : firstValue(transaction, ["amountLabel", "amount_label", "formatted_amount", "formattedAmount"]) || String(amount || "۰ تومان");

  return {
    business,
    type,
    amount: signedAmount,
    date: firstValue(transaction, ["date", "created_at", "createdAt", "jalali_date", "jalaliDate"]) || "امروز",
  };
};

const findMockWallet = (businessId) => {
  if (!businessId) {
    return null;
  }

  const normalizedBusinessId = String(businessId).toLowerCase();
  return businessWallets.find((wallet) => {
    const haystack = `${wallet.id || ""} ${wallet.title || ""}`.toLowerCase();
    return haystack.includes(normalizedBusinessId);
  }) || null;
};

const normalizeWalletResponse = (data, options = {}) => {
  const payload = data?.data || data;
  const singleWallet = firstValue(payload, ["wallet", "businessWallet", "business_wallet"]);
  const rawWallets = firstValue(payload, ["wallets", "businessWallets", "business_wallets", "balances", "items"]);
  const rawTransactions = firstValue(payload, ["transactions", "history", "walletTransactions", "wallet_transactions"]);

  const responseWallets = singleWallet
    ? [singleWallet]
    : asArray(rawWallets).length
      ? asArray(rawWallets)
      : payload && firstValue(payload, ["balance", "amount", "credit", "wallet_balance", "walletBalance"]) !== undefined
        ? [payload]
        : [];

  const wallets = responseWallets.map(normalizeWallet);
  const transactions = asArray(rawTransactions).map(normalizeTransaction);
  const fallbackWallet = findMockWallet(options.businessId);
  const fallbackWallets = fallbackWallet ? [fallbackWallet] : businessWallets;
  const totalBalance = Number(firstValue(payload, ["totalBalance", "total_balance", "total", "balance"])) || wallets.reduce((sum, wallet) => sum + wallet.balance, 0);

  return {
    wallets: wallets.length ? wallets : fallbackWallets,
    transactions: transactions.length ? transactions : walletTransactions,
    totalBalance: wallets.length ? totalBalance : fallbackWallets.reduce((sum, wallet) => sum + wallet.balance, 0),
    source: wallets.length ? "api" : "mock",
  };
};

export const getUserWallet = async (options = {}) => {
  const { businessId } = options;
  const response = await httpClient.get(WALLET_ENDPOINT, {
    requiresAuth: true,
    params: businessId ? { business_id: businessId } : undefined,
  });

  return normalizeWalletResponse(response.data, options);
};

export const getBusinessWallet = (businessId) => getUserWallet({ businessId });

export const getMockWallet = (businessId) => {
  const wallet = findMockWallet(businessId);
  const wallets = wallet ? [wallet] : businessWallets;

  return {
    wallets,
    transactions: wallet ? walletTransactions.filter((transaction) => transaction.business === wallet.title) : walletTransactions,
    totalBalance: wallets.reduce((sum, item) => sum + item.balance, 0),
    source: "mock",
  };
};