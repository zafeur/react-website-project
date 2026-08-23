import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { CalendarDays, Crown, Gift, LogOut, Mail, PencilLine, Phone, RefreshCw, TicketPercent, UserRound, Wallet } from 'lucide-react';
import { extractActiveDiscountCodesFromReport, extractActiveGiftsFromReport, extractUserProfileFromReport, getDiscountReport } from '../api/user';
import { defaultProfileAvatar } from '../data/brandAssets';
import { businessProfiles, dashboardActions, mobileProfileLinks } from '../data/siteData';
import { toPersianDigits } from '../helper/persianDigits';
import { normalizeMediaUrl } from '../helper/mediaUrl';

const getImageSrc = (image) => image?.src || image;

const handleGiftImageError = (event, fallback) => {
  if (fallback && event.currentTarget.src !== fallback) {
    event.currentTarget.src = fallback;
    return;
  }

  event.currentTarget.style.display = 'none';
  event.currentTarget.closest('.active-gift-card, .mobile-active-gift')?.classList.add('has-broken-image');
};

const firstValue = (source, keys) => {
  for (const key of keys) {
    const value = source?.[key];
    if (value !== undefined && value !== null && value !== '') {
      return value;
    }
  }

  return '';
};

const getNestedValue = (source, paths) => {
  for (const path of paths) {
    const value = path.split('.').reduce((current, key) => current?.[key], source);
    if (value !== undefined && value !== null && value !== '') {
      return value;
    }
  }

  return '';
};

const getProfileField = (profile, keys) => firstValue(profile || {}, keys);

const getProfileName = (profile) => {
  const firstName = getProfileField(profile, ['firstName', 'first_name', 'name']);
  const lastName = getProfileField(profile, ['lastName', 'last_name', 'family', 'family_name']);
  const fullName = getProfileField(profile, ['fullName', 'full_name']);

  return [firstName, lastName].filter(Boolean).join(' ') || fullName || 'کاربر کی میای';
};

const isProfileComplete = (profile) => Boolean(
  getProfileField(profile, ['firstName', 'first_name', 'name']) &&
  getProfileField(profile, ['lastName', 'last_name', 'family', 'family_name']) &&
  getProfileField(profile, ['email']) &&
  getProfileField(profile, ['birthDate', 'birth_date', 'date', 'birthday'])
);

const getProfileAvatar = (profile) => normalizeMediaUrl(getProfileField(profile, [
  'avatarPreview',
  'avatar_preview',
  'avatar',
  'avatar_url',
  'avatarUrl',
  'profile_image',
  'profileImage',
  'profile_photo',
  'profilePhoto',
  'image',
  'photo',
]));

const getActionSection = (title) => {
  const label = String(title || '');
  if (label.includes('کیف') || label.includes('Ú©ÛŒÙ')) return 'wallet';
  if (label.includes('هدیه') || label.includes('Ù‡Ø¯ÛŒÙ‡')) return 'gifts';
  if (label.includes('معرف') || label.includes('Ù…Ø¹Ø±Ù')) return 'referral';
  if (label.includes('تاریخ') || label.includes('ØªØ§Ø±ÛŒØ®')) return 'history';
  if (label.includes('آمار') || label.includes('Ø¢Ù…Ø§Ø±')) return 'stats';
  if (label.includes('فرآیند') || label.includes('فرایند') || label.includes('ÙØ±Ø¢') || label.includes('ÙØ±Ø§ÛŒ')) return 'processes';
  if (label.includes('پشتیبانی') || label.includes('سوال') || label.includes('سؤال') || label.includes('متداول')) return 'faq';
  return 'account';
};

const disabledSections = new Set(['processes', 'referral', 'history', 'stats']);

const isEnabledDashboardItem = (item) => !disabledSections.has(getActionSection(item.title));

const isPrimitiveValue = (value) => ['string', 'number', 'boolean'].includes(typeof value);

const getDeepValue = (source, keys) => {
  if (isPrimitiveValue(source)) return String(source);

  const queue = [source];
  const seen = new Set();

  while (queue.length) {
    const current = queue.shift();
    if (!current || typeof current !== 'object' || seen.has(current)) continue;
    seen.add(current);

    for (const key of keys) {
      const value = current[key];
      if (value !== undefined && value !== null && value !== '' && isPrimitiveValue(value)) {
        return value;
      }
    }

    Object.values(current).forEach((value) => {
      if (value && typeof value === 'object') queue.push(value);
    });
  }

  return '';
};

const firstArrayValue = (source, keys) => {
  if (!source || typeof source !== 'object') return [];

  for (const key of keys) {
    const value = source[key];
    if (Array.isArray(value)) {
      return value;
    }
  }

  return [];
};

const firstArray = (...values) => {
  for (const value of values) {
    if (Array.isArray(value)) return value;
  }

  return [];
};

const normalizeComparable = (value = '') => String(value).trim().toLowerCase().replace(/[\s\u200c_-]+/g, '');
const EMPTY_VALUE_LABEL = '-';

const cleanReportText = (value = '') => {
  if (value === null || value === undefined) return '';

  const text = String(value)
  .replace(/\r?\n/g, ' ')
  .replace(/\\+"/g, '')
  .replace(/["'`“”]+/g, '')
  .replace(/:\s*"?\[\]"?/g, '')
  .replace(/"?\[\]"?/g, '')
  .replace(/^[:\s"']+|[:\s"']+$/g, '')
  .replace(/\s+/g, ' ')
  .trim();

  return /^(?:null|undefined)$/i.test(text) ? '' : text;
};

const normalizeAmountDigits = (value = '') => String(value)
  .replace(/[۰-۹]/g, (digit) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(digit))
  .replace(/[٠-٩]/g, (digit) => '٠١٢٣٤٥٦٧٨٩'.indexOf(digit));

const parseWalletAmount = (value) => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value !== 'string') return null;

  const normalized = normalizeAmountDigits(value).replace(/,/g, '');
  const match = normalized.match(/-?\d+(?:\.\d+)?/);
  if (!match) return null;

  const amount = Number(match[0]);
  return Number.isFinite(amount) ? amount : null;
};

const formatWalletAmount = (amount) => `${new Intl.NumberFormat('fa-IR').format(Number(amount) || 0)} تومان`;

const walletAmountKeys = [
  'wallet_balance',
  'walletBalance',
  'walletBalanceAmount',
  'wallet_amount',
  'walletAmount',
  'balance',
  'credit',
  'amount',
  'value',
  'total',
  'total_balance',
  'totalBalance',
];

const walletListKeys = [
  'wallets',
  'wallet_items',
  'walletItems',
  'business_wallets',
  'businessWallets',
  'collection_wallets',
  'collectionWallets',
  'balances',
  'items',
];

const walletTransactionKeys = [
  'wallet_transactions',
  'walletTransactions',
  'transactions',
  'history',
  'charges',
  'wallet_charges',
  'walletCharges',
];

const walletObjectKeys = ['wallet', 'user_wallet', 'userWallet', 'wallet_summary', 'walletSummary'];

const firstAmountValue = (source, keys = walletAmountKeys) => {
  if (!source || typeof source !== 'object') return null;

  for (const key of keys) {
    const amount = parseWalletAmount(source[key]);
    if (amount !== null) {
      return amount;
    }
  }

  return null;
};

const getReportParts = (payload) => {
  const data = payload?.data || payload || {};
  const report = data?.report || data?.discount_report || data?.discountReport || {};
  const user = data?.user || report?.user || payload?.user || {};

  return { data, report, user };
};

const getWalletCandidates = (payload, profile) => {
  const { data, report, user } = getReportParts(payload);
  const candidates = [profile, user, report, data, payload].filter(Boolean);

  candidates.slice().forEach((candidate) => {
    walletObjectKeys.forEach((key) => {
      if (candidate?.[key] && typeof candidate[key] === 'object') {
        candidates.push(candidate[key]);
      }
    });
  });

  return candidates;
};

const findWalletArrays = (payload, profile, keys) => getWalletCandidates(payload, profile).flatMap((candidate) => {
  if (!candidate || typeof candidate !== 'object') return [];

  return keys.flatMap((key) => (Array.isArray(candidate[key]) ? candidate[key] : []));
});

const getWalletBusinessName = (item, matchedProfile) => {
  if (isPrimitiveValue(item)) return matchedProfile?.title || 'مجموعه کی میای';

  const collection = item?.collection || item?.business || item?.brand || item?.shop;
  if (typeof collection === 'string') return cleanReportText(collection);

  return cleanReportText((collection && typeof collection === 'object' ? firstValue(collection, ['name', 'title', 'business_name', 'businessName', 'collection_name', 'collectionName', 'prefix']) : '') ||
    firstValue(item, ['title', 'name', 'business', 'business_name', 'businessName', 'collection_name', 'collectionName', 'brand_name', 'brandName']) ||
    getDeepValue(item, ['business_name', 'businessName', 'collection_name', 'collectionName', 'brand_name', 'brandName']) ||
    matchedProfile?.title ||
    'مجموعه کی میای');
};

const normalizeWalletBusiness = (item, index) => {
  const matchedProfile = findBusinessProfileForGift(item);
  const amount = firstAmountValue(item);
  const title = getWalletBusinessName(item, matchedProfile);

  return {
    id: getGiftCollectionId(item, matchedProfile) || title || `wallet-${index}`,
    title,
    amount: amount || 0,
    amountLabel: toPersianDigits(firstValue(item, ['balanceLabel', 'balance_label', 'formatted_balance', 'formattedBalance', 'amountLabel', 'amount_label']) || formatWalletAmount(amount || 0)),
    status: cleanReportText(firstValue(item, ['status', 'description', 'walletStatus']) || (amount > 0 ? `شارژ شده توسط ${title}` : 'هنوز شارژی ثبت نشده')),
    image: getGiftImage(item, matchedProfile) || matchedProfile?.image || defaultProfileAvatar,
  };
};

const normalizeWalletTransaction = (item, index) => {
  const matchedProfile = findBusinessProfileForGift(item);
  const amount = firstAmountValue(item);
  const business = getWalletBusinessName(item, matchedProfile);

  return {
    id: firstValue(item, ['id', 'transaction_id', 'transactionId']) || `${business}-${index}`,
    business,
    title: cleanReportText(firstValue(item, ['type', 'title', 'description', 'reason']) || 'شارژ کیف پول'),
    date: toPersianDigits(formatGregorianDateTime(firstValue(item, ['date', 'created_at', 'createdAt', 'updated_at', 'updatedAt'])) || ''),
    amount: amount || 0,
    amountLabel: toPersianDigits(firstValue(item, ['amountLabel', 'amount_label', 'formatted_amount', 'formattedAmount']) || `${amount >= 0 ? '+' : ''}${formatWalletAmount(amount || 0)}`),
  };
};

const buildWalletSummary = (payload, profile) => {
  const businessItems = findWalletArrays(payload, profile, walletListKeys)
    .map(normalizeWalletBusiness)
    .filter((item) => item.title || item.amount);
  const transactionItems = findWalletArrays(payload, profile, walletTransactionKeys)
    .map(normalizeWalletTransaction)
    .filter((item) => item.business || item.amount);

  const candidates = getWalletCandidates(payload, profile);
  const explicitTotal = candidates.reduce((found, candidate) => (
    found !== null ? found : firstAmountValue(candidate, ['total_wallet', 'totalWallet', 'wallet_total', 'walletTotal', 'total_balance', 'totalBalance', 'balance', 'wallet_balance', 'walletBalance'])
  ), null);
  const businessTotal = businessItems.reduce((sum, item) => sum + item.amount, 0);
  const transactionTotal = transactionItems.reduce((sum, item) => sum + Math.max(0, item.amount), 0);
  const total = explicitTotal !== null ? explicitTotal : businessTotal || transactionTotal || 0;

  return {
    total,
    totalLabel: toPersianDigits(formatWalletAmount(total)),
    businesses: businessItems,
    transactions: transactionItems,
  };
};

const hasPersianLetters = (value = '') => /[\u0600-\u06ff]/.test(String(value));

const isValidDiscountCode = (value = '') => {
  const normalized = cleanReportText(value);
  return /^[A-Za-z0-9_-]{4,}$/.test(normalized) && !hasPersianLetters(normalized);
};

const genericGiftLabels = new Set([
  'کد تخفیف',
  'هدیه فعال',
  'مجموعه کی میای',
]);

const isGenericGiftLabel = (value = '') => genericGiftLabels.has(cleanReportText(value));

const getGiftTitleFromDescription = (description = '') => {
  const text = cleanReportText(description);
  if (!text) return '';

  return text
    .replace(/^با خرید از مجموعه های دیگر از ما\s*/u, '')
    .replace(/\s*هدیه بگیرید.*$/u, '')
    .replace(/\s*(?:۰|0)?9[\d۰-۹\s-]{8,}.*$/u, '')
    .trim();
};

const cleanReportGiftText = (value = '') => cleanReportText(value)
  .replace(/\\+"/g, '')
  .replace(/\\/g, '')
  .replace(/^"+|"+$/g, '')
  .replace(/\[\]/g, '')
  .trim();

const getGiftTextFromExplicitField = (value) => {
  if (value === null || value === undefined) return '';

  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (isPrimitiveValue(item)) return cleanReportGiftText(item);

        return cleanReportGiftText(firstValue(item, ['title', 'name', 'gift_name', 'giftName', 'gift_title', 'giftTitle', 'label', 'text']));
      })
      .filter(Boolean)
      .join('، ');
  }

  if (typeof value === 'object') {
    return cleanReportGiftText(firstValue(value, ['title', 'name', 'gift_name', 'giftName', 'gift_title', 'giftTitle', 'label', 'text']));
  }

  return cleanReportGiftText(value);
};

const getReportGiftFieldText = (gift, collectionFallback) => {
  const sources = [];

  if (!isPrimitiveValue(gift) && gift && typeof gift === 'object') {
    sources.push(gift);

    const collection = gift.collection || gift.business || gift.brand || gift.code?.collection;
    if (collection && typeof collection === 'object') sources.push(collection);
  }

  if (collectionFallback && typeof collectionFallback === 'object') sources.push(collectionFallback);

  for (const source of sources) {
    if (Object.prototype.hasOwnProperty.call(source, 'gifts')) {
      return getGiftTextFromExplicitField(source.gifts);
    }
  }

  return '';
};

const isUsefulGiftDescription = (value = '') => {
  const text = cleanReportGiftText(value);
  if (!text || text === '[]') return false;

  const withoutNoise = text.replace(/["'[\]\s،,:：.-]/g, '');
  return withoutNoise.length > 2 && hasPersianLetters(withoutNoise);
};

const parsePrimitiveGiftText = (value = '') => {
  const text = cleanReportText(value);
  const separatorIndex = text.search(/\s*[:：]\s*/u);

  if (separatorIndex === -1) {
    return {
      collectionName: text,
      description: '',
    };
  }

  const collectionName = cleanReportText(text.slice(0, separatorIndex));
  const rawDescription = cleanReportGiftText(text.slice(separatorIndex + 1));

  return {
    collectionName,
    description: isUsefulGiftDescription(rawDescription) ? rawDescription : '',
  };
};

const formatGregorianDateTime = (value = '') => {
  const normalized = cleanReportText(value);
  if (!normalized) return '';

  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) return normalized;

  return new Intl.DateTimeFormat('fa-IR-u-ca-gregory', {
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Tehran',
  }).format(date);
};

const normalizeGiftStatus = (value, title, place) => {
  const normalized = cleanReportText(value);
  if (!normalized || normalized === title || normalized === place) return '\u0641\u0639\u0627\u0644';
  if (normalizeComparable(normalized) === normalizeComparable(title) || normalizeComparable(normalized) === normalizeComparable(place)) {
    return '\u0641\u0639\u0627\u0644';
  }

  const statusWords = ['\u0641\u0639\u0627\u0644', 'active', 'used', 'expired', '\u0645\u0646\u0642\u0636\u06cc', '\u0627\u0633\u062a\u0641\u0627\u062f\u0647'];
  const looksLikeDate = /\d{4}[-/]\d{1,2}[-/]\d{1,2}|\d{1,2}[-/]\d{1,2}[-/]\d{2,4}/.test(normalized);
  if (looksLikeDate) {
    return formatGregorianDateTime(normalized);
  }

  if (statusWords.some((word) => normalized.toLowerCase().includes(word))) {
    return normalized;
  }

  return '\u0641\u0639\u0627\u0644';
};

const isUsedGiftCode = (gift) => {
  if (isPrimitiveValue(gift)) return false;

  return gift?.is_used === 1 ||
    gift?.is_used === true ||
    gift?.is_used === '1' ||
    gift?.gift_used === 1 ||
    gift?.gift_used === true ||
    gift?.gift_used === '1' ||
    Boolean(gift?.used_at);
};

const isTruthyStatusFlag = (value) => value === 1 || value === true || value === '1';

const getGiftActiveValue = (gift, collectionFallback) => {
  if (isPrimitiveValue(gift)) return collectionFallback?.gift_active ?? collectionFallback?.giftActive;

  const collection = gift?.collection || gift?.business || gift?.brand || gift?.code?.collection || collectionFallback;
  return gift?.gift_active ??
    gift?.giftActive ??
    collection?.gift_active ??
    collection?.giftActive;
};

const getGiftTimeValue = (gift) => {
  if (isPrimitiveValue(gift)) return '';

  const collection = gift?.collection || gift?.business || gift?.brand || gift?.code?.collection;
  return firstValue(collection && typeof collection === 'object' ? collection : {}, ['expires_at', 'expire_at', 'expiresAt', 'status']) ||
    firstValue(gift, ['expires_at', 'expire_at', 'expiresAt', 'status']) ||
    '';
};

const giftImageKeys = [
  'profile_image',
  'profileImage',
  'profile_photo',
  'profilePhoto',
  'banner_image',
  'bannerImage',
  'image',
  'images',
  'logo',
  'logo_url',
  'logoUrl',
  'logo_path',
  'logoPath',
  'image_url',
  'imageUrl',
  'image_path',
  'imagePath',
  'photo',
  'photo_url',
  'photoUrl',
  'picture',
  'thumbnail',
  'avatar',
];

const mediaObjectKeys = [
  'url',
  'src',
  'path',
  'file',
  'file_path',
  'filePath',
  'filename',
  'file_name',
  'fileName',
];

const getMediaValue = (source) => {
  if (!source) return '';
  if (isPrimitiveValue(source)) return source;

  if (Array.isArray(source)) {
    return source.map(getMediaValue).find(Boolean) || '';
  }

  if (typeof source !== 'object') return '';

  const directMedia = firstValue(source, mediaObjectKeys);
  if (directMedia) return directMedia;

  for (const key of giftImageKeys) {
    const nestedMedia = getMediaValue(source[key]);
    if (nestedMedia) return nestedMedia;
  }

  return '';
};

const findBusinessProfileForGift = (gift) => {
  if (isPrimitiveValue(gift)) return null;

  const collection = gift?.collection || gift?.business || gift?.brand || gift?.code?.collection;
  const directCollectionIds = [
    firstValue(gift, ['collection_id', 'collectionId', 'business_id', 'businessId']),
    collection && typeof collection === 'object' ? firstValue(collection, ['collection_id', 'collectionId', 'id', 'business_id', 'businessId']) : '',
  ].filter(Boolean).map(String);
  const names = [
    typeof collection === 'string' ? collection : '',
    collection && typeof collection === 'object' ? firstValue(collection, ['prefix', 'slug', 'name', 'title', 'business_name', 'collection_name']) : '',
    cleanReportText(getDeepValue(gift, ['prefix', 'slug', 'collection_name', 'collectionName', 'business_name', 'businessName', 'brand', 'name']))
  ].filter(Boolean).map(normalizeComparable);

  const byName = businessProfiles.find((profile) => {
    const aliases = Array.isArray(profile.aliases) ? profile.aliases : [];
    const profileNames = [profile.title, profile.shortTitle, profile.id, profile.slug, ...aliases].filter(Boolean).map(normalizeComparable);
    return names.some((name) => profileNames.some((profileName) => name && profileName && (name.includes(profileName) || profileName.includes(name))));
  });

  if (byName) return byName;

  return businessProfiles.find((profile) => {
    const profileIds = [profile.collectionId, profile.id, profile.slug].filter(Boolean).map(String);
    return directCollectionIds.some((id) => profileIds.includes(id));
  });
};

const getGiftCollectionName = (gift, matchedProfile) => {
  if (isPrimitiveValue(gift)) return matchedProfile?.title || '\u06a9\u062f \u062a\u062e\u0641\u06cc\u0641';

  const collection = gift?.collection || gift?.business || gift?.brand || gift?.code?.collection;
  if (typeof collection === 'string') return cleanReportText(collection);
  return cleanReportText((collection && typeof collection === 'object' ? firstValue(collection, ['name', 'title', 'business_name', 'collection_name', 'prefix']) : '') ||
    getDeepValue(gift, ['collection_name', 'collectionName', 'business_name', 'businessName', 'brand_name', 'brandName', 'prefix']) ||
    matchedProfile?.title ||
    '\u0645\u062c\u0645\u0648\u0639\u0647 \u06a9\u06cc \u0645\u06cc\u0627\u06cc');
};

const findBusinessProfileByText = (value = '') => {
  const normalized = normalizeComparable(value);
  if (!normalized) return null;

  return businessProfiles.find((profile) => {
    const aliases = Array.isArray(profile.aliases) ? profile.aliases : [];
    const profileNames = [profile.title, profile.shortTitle, profile.id, profile.slug, ...aliases]
      .filter(Boolean)
      .map(normalizeComparable);

    return profileNames.some((profileName) => normalized.includes(profileName) || profileName.includes(normalized));
  }) || null;
};

const getGiftImage = (gift, matchedProfile) => {
  if (isPrimitiveValue(gift)) return normalizeMediaUrl(matchedProfile?.image || matchedProfile?.bannerImage || '');

  const collection = gift?.collection || gift?.business || gift?.brand || gift?.code?.collection;
  const collectionImage = collection && typeof collection === 'object' ? getMediaValue(collection) : '';
  const image = getMediaValue(gift) || collectionImage || getDeepValue(gift, giftImageKeys);
  return normalizeMediaUrl(image || matchedProfile?.image || matchedProfile?.bannerImage || '');
};

const getGiftCollectionId = (gift, matchedProfile) => {
  if (isPrimitiveValue(gift)) return matchedProfile?.collectionId || matchedProfile?.id || '';

  const collection = gift?.collection || gift?.business || gift?.brand || gift?.code?.collection;
  const collectionId = collection && typeof collection === 'object'
    ? firstValue(collection, ['collection_id', 'collectionId', 'id', 'business_id', 'businessId', 'prefix', 'slug'])
    : '';

  return firstValue(gift, ['collection_id', 'collectionId', 'business_id', 'businessId', 'prefix', 'slug']) ||
    collectionId ||
    matchedProfile?.collectionId ||
    matchedProfile?.id ||
    matchedProfile?.slug ||
    '';
};

const getGiftProfileHref = (gift, matchedProfile) => {
  if (isPrimitiveValue(gift)) {
    const primitiveRouteKey = matchedProfile?.collectionId || matchedProfile?.id || matchedProfile?.slug;
    return primitiveRouteKey ? `/collections/${primitiveRouteKey}` : '';
  }

  const collection = gift?.collection || gift?.business || gift?.brand || gift?.code?.collection;
  const collectionRouteKey = collection && typeof collection === 'object'
    ? firstValue(collection, ['collection_id', 'collectionId', 'id', 'prefix', 'slug'])
    : '';
  const directRouteKey =
    firstValue(gift, ['collection_id', 'collectionId', 'business_id', 'businessId', 'prefix', 'slug']) ||
    getDeepValue(gift, ['collection_id', 'collectionId', 'business_id', 'businessId']);
  const matchedRouteKey = matchedProfile?.collectionId || matchedProfile?.id || matchedProfile?.slug;
  const routeKey = directRouteKey || collectionRouteKey || matchedRouteKey;

  return routeKey ? `/collections/${routeKey}` : '';
};

const getCollectionLookupKeys = (collection = {}) => [
  firstValue(collection, ['id', 'collection_id', 'collectionId', 'business_id', 'businessId']),
  firstValue(collection, ['name', 'title', 'collection_name', 'collectionName', 'business_name', 'businessName']),
  firstValue(collection, ['prefix', 'slug']),
].filter(Boolean).map((value) => normalizeComparable(value));

const buildReportCollectionLookup = (payload) => {
  const lookup = new Map();
  const data = payload?.data || payload;
  const report = data?.report || data?.discount_report || data?.discountReport;
  const user = data?.user || report?.user || payload?.user;
  const allDiscountCodeItems = firstArray(
    user?.discount_codes,
    user?.discountCodes,
    report?.user?.discount_codes,
    report?.user?.discountCodes,
    payload?.user?.discount_codes,
    payload?.user?.discountCodes,
    payload?.data?.user?.discount_codes,
    payload?.data?.user?.discountCodes,
    payload?.discount_codes,
    payload?.discountCodes,
    payload?.data?.discount_codes,
    payload?.data?.discountCodes,
    report?.discount_codes,
    report?.discountCodes
  );

  expandGiftCollections(allDiscountCodeItems).forEach((item) => {
    if (isPrimitiveValue(item)) return;

    const collection = item?.collection || item?.business || item?.brand || item?.code?.collection;
    if (!collection || typeof collection !== 'object') return;

    getCollectionLookupKeys(collection).forEach((key) => {
      lookup.set(key, collection);
    });
  });

  return lookup;
};

const findCollectionInLookup = (lookup, gift) => {
  if (!lookup?.size) return null;

  const parsedGift = isPrimitiveValue(gift) ? parsePrimitiveGiftText(gift) : null;
  const candidates = [
    parsedGift?.collectionName,
    !isPrimitiveValue(gift) ? firstValue(gift, ['collection_id', 'collectionId', 'business_id', 'businessId']) : '',
    !isPrimitiveValue(gift) ? getGiftCollectionName(gift, null) : '',
  ].filter(Boolean).map((value) => normalizeComparable(value));

  for (const candidate of candidates) {
    if (lookup.has(candidate)) return lookup.get(candidate);

    for (const [key, collection] of lookup.entries()) {
      if (candidate.includes(key) || key.includes(candidate)) {
        return collection;
      }
    }
  }

  return null;
};

const normalizeGift = (gift, index, { includeCode = false, collectionFallback = null } = {}) => {
  const primitiveGift = isPrimitiveValue(gift) ? parsePrimitiveGiftText(gift) : null;
  const primitiveCode = includeCode && isPrimitiveValue(gift) ? String(gift) : '';
  const initialMatchedProfile = primitiveGift
    ? findBusinessProfileByText(primitiveGift.collectionName)
    : findBusinessProfileForGift(gift);
  const fallbackName = collectionFallback && typeof collectionFallback === 'object'
    ? firstValue(collectionFallback, ['name', 'title', 'collection_name', 'collectionName', 'business_name', 'businessName'])
    : '';
  const collectionName = primitiveGift?.collectionName || fallbackName || getGiftCollectionName(gift, initialMatchedProfile);
  const matchedProfile = initialMatchedProfile || findBusinessProfileByText(collectionName);
  const rawCode = primitiveCode || (primitiveGift ? '' : getDeepValue(gift, ['code', 'discount_code', 'discountCode', 'coupon_code', 'couponCode', 'user_code', 'userCode', 'generated_code', 'generatedCode', 'token', 'discount_token', 'discountToken']));
  const code = includeCode && isValidDiscountCode(rawCode) ? cleanReportText(rawCode) : '';
  const fallbackDescription = collectionFallback && typeof collectionFallback === 'object'
    ? cleanReportText(firstValue(collectionFallback, ['description', 'gift_description', 'giftDescription', 'text', 'content', 'body']))
    : '';
  const reportDescription = primitiveGift ? '' : cleanReportText(getDeepValue(gift, ['description', 'gift_description', 'giftDescription', 'text', 'content', 'body']));
  const description = primitiveGift?.description ||
    (isUsefulGiftDescription(reportDescription) ? reportDescription : '') ||
    fallbackDescription;
  const rawTitle = primitiveGift ? '' : cleanReportText(getDeepValue(gift, ['title', 'gift_name', 'giftName', 'gift_title', 'giftTitle', 'discount_title', 'discountTitle', 'code_title', 'codeTitle']));
  const explicitGiftText = getReportGiftFieldText(gift, collectionFallback);
  const title = rawTitle || collectionName || '\u0647\u062f\u06cc\u0647 \u0641\u0639\u0627\u0644';
  const giftText = explicitGiftText || EMPTY_VALUE_LABEL;
  const time = normalizeGiftStatus(getGiftTimeValue(gift), title, collectionName);

  const fallbackGift = collectionFallback ? { collection: collectionFallback } : null;
  const apiImage = (primitiveGift ? '' : getGiftImage(gift, null)) || (fallbackGift ? getGiftImage(fallbackGift, null) : '');
  const fallbackImage = (fallbackGift ? getGiftImage(fallbackGift, null) : '') || getGiftImage({}, matchedProfile);
  const href = getGiftProfileHref(gift, matchedProfile);
  const activeValue = getGiftActiveValue(gift, collectionFallback);
  const isActive = isTruthyStatusFlag(activeValue);

  return {
    id: getDeepValue(gift, ['id', 'discount_id', 'discountId', 'code_id', 'codeId']) || code || `${title}-${index}`,
    title,
    place: collectionName,
    collectionId: getGiftCollectionId(gift, matchedProfile),
    time: toPersianDigits(time),
    image: apiImage || fallbackImage,
    imageFallback: fallbackImage,
    href,
    code,
    description,
    giftText,
    isActive,
    statusLabel: isActive ? 'فعال' : 'غیرفعال',
    isUsed: isUsedGiftCode(gift),
  };
};

const giftChildKeys = [
  'active_gifts',
  'activeGifts',
  'gifts',
  'items',
  'discounts',
  'discount_codes',
  'discountCodes',
  'codes',
];

const mergeGiftWithCollection = (gift, collection) => {
  if (isPrimitiveValue(gift)) {
    return {
      code: String(gift),
      collection,
      collection_id: firstValue(collection, ['collection_id', 'collectionId', 'id', 'business_id', 'businessId']),
      collection_name: firstValue(collection, ['collection_name', 'collectionName', 'name', 'title', 'business_name', 'businessName']),
    };
  }

  return {
    ...gift,
    collection: gift.collection || collection.collection || collection,
    collection_id: firstValue(gift, ['collection_id', 'collectionId', 'business_id', 'businessId']) ||
      firstValue(collection, ['collection_id', 'collectionId', 'id', 'business_id', 'businessId']),
    collection_name: firstValue(gift, ['collection_name', 'collectionName', 'business_name', 'businessName']) ||
      firstValue(collection, ['collection_name', 'collectionName', 'name', 'title', 'business_name', 'businessName']),
    profile_image: getMediaValue(gift) ||
      getMediaValue(collection),
  };
};

const expandGiftCollections = (items) => items.flatMap((item) => {
  if (isPrimitiveValue(item)) return [item];

  const childGifts = firstArrayValue(item, giftChildKeys);

  if (!childGifts.length) {
    return [item];
  }

  return childGifts.map((gift) => mergeGiftWithCollection(gift, item));
});

const normalizeGiftListFromPayload = (payload) => {
  const reportItems = expandGiftCollections(extractActiveGiftsFromReport(payload));
  const collectionLookup = buildReportCollectionLookup(payload);
  return reportItems.map((gift, index) => {
    const collectionFallback = findCollectionInLookup(collectionLookup, gift);
    const source = isPrimitiveValue(gift) && collectionFallback
      ? { collection: collectionFallback }
      : gift;

    return normalizeGift(source, index, { collectionFallback });
  });
};

const normalizeDiscountCodeListFromPayload = (payload) =>
  expandGiftCollections(extractActiveDiscountCodesFromReport(payload))
    .map((gift, index) => normalizeGift(gift, index, { includeCode: true }))
    .filter((gift) => gift.code);

const groupGiftItems = (items, { compactRows = false } = {}) => {
  const groups = new Map();

  items.forEach((gift) => {
    const hasUsefulCollection = gift.place && !isGenericGiftLabel(gift.place);
    const titleLooksLikeCollection = isGenericGiftLabel(gift.place) && gift.title;
    const groupTitle = hasUsefulCollection ? gift.place : titleLooksLikeCollection ? gift.title : gift.place || 'مجموعه کی میای';
    const rowTitle = compactRows
      ? 'کد تخفیف'
      : gift.giftText || (hasUsefulCollection ? gift.title : 'هدیه فعال');
    const normalizedGift = {
      ...gift,
      title: rowTitle,
      time: compactRows ? (gift.isUsed ? 'استفاده شده' : 'فعال') : gift.time,
    };
    const key = gift.collectionId || groupTitle || gift.href || gift.id || 'gifts';
    const existing = groups.get(key);

    if (existing) {
      existing.gifts.push(normalizedGift);
      return;
    }

    groups.set(key, {
      id: key,
      title: groupTitle,
      image: gift.image,
      imageFallback: gift.imageFallback,
      href: gift.href,
      gifts: [normalizedGift],
    });
  });

  return Array.from(groups.values());
};

function DashboardPage({ isVisible, sectionRequest, userProfile, onEditProfile, onLogout, onProfileFromReport }) {
  const [activeSection, setActiveSection] = useState('gifts');
  const [activeGiftItems, setActiveGiftItems] = useState([]);
  const [activeDiscountCodeItems, setActiveDiscountCodeItems] = useState([]);
  const [walletSummary, setWalletSummary] = useState(() => buildWalletSummary(null, userProfile));
  const [isReportLoading, setIsReportLoading] = useState(false);
  const [reportError, setReportError] = useState('');

  const profileName = useMemo(() => getProfileName(userProfile), [userProfile]);
  const profileMobile = toPersianDigits(getProfileField(userProfile, ['mobile', 'phone', 'phone_number', 'mobile_number']));
  const profileEmail = getProfileField(userProfile, ['email']);
  const profileBirthDate = toPersianDigits(getProfileField(userProfile, ['birthDate', 'birth_date', 'date', 'birthday']));
  const profileIsComplete = isProfileComplete(userProfile);
  const rawProfilePoints = getProfileField(userProfile, ['points', 'score']);
  const profilePoints = rawProfilePoints === undefined || rawProfilePoints === null || rawProfilePoints === ''
    ? 0
    : rawProfilePoints;
  const profileLevel = profileIsComplete ? 'اطلاعات تکمیل شده' : 'تکمیل نشده';
  const profileScore = `${toPersianDigits(profilePoints)} امتیاز`;
  const profileAvatar = getProfileAvatar(userProfile) || defaultProfileAvatar;
  const activeGiftTotal = activeGiftItems.length + activeDiscountCodeItems.length;

  const loadActiveGifts = async () => {
    try {
      setIsReportLoading(true);
      setReportError('');
      const data = await getDiscountReport();

      const reportProfile = extractUserProfileFromReport(data);
      if (reportProfile) {
        onProfileFromReport?.(reportProfile);
      }
      setWalletSummary(buildWalletSummary(data, reportProfile || userProfile));
      setActiveGiftItems(normalizeGiftListFromPayload(data));
      setActiveDiscountCodeItems(normalizeDiscountCodeListFromPayload(data));
    } catch (error) {
      setActiveGiftItems([]);
      setActiveDiscountCodeItems([]);
      setWalletSummary(buildWalletSummary(null, userProfile));
      setReportError('دریافت هدیه‌ها انجام نشد.');
    } finally {
      setIsReportLoading(false);
    }
  };

  useEffect(() => {
    if (isVisible) {
      loadActiveGifts();
    }
  }, [isVisible]);

  useEffect(() => {
    setWalletSummary((current) => {
      if (current.businesses.length || current.transactions.length || current.total) {
        return current;
      }

      return buildWalletSummary(null, userProfile);
    });
  }, [userProfile]);

  const scrollSectionIntoComfortView = (targetId, { alignToTop = false } = {}) => {
    const target = document.getElementById(targetId);
    if (!target) {
      return;
    }

    if (alignToTop) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    const rect = target.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const pageYOffset = window.pageYOffset || document.documentElement.scrollTop || 0;
    const maxScrollTop = Math.max(0, document.documentElement.scrollHeight - viewportHeight);
    const topLimit = 96;
    const bottomLimit = 48;
    const lowerRevealLimit = viewportHeight - bottomLimit;
    const lowerStartLimit = lowerRevealLimit - 120;
    let scrollDelta = 0;

    if (rect.height <= viewportHeight - topLimit - bottomLimit && rect.bottom > lowerRevealLimit) {
      scrollDelta = rect.bottom - lowerRevealLimit;
    } else if (rect.top > lowerStartLimit) {
      scrollDelta = rect.top - lowerStartLimit;
    } else if (rect.top < topLimit) {
      scrollDelta = rect.top - topLimit;
    }

    if (Math.abs(scrollDelta) > 4) {
      const nextScrollTop = Math.min(Math.max(pageYOffset + scrollDelta, 0), maxScrollTop);
      window.scrollTo({ top: nextScrollTop, behavior: 'smooth' });
    }
  };

  const showSection = (section, { shouldScroll = true, alignToTop = false } = {}) => {
    if (section === 'faq') {
      window.location.href = '/faq';
      return;
    }

    if (disabledSections.has(section)) {
      setActiveSection('gifts');
      return;
    }

    setActiveSection(section);
    if (!shouldScroll) {
      return;
    }

    window.setTimeout(() => {
      const isMobile = window.matchMedia?.('(max-width: 768px)').matches;
      const targetId = isMobile
        ? section === 'account'
          ? 'mobile-account'
          : 'mobile-dashboard-section'
        : 'dashboard-active-section';

      scrollSectionIntoComfortView(targetId, { alignToTop: alignToTop && isMobile });
    }, 0);
  };

  useEffect(() => {
    if (isVisible && sectionRequest?.section) {
      showSection(sectionRequest.section, { shouldScroll: true });
    }
  }, [isVisible, sectionRequest]);

  if (!isVisible) {
    return null;
  }

  const renderGiftList = (items, { mobile = false, showCodes = false, emptyMessage }) => {
    if (!items.length) {
      return <p className="dashboard-empty-state">{emptyMessage}</p>;
    }

    const listClass = mobile ? 'mobile-active-gifts-list' : 'active-gifts-grid';
    const itemClass = mobile ? 'mobile-active-gift' : 'active-gift-card';
    const groupedGifts = groupGiftItems(items, { compactRows: showCodes });

    return (
      <div className={listClass}>
        {groupedGifts.map((group) => (
          <article className={itemClass} key={group.id}>
            {group.href ? (
              <Link className="active-gift-media-link" href={group.href} aria-label={`مشاهده پروفایل ${group.title}`}>
                {group.image ? <img src={group.image} alt={group.title} onError={(event) => handleGiftImageError(event, group.imageFallback)} /> : <div className="active-gift-fallback"><Gift /></div>}
              </Link>
            ) : group.image ? <img src={group.image} alt={group.title} onError={(event) => handleGiftImageError(event, group.imageFallback)} /> : <div className="active-gift-fallback"><Gift /></div>}
            <div className="active-gift-fallback active-gift-fallback-broken"><Gift /></div>
            <div className="active-gift-card-body">
              <h3>{group.title}</h3>
              <ul className="active-gift-list">
                {group.gifts.map((gift) => (
                  <li key={gift.id} className={showCodes ? 'has-discount-code' : ''}>
                    <div>
                      <strong>{gift.title}</strong>
                      {showCodes ? (
                        <small>{gift.time}</small>
                      ) : (
                        <small className="active-gift-meta-line">
                          <span className={`active-gift-status-badge ${gift.isActive ? 'is-active' : 'is-inactive'}`}>{gift.statusLabel}</span>
                        </small>
                      )}
                    </div>
                    {showCodes ? (
                      <div className="active-gift-code-cell">
                        <span dir="ltr">{gift.code}</span>
                        {gift.isUsed ? <span className="active-gift-used-badge">استفاده شده</span> : null}
                      </div>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    );
  };

  const renderActiveGifts = (mobile = false) => {
    if (isReportLoading) {
      return <p className="dashboard-empty-state">در حال دریافت هدیه‌ها...</p>;
    }

    if (reportError) {
      return <p className="dashboard-empty-state">{reportError}</p>;
    }

    if (!activeGiftItems.length && !activeDiscountCodeItems.length) {
      return <p className="dashboard-empty-state">هدیه‌ای برای این حساب ثبت نشده است.</p>;
    }

    return (
      <div className="dashboard-gifts-sections">
        <section className="dashboard-gift-subsection">
          <div className="dashboard-gift-subsection-head">
            <div>
              <Gift />
              <h3>هدیه ها</h3>
            </div>
            <span>{toPersianDigits(activeGiftItems.length)} هدیه</span>
          </div>
          {renderGiftList(activeGiftItems, {
            mobile,
            showCodes: false,
            emptyMessage: 'هدیه‌ای برای این حساب ثبت نشده است.',
          })}
        </section>

        <section className="dashboard-gift-subsection dashboard-gift-subsection--codes">
          <div className="dashboard-gift-subsection-head">
            <div>
              <TicketPercent />
              <h3>کد های فعال</h3>
            </div>
            <span>{toPersianDigits(activeDiscountCodeItems.length)} کد</span>
          </div>
          {renderGiftList(activeDiscountCodeItems, {
            mobile,
            showCodes: true,
            emptyMessage: 'کد تخفیف فعالی برای این حساب ثبت نشده است.',
          })}
        </section>
      </div>
    );
  };

  const renderWallet = (mobile = false) => {
    const walletBusinesses = walletSummary.businesses;
    const walletTransactions = walletSummary.transactions.slice(0, 4);

    if (mobile) {
      return (
        <section className="mobile-wallet-card">
          <div className="mobile-wallet-head">
            <span><Wallet /> کیف پول</span>
            <strong>{walletSummary.totalLabel}</strong>
          </div>
          {walletBusinesses.length ? (
            <div className="mobile-wallet-list">
              {walletBusinesses.map((business) => (
                <article className="mobile-wallet-business" key={business.id}>
                  <img src={business.image} alt={business.title} />
                  <div>
                    <h3>{business.title}</h3>
                    <p>{business.amountLabel}</p>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="dashboard-empty-state">شارژی برای کیف پول این حساب ثبت نشده است.</p>
          )}
        </section>
      );
    }

    return (
      <section className="panel wallet-panel">
        <div className="wallet-summary">
          <div>
            <span className="wallet-eyebrow">کیف پول کاربر</span>
            <h2><Wallet /> موجودی کلی کیف پول</h2>
            <p>مجموع شارژهای ثبت‌شده برای این کاربر و سهم هر مجموعه به صورت خلاصه نمایش داده می‌شود.</p>
          </div>
          <div className="wallet-total-card">
            <span>موجودی کل</span>
            <strong>{walletSummary.totalLabel}</strong>
            <small>{toPersianDigits(walletBusinesses.length)} مجموعه</small>
          </div>
        </div>

        {walletBusinesses.length ? (
          <div className="wallet-business-grid">
            {walletBusinesses.map((business) => (
              <article className="wallet-business-card" key={business.id}>
                <img src={business.image} alt={business.title} />
                <div>
                  <h3>{business.title}</h3>
                  <strong>{business.amountLabel}</strong>
                  <span>{business.status}</span>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="dashboard-empty-state">شارژی برای کیف پول این حساب ثبت نشده است.</p>
        )}

        {walletTransactions.length ? (
          <div className="wallet-history">
            <h3>آخرین شارژها</h3>
            {walletTransactions.map((transaction) => (
              <article className="wallet-history-item" key={transaction.id}>
                <RefreshCw />
                <div>
                  <strong>{transaction.business}</strong>
                  <span>{transaction.title}</span>
                </div>
                <p>{transaction.date || 'ثبت نشده'}</p>
                <b className={transaction.amount < 0 ? 'is-debit' : 'is-credit'}>{transaction.amountLabel}</b>
              </article>
            ))}
          </div>
        ) : null}
      </section>
    );
  };

  return (
    <section className="dashboard-page">
      <section className="mobile-dashboard">
        <section className="mobile-profile-card" id="mobile-account">
          <img src={profileAvatar} alt={profileName} />
          <div>
            <h1>{profileName}</h1>
            <strong className="mobile-profile-points">{profileScore}</strong>
            <button type="button" onClick={onEditProfile}>تکمیل / ویرایش اطلاعات</button>
          </div>
        </section>

        <section className="mobile-dashboard-section" id="mobile-dashboard-section">
          {activeSection === 'gifts' && (
            <section className="mobile-section-card">
              <div className="mobile-section-head">
                <h2>هدیه‌های من</h2>
                <span>{toPersianDigits(activeGiftTotal)} مورد</span>
              </div>
              {renderActiveGifts(true)}
            </section>
          )}

          {activeSection === 'wallet' && renderWallet(true)}
        </section>

        <section className="mobile-profile-menu">
          {mobileProfileLinks.filter(isEnabledDashboardItem).map(({ title, icon: Icon }) => {
            const section = getActionSection(title);

            return (
              <button
                className={`mobile-profile-item ${activeSection === section ? 'is-active' : ''}`}
                type="button"
                key={title}
                onClick={() => showSection(section)}
              >
                <Icon />
                <span>{title}</span>
              </button>
            );
          })}
          <button className="mobile-profile-item" type="button" onClick={onLogout}>
            <LogOut />
            <span>خروج از حساب</span>
          </button>
        </section>
      </section>

      <section className="dashboard-hero desktop-dashboard-block" id="dashboard-account">
        <div className="hero-lines" />
        <img className="dashboard-avatar" src={profileAvatar} alt={profileName} />
        <div className="dashboard-user-copy">
          <h1><Crown /> {profileName}</h1>
          <p>سطح شما: <span>{profileLevel}</span></p>
          <strong>{profileScore}</strong>
        </div>
      </section>

      <section className="dashboard-actions desktop-dashboard-block" aria-label="بخش‌های داشبورد">
        {dashboardActions.filter(isEnabledDashboardItem).map(({ title, icon: Icon }) => {
          const section = getActionSection(title);

          return (
            <button
              className={`dashboard-action-card ${activeSection === section ? 'is-active' : ''}`}
              type="button"
              key={title}
              onClick={() => showSection(section)}
              aria-pressed={activeSection === section}
            >
              <Icon />
              <span>{title}</span>
            </button>
          );
        })}
      </section>

      <div className="desktop-dashboard-block dashboard-dynamic-section" id="dashboard-active-section">
        {activeSection === 'account' && (
          <section className="panel account-panel">
            <div className="panel-head-row">
              <h2>اطلاعات حساب</h2>
              <button className="dashboard-inline-action" type="button" onClick={onEditProfile}>
                <PencilLine />
                <span>ویرایش اطلاعات</span>
              </button>
            </div>
            <div className="account-info-grid">
              <article>
                <span className="account-info-icon"><UserRound /></span>
                <div>
                  <span>{'\u0646\u0627\u0645 \u06a9\u0627\u0631\u0628\u0631'}</span>
                  <strong>{profileName}</strong>
                </div>
              </article>
              <article>
                <span className="account-info-icon"><Phone /></span>
                <div>
                  <span>{'\u0634\u0645\u0627\u0631\u0647 \u062a\u0645\u0627\u0633'}</span>
                  <strong dir="ltr">{profileMobile || '\u062b\u0628\u062a \u0646\u0634\u062f\u0647'}</strong>
                </div>
              </article>
              <article>
                <span className="account-info-icon"><Mail /></span>
                <div>
                  <span>{'\u0627\u06cc\u0645\u06cc\u0644'}</span>
                  <strong dir="ltr">{profileEmail || '\u062b\u0628\u062a \u0646\u0634\u062f\u0647'}</strong>
                </div>
              </article>
              <article>
                <span className="account-info-icon"><CalendarDays /></span>
                <div>
                  <span>{'\u062a\u0627\u0631\u06cc\u062e \u062a\u0648\u0644\u062f'}</span>
                  <strong>{profileBirthDate || '\u062b\u0628\u062a \u0646\u0634\u062f\u0647'}</strong>
                </div>
              </article>
              <article>
                <span className="account-info-icon"><Crown /></span>
                <div>
                  <span>{'\u0627\u0645\u062a\u06cc\u0627\u0632 \u06a9\u0627\u0631\u0628\u0631'}</span>
                  <strong>{profileScore}</strong>
                </div>
              </article>
            </div>
          </section>
        )}

        {activeSection === 'gifts' && (
          <section className="panel active-gifts-panel" id="all-active-gifts">
            <div className="panel-head-row">
              <h2>هدیه‌های من</h2>
              <button type="button" className="dashboard-inline-action" onClick={loadActiveGifts}>بروزرسانی</button>
            </div>
            {renderActiveGifts(false)}
          </section>
        )}

        {activeSection === 'wallet' && renderWallet(false)}
      </div>
    </section>
  );
}

export default DashboardPage;
