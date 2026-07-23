import httpClient from "../helper/httpClient";
import { businessProfiles, businessWallets, walletTransactions } from "../data/siteData";

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
  const balance = Number(firstValue(wallet, ["balance", "amount", "credit", "wallet_balance", "walletBalance", "walletBalanceAmount"])) || 0;
  const title = firstValue(wallet, ["title", "name", "business", "business_name", "businessName"]) || "کسب‌وکار";

  return {
    id: firstValue(wallet, ["id", "business_id", "businessId", "business_slug", "businessSlug", "slug"]) || title,
    title,
    balance,
    balanceLabel: firstValue(wallet, ["balanceLabel", "balance_label", "formatted_balance", "formattedBalance", "walletBalanceLabel"]) || formatToman(balance),
    status: firstValue(wallet, ["status", "description", "walletStatus"]) || (balance > 0 ? `قابل استفاده در ${title}` : "هنوز شارژ نشده"),
    image: firstValue(wallet, ["image", "logo", "logo_url", "logoUrl", "avatar"]) || "/home/img/restaurant-melal.png",
    points: firstValue(wallet, ["points", "score", "point", "user_points", "userPoints"]) || "۰ امتیاز",
    discountCode: firstValue(wallet, ["discountCode", "discount_code", "code", "used_discount_code", "usedDiscountCode"]) || "",
    cashbackLabel: firstValue(wallet, ["cashbackLabel", "cashback_label", "cashback", "cashback_amount", "cashbackAmount"]) || "",
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

const findBusinessProfile = (businessId) => {
  if (!businessId) {
    return null;
  }

  const normalizedBusinessId = String(businessId).toLowerCase();

  return businessProfiles.find((profile) => {
    const aliases = Array.isArray(profile.aliases) ? profile.aliases : [];
    const haystack = `${profile.id || ""} ${profile.slug || ""} ${profile.title || ""} ${profile.shortTitle || ""} ${aliases.join(" ")}`.toLowerCase();
    return haystack.includes(normalizedBusinessId) || normalizedBusinessId.includes(String(profile.id || "").toLowerCase());
  }) || null;
};

const walletFromProfile = (profile) => profile ? normalizeWallet({
  id: profile.id,
  businessId: profile.id,
  title: profile.title,
  balance: profile.walletBalance,
  balanceLabel: profile.walletBalanceLabel,
  status: profile.walletStatus,
  image: profile.image,
  points: profile.points,
  discountCode: profile.discountCode,
  cashbackLabel: profile.cashbackLabel,
}) : null;

const findMockWallet = (businessId) => {
  if (!businessId) {
    return null;
  }

  const normalizedBusinessId = String(businessId).toLowerCase();
  const wallet = businessWallets.find((item) => {
    const haystack = `${item.id || ""} ${item.title || ""}`.toLowerCase();
    return haystack.includes(normalizedBusinessId) || normalizedBusinessId.includes(String(item.id || "").toLowerCase());
  });

  return wallet || walletFromProfile(findBusinessProfile(businessId));
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
  const { businessId, businessSlug } = options;
  const businessIdentifier = businessId || businessSlug;
  const response = await httpClient.get(WALLET_ENDPOINT, {
    requiresAuth: true,
    params: businessIdentifier ? { business_id: businessIdentifier, business_slug: businessIdentifier } : undefined,
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

