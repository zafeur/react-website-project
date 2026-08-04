import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  ChevronLeft,
  ChevronRight,
  Gift,
  LogIn,
  Moon,
  MousePointerClick,
  Search,
  ShoppingBag,
  Sparkles,
  Star,
  Store,
  Sun,
  TicketPercent,
  Trophy,
} from 'lucide-react';
import LoginModal from './LoginModal';
import MobileBottomNav from './MobileBottomNav';
import { sendOtp, verifyOtp } from '../api/auth';
import { getDiscountCards, getHomePageData, requestDiscountCode } from '../api/home';
import { getTokenFromAuthResponse, getUserTypeFromAuthResponse, hasAuthToken, setAuthToken } from '../helper/authCookie';

const t = {
  brand: "\u06a9\u06cc \u0645\u06cc\u0627\u06cc",
  home: "\u0635\u0641\u062d\u0647 \u0627\u0635\u0644\u06cc",
  gifts: "\u0647\u062f\u0627\u06cc\u0627",
  businesses: "\u06a9\u0633\u0628\u200c\u0648\u06a9\u0627\u0631\u0647\u0627",
  shop: "\u0641\u0631\u0648\u0634\u06af\u0627\u0647\u06cc",
  club: "\u0628\u0627\u0634\u06af\u0627\u0647 \u0645\u0634\u062a\u0631\u06cc\u0627\u0646",
  faq: "\u0633\u0648\u0627\u0644\u0627\u062a \u0645\u062a\u062f\u0627\u0648\u0644",
  contact: "\u062a\u0645\u0627\u0633 \u0628\u0627 \u0645\u0627",
  darkMode: "\u062d\u0627\u0644\u062a \u062a\u0627\u0631\u06cc\u06a9",
  lightMode: "\u062d\u0627\u0644\u062a \u0631\u0648\u0634\u0646",
  login: "\u0648\u0631\u0648\u062f / \u062b\u0628\u062a \u0646\u0627\u0645",
  restaurant: "\u0631\u0633\u062a\u0648\u0631\u0627\u0646 \u0645\u0644\u0644",
  free: "\u0631\u0627\u06cc\u06af\u0627\u0646",
  discount: "\u062a\u062e\u0641\u06cc\u0641",
  special: "\u0648\u06cc\u0698\u0647",
  bastani: "\u0628\u0627\u0633\u062a\u0627\u0646\u06cc",
  barial: "\u0628\u0631\u06cc\u0627\u0644",
  dorato: "\u062f\u0648\u0631\u0627\u062a\u0648",
  ibamo: "\u0627\u06cc\u0628\u0627\u0645\u0648",
  mojalal: "\u0645\u062c\u0644\u0644",
  bakhshi: "\u0628\u062e\u0634\u06cc",
  heroKicker: "\u062f\u0646\u06cc\u0627\u06cc \u0647\u062f\u06cc\u0647\u200c\u0647\u0627 \u0648 \u062a\u062e\u0641\u06cc\u0641\u200c\u0647\u0627",
  heroTitle: "\u06a9\u06cc \u0645\u06cc\u0627\u06cc\u061b \u06cc\u06a9 \u0634\u0631\u0648\u0639 \u0647\u0645\u0627\u0647\u0646\u06af \u0628\u0627 \u0628\u0627\u0642\u06cc \u0633\u0627\u06cc\u062a",
  heroText: "\u0628\u0631\u0646\u062f\u0647\u0627\u060c \u0647\u062f\u06cc\u0647\u200c\u0647\u0627 \u0648 \u067e\u06cc\u0634\u0646\u0647\u0627\u062f\u0647\u0627\u06cc \u0648\u06cc\u0698\u0647 \u0628\u0627 \u0647\u0645\u0627\u0646 \u0632\u0628\u0627\u0646 \u0628\u0635\u0631\u06cc \u0635\u0641\u062d\u0627\u062a \u062f\u0627\u062e\u0644\u06cc \u0646\u0645\u0627\u06cc\u0634 \u062f\u0627\u062f\u0647 \u0634\u062f\u0647\u200c\u0627\u0646\u062f.",
  viewRestaurant: "\u0645\u0634\u0627\u0647\u062f\u0647 \u0635\u0641\u062d\u0647 \u0631\u0633\u062a\u0648\u0631\u0627\u0646",
  seeGifts: "\u062f\u06cc\u062f\u0646 \u0647\u062f\u0627\u06cc\u0627",
  selectedBrands: "\u0628\u0631\u0646\u062f\u0647\u0627\u06cc \u0645\u0646\u062a\u062e\u0628",
  popularBusinesses: "\u06a9\u0633\u0628\u200c\u0648\u06a9\u0627\u0631\u0647\u0627\u06cc \u0645\u062d\u0628\u0648\u0628",
  fastPath: "\u0645\u0633\u06cc\u0631 \u0633\u0631\u06cc\u0639 \u0628\u0631\u0627\u06cc \u067e\u06cc\u062f\u0627 \u06a9\u0631\u062f\u0646 \u0647\u062f\u06cc\u0647",
  freshOffers: "\u067e\u06cc\u0634\u0646\u0647\u0627\u062f\u0647\u0627\u06cc \u062a\u0627\u0632\u0647",
  activeGifts: "\u0647\u062f\u06cc\u0647\u200c\u0647\u0627 \u0648 \u062a\u062e\u0641\u06cc\u0641\u200c\u0647\u0627\u06cc \u0641\u0639\u0627\u0644",
  all: "\u0645\u0634\u0627\u0647\u062f\u0647 \u0647\u0645\u0647",
  receive: "\u062f\u0631\u06cc\u0627\u0641\u062a",
  close: "\u0628\u0633\u062a\u0646",
  wait: "\u0644\u0637\u0641\u0627 \u0635\u0628\u0631 \u06a9\u0646\u06cc\u062f...",
  discountCode: "\u06a9\u062f \u062a\u062e\u0641\u06cc\u0641 \u0634\u0645\u0627",
  discountRequested: "\u062f\u0631\u062e\u0648\u0627\u0633\u062a \u0634\u0645\u0627 \u062b\u0628\u062a \u0634\u062f.",
  discountFailed: "\u062f\u0631\u06cc\u0627\u0641\u062a \u06a9\u062f \u062a\u062e\u0641\u06cc\u0641 \u0627\u0646\u062c\u0627\u0645 \u0646\u0634\u062f.",
  search: "\u062c\u0633\u062a\u062c\u0648\u06cc \u0628\u0631\u0646\u062f\u060c \u0647\u062f\u06cc\u0647 \u06cc\u0627 \u067e\u06cc\u0634\u0646\u0647\u0627\u062f...",
  bannerAlt: "\u0628\u0646\u0631 \u067e\u06cc\u0634\u0646\u0647\u0627\u062f \u0648\u06cc\u0698\u0647",
  footerText: "\u0647\u062f\u06cc\u0647\u200c\u0647\u0627\u060c \u062a\u062e\u0641\u06cc\u0641\u200c\u0647\u0627 \u0648 \u0628\u0627\u0634\u06af\u0627\u0647 \u0645\u0634\u062a\u0631\u06cc\u0627\u0646 \u062f\u0631 \u06cc\u06a9 \u062a\u062c\u0631\u0628\u0647 \u0633\u0627\u062f\u0647 \u0648 \u0647\u0645\u0627\u0647\u0646\u06af.",
  gift1: "\u0622\u06cc\u0633 \u0622\u0645\u0631\u06cc\u06a9\u0627\u0646\u0648 \u0631\u0627\u06cc\u06af\u0627\u0646",
  gift2: "\u06f2\u06f0\u066a \u062a\u062e\u0641\u06cc\u0641 \u0633\u0641\u0627\u0631\u0634 \u0627\u0632 \u0628\u0631\u06cc\u0627\u0644",
  gift3: "\u0647\u062f\u06cc\u0647 \u0648\u06cc\u0698\u0647 \u062e\u0631\u06cc\u062f \u0627\u0632 \u062f\u0648\u0631\u0627\u062a\u0648",
  sendFailed: "\u0627\u0631\u0633\u0627\u0644 \u06a9\u062f \u0627\u0646\u062c\u0627\u0645 \u0646\u0634\u062f.",
  serverError: "\u062e\u0637\u0627 \u062f\u0631 \u0627\u0631\u062a\u0628\u0627\u0637 \u0628\u0627 \u0633\u0631\u0648\u0631",
};

const asset = (path) => `/home/${path}`;

const storyDisplayTitleByTitle = {};

const getStoryDisplayTitle = (title) => storyDisplayTitleByTitle[title] || title;

const storyVideoByTitle = {
  [t.barial]: asset('videos/barial.mp4'),
  [t.bastani]: asset('videos/bastani.mp4'),
  [t.dorato]: asset('videos/dorato.mp4'),
  [t.ibamo]: asset('videos/ibamo.mp4'),
  [t.mojalal]: asset('videos/mojalal.mp4'),
  [t.bakhshi]: asset('videos/bakhshi.mp4'),
};

const extraSliderBanners = [
  { title: t.ibamo, image: asset('img/banner/bannerweb ibamo.telegram.jpg') },
  { title: t.mojalal, image: asset('img/banner/bannerweb mojalal.telegram.jpg') },
  { title: t.dorato, image: asset('img/banner/bannerweb dorato.telegram.jpg') },
];

const mergeExtraBanners = (banners) => [...banners, ...extraSliderBanners];

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.VITE_API_BASE_URL || '';

const normalizeMediaUrl = (value, fallback) => {
  if (!value) {
    return fallback;
  }

  if (/^(https?:|data:|blob:|\/)/.test(value)) {
    return value;
  }

  if (apiBaseUrl) {
    try {
      return new URL(value, apiBaseUrl).toString();
    } catch {
      return `/${value}`;
    }
  }

  return `/${value}`;
};

const defaultHomeData = {
  stories: [
  { title: getStoryDisplayTitle(t.bastani), image: asset('img/business-banners/bastani-logo-enhanced.png'), video: storyVideoByTitle[t.bastani] },
  { title: t.barial, image: asset('img/barial.jpg'), video: storyVideoByTitle[t.barial] },
  { title: t.dorato, image: asset('img/logo dorato.jpg'), video: storyVideoByTitle[t.dorato] },
  { title: t.ibamo, image: asset('img/logo ibamo.jpg'), video: storyVideoByTitle[t.ibamo] },
  { title: getStoryDisplayTitle(t.mojalal), image: asset('img/mojalal.jpg'), video: storyVideoByTitle[t.mojalal] },
  { title: t.bakhshi, image: asset('img/bakhshi.jpg'), video: storyVideoByTitle[t.bakhshi] },
],

  banners: [
  { title: t.bastani, image: asset('img/banner/bannerweb bastani.6ff0aa72.jpg') },
  { title: t.barial, image: asset('img/banner/bannerweb barial.15abe337.jpg') },
  { title: t.bakhshi, image: asset('img/banner/bannerweb bakhshi.e2078af9 (1).jpg') },
],

  brands: [
  { title: t.restaurant, businessId: 'melal', image: asset('img/restaurant-melal.png'), href: '/restaurant' },
  { title: t.barial, businessId: 'barial', image: asset('img/barial.jpg'), href: '/business/barial' },
  { title: t.dorato, businessId: 'dorato', image: asset('img/logo dorato.jpg'), href: '/business/dorato' },
  { title: t.bastani, businessId: 'bastani', image: asset('img/business-banners/bastani-logo-enhanced.png'), href: '/business/bastani' },
  { title: t.ibamo, businessId: 'ibamo', image: asset('img/logo ibamo.jpg'), href: '/business/ibamo' },
  { title: t.mojalal, businessId: 'mojalal', image: asset('img/mojalal.jpg'), href: '/business/mojalal' },
],

  categories: [
  { title: t.gifts, icon: 'Gift' },
  { title: t.restaurant, icon: 'Store' },
  { title: t.shop, icon: 'ShoppingBag' },
  { title: t.club, icon: 'Star' },
  { title: t.special, icon: 'Sparkles' },
],

  offers: [
  { id: 'melal-discount', businessId: 'melal', title: t.gift1, brand: t.restaurant, tag: t.free, vip: 0, hasGift: true, hasDiscount: false, image: asset('img/restaurant-melal.png') },
  { id: 'barial-discount', businessId: 'barial', title: t.gift2, brand: t.barial, tag: t.discount, vip: 0, hasGift: true, hasDiscount: true, image: asset('img/barial.jpg') },
  { id: 'dorato-discount', businessId: 'dorato', title: t.gift3, brand: t.dorato, tag: t.special, vip: 0, hasGift: true, hasDiscount: true, image: asset('img/logo dorato.jpg') },
  { id: 'ibamo-discount', businessId: 'ibamo', title: '\u06a9\u062f \u062a\u062e\u0641\u06cc\u0641 \u062e\u0631\u06cc\u062f \u0627\u0632 \u0627\u06cc\u0628\u0627\u0645\u0648', brand: t.ibamo, tag: t.discount, vip: 0, hasGift: false, hasDiscount: true, code: 'IBAMO72WDBU', image: asset('img/logo ibamo.jpg') },
  { id: 'bakhshi-discount', businessId: 'bakhshi', title: '\u06a9\u062f \u062a\u062e\u0641\u06cc\u0641 \u062e\u0631\u06cc\u062f \u0627\u0632 \u0628\u062e\u0634\u06cc', brand: t.bakhshi, tag: t.discount, vip: 0, hasGift: false, hasDiscount: true, image: asset('img/bakhshi.jpg') },
  { id: 'bastani-discount', businessId: 'bastani', title: '\u06a9\u062f \u062a\u062e\u0641\u06cc\u0641 \u062e\u0631\u06cc\u062f \u0627\u0632 \u0628\u0627\u0633\u062a\u0627\u0646\u06cc', brand: t.bastani, tag: t.discount, vip: 0, hasGift: false, hasDiscount: true, image: asset('img/business-banners/bastani-logo-enhanced.png') },
  { id: 'mojalal-discount', businessId: 'mojalal', title: '\u06a9\u062f \u062a\u062e\u0641\u06cc\u0641 \u062e\u0631\u06cc\u062f \u0627\u0632 \u0645\u062c\u0644\u0644', brand: t.mojalal, tag: t.discount, vip: 0, hasGift: false, hasDiscount: true, image: asset('img/mojalal.jpg') },
],
};

const categoryIcons = {
  Gift,
  LogIn,
  Store,
  ShoppingBag,
  Star,
  Sparkles,
};

const normalizeList = (value, fallback) => (Array.isArray(value) && value.length ? value : fallback);

const firstValue = (item, keys) => keys.map((key) => item?.[key]).find(Boolean);
const firstDefinedValue = (item, keys) => {
  for (const key of keys) {
    if (item?.[key] !== undefined && item?.[key] !== null && item?.[key] !== '') {
      return item[key];
    }
  }

  return undefined;
};

const flagValue = (value) => {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }

  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'number') {
    return value === 1;
  }

  const normalized = String(value).trim().toLowerCase();

  if (['1', 'true', 'yes', 'vip', 'v.i.p', '\u0648\u06cc\u200c\u0622\u06cc\u200c\u067e\u06cc', '\u0648\u06cc \u0622\u06cc \u067e\u06cc'].includes(normalized)) {
    return true;
  }

  if (['0', 'false', 'no', 'normal', 'simple'].includes(normalized)) {
    return false;
  }

  return Boolean(normalized);
};

const offerHasValue = (offer, keys) => {
  const value = firstDefinedValue(offer, keys);

  if (value === undefined) {
    return undefined;
  }

  const asFlag = flagValue(value);
  if (asFlag !== undefined && ['boolean', 'number'].includes(typeof value)) {
    return asFlag;
  }

  return String(value).trim() !== '' && String(value).trim() !== '0';
};
const normalizeOfferActive = (offer) => {
  const explicitActive = flagValue(firstDefinedValue(offer, [
    'gift_active',
    'giftActive',
    'is_active',
    'isActive',
    'active',
    'enabled',
  ]));

  if (explicitActive !== undefined) {
    return explicitActive;
  }

  const status = String(firstDefinedValue(offer, ['status', 'state']) || '').trim().toLowerCase();

  if (['\u0641\u0639\u0627\u0644', 'active', 'enabled'].includes(status)) {
    return true;
  }

  if (['\u063a\u06cc\u0631\u0641\u0639\u0627\u0644', '\u063a\u064a\u0631\u0641\u0639\u0627\u0644', 'inactive', 'disabled', 'expired'].includes(status)) {
    return false;
  }

  return true;
};
const blockedCategoryTerms = ['pet', 'pets', 'animal', 'animals', '\u062d\u06cc\u0648\u0627\u0646', '\u062d\u06cc\u0648\u0627\u0646\u0627\u062a', '\u062d\u06cc\u0648\u0627\u0646\u0627\u062a \u062e\u0627\u0646\u06af\u06cc'];

const isAllowedCategory = (category) => {
  const title = String(firstValue(category, ['title', 'name', 'label']) || '').toLowerCase();
  const icon = String(firstValue(category, ['icon', 'iconName', 'icon_name']) || '').toLowerCase();

  return !blockedCategoryTerms.some((term) => title.includes(term) || icon.includes(term));
};

const normalizeCategories = (items) => {
  const categories = normalizeList(items, defaultHomeData.categories).filter(isAllowedCategory);
  return categories.length ? categories : defaultHomeData.categories;
};

const resolveHomeData = (data) => data?.data || data?.home || data?.homepage || data || {};

const isRestaurantBrand = (title = '') =>
  title === t.restaurant || title.toLowerCase().includes('restaurant') || title.includes('\u0645\u0644\u0644');

const normalizeImage = (item, fallback) =>
  normalizeMediaUrl(
    firstValue(item, ['image', 'images', 'image_url', 'imageUrl', 'image_path', 'imagePath', 'logo', 'logo_url', 'thumbnail', 'thumbnail_url', 'poster']),
    fallback
  );

const getStoryFallback = (story, index) => {
  const businessKey = getKnownBusinessKey(story);

  return defaultHomeData.stories.find((fallbackStory) => getKnownBusinessKey(fallbackStory) === businessKey) ||
    defaultHomeData.stories[index % defaultHomeData.stories.length];
};

const normalizeStories = (items, { allowLocalMediaFallback = false } = {}) =>
  items
    .map((story, index) => {
      const fallback = getStoryFallback(story, index);
      const rawTitle = firstValue(story, ['title', 'name', 'brand', 'business_name']) || fallback?.title || `${t.selectedBrands} ${index + 1}`;
      const title = getStoryDisplayTitle(rawTitle);
      const imageValue = firstValue(story, ['image', 'images', 'image_url', 'imageUrl', 'image_path', 'imagePath', 'logo', 'logo_url', 'thumbnail', 'thumbnail_url', 'poster']);
      const videoValue = firstValue(story, ['video', 'video_url', 'videoUrl', 'media', 'media_url', 'mediaUrl', 'story_video', 'storyVideo']);
      const fallbackVideo = storyVideoByTitle[title] || storyVideoByTitle[rawTitle] || fallback?.video;

      return {
        ...story,
        title,
        businessId: getKnownBusinessKey(story) || getKnownBusinessKey(fallback) || story.businessId,
        image: normalizeMediaUrl(imageValue, allowLocalMediaFallback ? fallback?.image || '' : ''),
        video: normalizeMediaUrl(videoValue, allowLocalMediaFallback ? fallbackVideo || '' : ''),
      };
    })
    .filter((story) => story.image || story.video);
const normalizeCards = (items, fallback) =>
  items.map((item, index) => ({
    ...item,
    title: firstValue(item, ['title', 'name', 'brand', 'business_name']) || fallback[index % fallback.length].title,
    image: normalizeImage(item, fallback[index % fallback.length].image),
    href: firstValue(item, ['href', 'url', 'link']) || fallback[index % fallback.length].href,
    businessId: firstValue(item, ['businessId', 'business_id', 'businessSlug', 'business_slug', 'slug']) || fallback[index % fallback.length].businessId,
  }));

const normalizeLookupText = (value) =>
  String(value || '')
    .toLowerCase()
    .replace(/[\s\u200c_\-]+/g, '');

const businessAliases = {
  melal: ['melal', 'ملل', 'رستورانملل'],
  barial: ['barial', 'barialbeauty', 'باریال', 'بریال'],
  dorato: ['dorato', 'دوراتو'],
  ibamo: ['ibamo', 'ایبامو', 'ایبیبامو', 'ایبیبامو'],
  bakhshi: ['bakhshi', 'بخشی'],
  bastani: ['bastani', 'باستانی'],
  mojalal: ['mojalal', 'mojallal', 'مجلل'],
};

const findBusinessKeyInText = (value) => {
  const searchable = normalizeLookupText(value);

  if (!searchable) {
    return undefined;
  }

  return Object.entries(businessAliases).find(([, aliases]) =>
    aliases.some((alias) => searchable.includes(normalizeLookupText(alias)))
  )?.[0];
};

const getKnownBusinessKey = (offer) => {
  const reliableFields = [
    firstValue(offer, ['businessId', 'business_id', 'businessSlug', 'business_slug', 'slug', 'prefix']),
    firstValue(offer, ['brand', 'business', 'business_name', 'place']),
    firstValue(offer, ['title', 'name', 'gift_title', 'giftTitle']),
    firstValue(offer, ['image', 'images', 'image_url', 'imageUrl']),
  ];

  for (const field of reliableFields) {
    const businessKey = findBusinessKeyInText(field);

    if (businessKey) {
      return businessKey;
    }
  }

  return findBusinessKeyInText(firstValue(offer, ['description', 'subtitle', 'text', 'body']));
};

const getOfferFallback = (offer, index) => {
  const businessKey = getKnownBusinessKey(offer);

  return defaultHomeData.offers.find((fallbackOffer) => fallbackOffer.businessId === businessKey) ||
    defaultHomeData.offers[index % defaultHomeData.offers.length];
};

const valueMatchesBusiness = (value, businessKey) => {
  if (!businessKey || !value) {
    return false;
  }

  return findBusinessKeyInText(value) === businessKey;
};

const getBusinessDisplayValue = (offer, keys, fallbackValue) => {
  const value = firstValue(offer, keys);
  return value || fallbackValue;
};
const getNormalizedOfferShape = (offer) => {
  const isVip = flagValue(firstDefinedValue(offer, ['vip', 'is_vip', 'isVip', 'isVIP', 'vip_flag', 'vipFlag', 'vip_status', 'vipStatus', 'vip_discount', 'vipDiscount', 'is_vip_discount', 'isVipDiscount'])) === true;
  const explicitGift = offerHasValue(offer, ['hasGift', 'has_gift', 'gift', 'gift_title', 'giftTitle', 'gift_name', 'giftName', 'gift_description', 'giftDescription', 'gift_value', 'giftValue']);
  const explicitDiscount = offerHasValue(offer, ['hasDiscount', 'has_discount', 'discount', 'discount_title', 'discountTitle', 'discount_percent', 'discountPercent', 'discount_value', 'discountValue', 'discount_amount', 'discountAmount', 'percent', 'percentage', 'code', 'discount_code', 'discountCode', 'coupon', 'coupon_code', 'couponCode']);
  const searchableText = `${offer.title || ''} ${offer.tag || ''} ${offer.description || ''}`.toLowerCase();
  const hasGift = isVip ? true : explicitGift ?? /gift|free|\u0647\u062f\u06cc\u0647|\u0631\u0627\u06cc\u06af\u0627\u0646/.test(searchableText);
  const hasDiscount = isVip ? true : explicitDiscount ?? /discount|coupon|percent|%|\u066a|\u062a\u062e\u0641\u06cc\u0641|\u06a9\u062f/.test(searchableText);
  const offerType = isVip
    ? 'vip-discount'
    : hasGift && hasDiscount
      ? 'gift-discount'
      : 'simple-discount';

  return {
    isVip,
    hasGift,
    hasDiscount,
    isActive: normalizeOfferActive(offer),
    offerType,
  };
};

const normalizeOffers = (items) =>
  items.map((offer, index) => {
    const businessKey = getKnownBusinessKey(offer);
    const fallback = getOfferFallback(offer, index);
    const normalizedOffer = {
      ...fallback,
      ...offer,
      id: firstValue(offer, ['id', 'discount_id', 'discountId', 'offer_id', 'offerId']) || fallback.id,
      collectionId: firstValue(offer, ['collectionId', 'collection_id', 'id']) || fallback.collectionId,
      businessId: businessKey || firstValue(offer, ['businessId', 'business_id', 'businessSlug', 'business_slug', 'slug', 'prefix']) || fallback.businessId,
      title: getBusinessDisplayValue(offer, ['title', 'name', 'gift_title', 'giftTitle'], fallback.title, businessKey),
      brand: getBusinessDisplayValue(offer, ['brand', 'business', 'business_name', 'place'], fallback.brand, businessKey),
      tag: firstValue(offer, ['tag', 'badge', 'type', 'discount_type']) || fallback.tag,
      image: normalizeImage(offer, fallback.image),
      code: firstValue(offer, ['code', 'discount_code', 'discountCode', 'coupon', 'coupon_code', 'couponCode']) || fallback.code || '',
      href: getCollectionHref(offer) || fallback.href,
    };

    return {
      ...normalizedOffer,
      ...getNormalizedOfferShape(offer),
    };
  });


const findOfferList = (source) => {
  if (Array.isArray(source)) {
    return source;
  }

  if (!source || typeof source !== 'object') {
    return [];
  }

  const offerKeys = ['discounts', 'offers', 'gifts', 'cards', 'codes', 'items', 'records', 'list', 'result', 'data'];

  for (const key of offerKeys) {
    const value = source[key];

    if (Array.isArray(value)) {
      return value;
    }

    if (value && typeof value === 'object') {
      const nested = findOfferList(value);
      if (nested.length) {
        return nested;
      }
    }
  }

  return [];
};

const findStoryList = (source) => {
  if (Array.isArray(source)) {
    return source;
  }

  if (!source || typeof source !== 'object') {
    return [];
  }

  const storyKeys = ['stories', 'story', 'story_items', 'storyItems'];

  for (const key of storyKeys) {
    const value = source[key];

    if (Array.isArray(value)) {
      return value;
    }

    if (Array.isArray(value?.data)) {
      return value.data;
    }

    if (value && typeof value === 'object') {
      const nested = findStoryList(value);
      if (nested.length) {
        return nested;
      }
    }
  }

  return [];
};

const normalizeApiStories = (payload) => normalizeStories(findStoryList(payload), { allowLocalMediaFallback: false });
const normalizeDiscountApiOffers = (payload) => normalizeOffers(findOfferList(resolveHomeData(payload)));

const getCollectionHref = (item) => {
  const collectionId = firstValue(item, ['collectionId', 'collection_id', 'id']);
  return collectionId ? `/collections/${collectionId}` : undefined;
};

const buildBrandsFromOffers = (offers) => {
  const seen = new Set();

  return offers
    .map((offer) => {
      const collectionId = firstValue(offer, ['collectionId', 'collection_id', 'id']);
      const businessId = getKnownBusinessKey(offer) || firstValue(offer, ['prefix', 'slug', 'businessId', 'business_id']) || collectionId;
      const key = String(businessId || collectionId || offer.title || '').toLowerCase();

      if (!key || seen.has(key)) {
        return null;
      }

      seen.add(key);

      return {
        title: offer.brand || offer.title,
        businessId,
        collectionId,
        image: offer.image,
        href: collectionId ? `/collections/${collectionId}` : isRestaurantBrand(offer.brand || offer.title) ? '/restaurant' : `/business/${businessId}`,
      };
    })
    .filter(Boolean);
};

const getOfferMergeKey = (offer) =>
  String(
    getKnownBusinessKey(offer) ||
    firstValue(offer, ['businessId', 'business_id', 'businessSlug', 'business_slug', 'slug', 'prefix']) ||
    firstValue(offer, ['brand', 'business', 'business_name', 'place']) ||
    firstValue(offer, ['id', 'discount_id', 'discountId', 'offer_id', 'offerId']) ||
    firstValue(offer, ['title', 'name', 'gift_title', 'giftTitle']) ||
    ''
  )
    .trim()
    .toLowerCase();

const mergeOfferLists = (fallbackOffers, apiOffers) => {
  if (!apiOffers.length) {
    return fallbackOffers;
  }

  return apiOffers;
};

const mergeHomeAndDiscountData = (homePayload, discountPayload) => {
  const normalizedHome = normalizeHomeData(homePayload);
  const discountOffers = normalizeDiscountApiOffers(discountPayload);
  const discountStories = normalizeApiStories(discountPayload);
  const homeStories = normalizeApiStories(resolveHomeData(homePayload));

  return {
    ...normalizedHome,
    stories: discountStories.length ? discountStories : homeStories.length ? homeStories : defaultHomeData.stories,
    brands: discountOffers.length ? buildBrandsFromOffers(discountOffers) : normalizedHome.brands,
    offers: mergeOfferLists(normalizedHome.offers, discountOffers),
  };
};

const HOME_DATA_CACHE_KEY = 'keymiay:last-home-data:v1';

const loadCachedHomeData = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const cached = window.localStorage.getItem(HOME_DATA_CACHE_KEY);
    return cached ? JSON.parse(cached) : null;
  } catch {
    return null;
  }
};

const saveCachedHomeData = (data) => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(HOME_DATA_CACHE_KEY, JSON.stringify(data));
  } catch {
    // Cache is best-effort only; the page should still work without it.
  }
};

const hasUsableHomeData = (data) => Boolean(data?.stories?.length || data?.offers?.length || data?.brands?.length || data?.banners?.length);
const normalizeHomeData = (payload) => {
  const data = resolveHomeData(payload);
  const brands = normalizeCards(
    normalizeList(data?.brands || data?.businesses || data?.stores, defaultHomeData.brands),
    defaultHomeData.brands
  ).map((brand) =>
    isRestaurantBrand(brand.title)
      ? { ...brand, image: defaultHomeData.brands[0].image, businessId: brand.businessId || 'melal', href: '/restaurant' }
      : brand
  );

  return {
    stories: normalizeStories(defaultHomeData.stories, { allowLocalMediaFallback: true }),
    banners: normalizeCards(normalizeList(data?.banners || data?.sliders || data?.slides, defaultHomeData.banners), defaultHomeData.banners),
    brands,
    categories: normalizeCategories(data?.categories),
    offers: normalizeOffers(normalizeList(data?.offers || data?.gifts || data?.discounts, defaultHomeData.offers)),
  };
};

const findNestedValue = (source, keys) => {
  if (!source) {
    return undefined;
  }

  if (Array.isArray(source)) {
    for (const item of source) {
      const value = findNestedValue(item, keys);
      if (value) {
        return value;
      }
    }

    return undefined;
  }

  if (typeof source !== 'object') {
    return undefined;
  }

  const directValue = firstValue(source, keys);
  if (directValue) {
    return directValue;
  }

  for (const value of Object.values(source)) {
    const nestedValue = findNestedValue(value, keys);
    if (nestedValue) {
      return nestedValue;
    }
  }

  return undefined;
};

const discountCodeKeys = ['code', 'discount_code', 'discountCode', 'coupon', 'coupon_code', 'couponCode'];

const isOfferMatch = (item, offer) => {
  if (!item || typeof item !== 'object' || !offer) {
    return false;
  }

  const itemBusiness = String(firstValue(item, ['businessId', 'business_id', 'businessSlug', 'business_slug', 'slug', 'business', 'business_name', 'brand']) || '').toLowerCase();
  const offerBusinessCandidates = [offer.businessId, offer.business_id, offer.businessSlug, offer.business_slug, offer.brand]
    .filter(Boolean)
    .map((value) => String(value).toLowerCase());
  const itemTitle = String(firstValue(item, ['title', 'name', 'gift_title', 'giftTitle']) || '').toLowerCase();
  const offerTitle = String(offer.title || '').toLowerCase();
  const businessMatches = offerBusinessCandidates.some((offerBusiness) =>
    itemBusiness && (itemBusiness.includes(offerBusiness) || offerBusiness.includes(itemBusiness))
  );

  return Boolean(
    businessMatches ||
    (itemTitle && offerTitle && (itemTitle.includes(offerTitle) || offerTitle.includes(itemTitle)))
  );
};

const findOfferDiscountCode = (source, offer) => {
  if (!source) {
    return undefined;
  }

  if (Array.isArray(source)) {
    for (const item of source) {
      const value = findOfferDiscountCode(item, offer);
      if (value) {
        return value;
      }
    }

    return undefined;
  }

  if (typeof source !== 'object') {
    return undefined;
  }

  const directCode = firstValue(source, discountCodeKeys);
  if (directCode && isOfferMatch(source, offer)) {
    return directCode;
  }

  for (const value of Object.values(source)) {
    const nestedValue = findOfferDiscountCode(value, offer);
    if (nestedValue) {
      return nestedValue;
    }
  }

  return undefined;
};

const getDiscountCode = (data, offer) =>
  findOfferDiscountCode(data, offer) || findNestedValue(data, discountCodeKeys);

const getDiscountMessage = (data) =>
  findNestedValue(data, ['message', 'text', 'description']);

const toPersianDigits = (value) =>
  String(value).replace(/[0-9]/g, (digit) => String.fromCharCode(0x06f0 + Number(digit)));

const formatOfferPercent = (value) => {
  if (value === undefined || value === null || value === '') {
    return '';
  }

  const label = String(value).trim();

  if (!label) {
    return '';
  }

  if (/^[\u06f0-\u06f90-9]+$/.test(label)) {
    return `${toPersianDigits(label)}\u066a`;
  }

  return toPersianDigits(label);
};

const getOfferPercent = (offer) => {
  const explicitPercent = formatOfferPercent(firstValue(offer, ['percent', 'discountPercent', 'discount_percent', 'percentage', 'badge']));

  if (explicitPercent) {
    return explicitPercent;
  }

  if (String(offer.tag || '').includes('\u0631\u0627\u06cc\u06af\u0627\u0646')) {
    return '\u0631\u0627\u06cc\u06af\u0627\u0646';
  }

  return String(offer.title || '').match(/[\u06f0-\u06f90-9]+\s*[\u066a%]|[\u066a%]\s*[\u06f0-\u06f90-9]+/)?.[0] || '\u06f1\u06f0\u066a';
};

const isLocalDebugHost = () => {
  if (typeof window === 'undefined') return false;

  return ['localhost', '127.0.0.1'].includes(window.location.hostname);
};

const getDebugVipValue = (router) => {
  const value = router.query?.debugVip;
  return Array.isArray(value) ? value[0] : value;
};

const shouldPreviewVipOffer = (offer, debugVipValue) => {
  if (!debugVipValue || !isLocalDebugHost()) return false;

  const normalizedDebugValue = normalizeLookupText(debugVipValue);

  if (normalizedDebugValue === 'all') {
    return true;
  }

  return [getKnownBusinessKey(offer), offer.businessId, offer.id, offer.title, offer.brand]
    .some((value) => normalizeLookupText(value) === normalizedDebugValue || findBusinessKeyInText(value) === normalizedDebugValue);
};
const getOfferStatus = (offer) => offer.isActive === false ? '\u063a\u06cc\u0631\u0641\u0639\u0627\u0644' : '\u0641\u0639\u0627\u0644';
const getOfferTypeLabel = () => '';

const getOfferBenefits = (offer) => {
  if (offer.offerType === 'vip-discount') {
    return ['\u0647\u062f\u06cc\u0647', '\u062a\u062e\u0641\u06cc\u0641'];
  }

  if (offer.offerType === 'gift-discount') {
    return ['\u0647\u062f\u06cc\u0647', '\u062a\u062e\u0641\u06cc\u0641'];
  }

  return ['\u062a\u062e\u0641\u06cc\u0641'];
};

const businessOfferDescriptions = {
  melal: 'با خرید از رستوران ملل، هدیه یا تخفیف ویژه غذا و نوشیدنی را دریافت کنید.',
  barial: 'با خرید از مجموعه زیبایی باریال، از تخفیف ویژه خدمات زیبایی و مراقبت پوست استفاده کنید.',
  dorato: 'با خرید از دوراتو، هدیه یا تخفیف ویژه بازی و سرگرمی را دریافت کنید.',
  ibamo: 'با خرید از فروشگاه لباس ایبامو، کد تخفیف ویژه محصولات پوشاک را دریافت کنید.',
  bakhshi: 'با خرید از فروشگاه بخشی، تخفیف ویژه خرید از این مجموعه را دریافت کنید.',
  bastani: 'با خرید از باستانی، تخفیف ویژه خدمات زیبایی و مراقبت را دریافت کنید.',
  mojalal: 'با خرید از کافه و رستوران مجلل، تخفیف ویژه سفارش غذا و نوشیدنی را دریافت کنید.',
};

const cleanOfferText = (value) =>
  String(value || '')
    .replace(/\\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const getOfferDescription = (offer) => {
  const apiDescription = cleanOfferText(firstValue(offer, ['description', 'subtitle', 'text', 'body']));

  if (apiDescription) {
    return apiDescription;
  }

  const businessKey = getKnownBusinessKey(offer);

  if (businessKey && businessOfferDescriptions[businessKey]) {
    return businessOfferDescriptions[businessKey];
  }

  return `با خرید از ${offer.brand || 'این مجموعه'}، هدیه یا تخفیف ویژه همان مجموعه را دریافت کنید.`;
};

function HomePage({ isDarkMode = false, onToggleTheme }) {
  const router = useRouter();
  const [homeData, setHomeData] = useState(defaultHomeData);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [spinningStory, setSpinningStory] = useState(null);
  const [activeBanner, setActiveBanner] = useState(0);
  const [bannerDragOffset, setBannerDragOffset] = useState(0);
  const [isBannerDragging, setIsBannerDragging] = useState(false);
  const bannerTimerRef = useRef(null);
  const dragStartRef = useRef(null);
  const storyVideoRef = useRef(null);
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeStoryIndex, setActiveStoryIndex] = useState(null);
  const [storyDurationMs, setStoryDurationMs] = useState(4200);
  const [pendingOffer, setPendingOffer] = useState(null);
  const [discountPopup, setDiscountPopup] = useState(null);
  const [isRequestingDiscount, setIsRequestingDiscount] = useState(false);
  const [expandedOfferIds, setExpandedOfferIds] = useState({});
  const bannerItems = mergeExtraBanners(homeData.banners.length ? homeData.banners : defaultHomeData.banners);
  const debugVipValue = getDebugVipValue(router);
  const vipOffers = homeData.offers.filter((offer) => offer.offerType === 'vip-discount' || shouldPreviewVipOffer(offer, debugVipValue));
  const regularOffers = homeData.offers.filter((offer) => !(offer.offerType === 'vip-discount' || shouldPreviewVipOffer(offer, debugVipValue)));
useEffect(() => {
  const checkAuth = () => {
    setIsLoggedIn(hasAuthToken());
  };

  checkAuth();

  window.addEventListener("focus", checkAuth);

  return () => {
    window.removeEventListener("focus", checkAuth);
  };
}, []);

  useEffect(() => {
    let isMounted = true;
    const cachedHomeData = loadCachedHomeData();

    if (cachedHomeData && hasUsableHomeData(cachedHomeData)) {
      setHomeData(cachedHomeData);
    }

    Promise.allSettled([getHomePageData(), getDiscountCards()]).then(([homeResult, discountResult]) => {
      if (!isMounted) {
        return;
      }

      const hasFreshHome = homeResult.status === 'fulfilled';
      const hasFreshDiscounts = discountResult.status === 'fulfilled';

      if (!hasFreshHome && !hasFreshDiscounts) {
        setHomeData(cachedHomeData && hasUsableHomeData(cachedHomeData) ? cachedHomeData : defaultHomeData);
        return;
      }

      const homePayload = hasFreshHome ? homeResult.value : cachedHomeData || defaultHomeData;
      const discountPayload = hasFreshDiscounts ? discountResult.value : null;
      const nextHomeData = mergeHomeAndDiscountData(homePayload, discountPayload);
      const stableHomeData = !hasFreshDiscounts && cachedHomeData?.offers?.length
        ? { ...nextHomeData, offers: cachedHomeData.offers, stories: cachedHomeData.stories?.length ? cachedHomeData.stories : nextHomeData.stories }
        : nextHomeData;

      setHomeData(stableHomeData);

      if (hasFreshDiscounts) {
        saveCachedHomeData(stableHomeData);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const clearBannerTimer = () => {
    if (bannerTimerRef.current) {
      window.clearTimeout(bannerTimerRef.current);
      bannerTimerRef.current = null;
    }
  };

  const resetBannerTimer = () => {
    clearBannerTimer();

    bannerTimerRef.current = window.setTimeout(() => {
      setActiveBanner((current) => (current + 1) % bannerItems.length);
    }, 4200);
  };

  useEffect(() => {
    resetBannerTimer();

    return () => {
      clearBannerTimer();
    };
  }, [activeBanner, bannerItems.length]);

  const openLogin = () => {
    setLoginError('');
    setIsLoginOpen(true);
  };

  const openAccount = () => {
    if (hasAuthToken()) {
      setIsLoggedIn(true);
      router.push('/dashboard');
      return;
    }

    setIsLoggedIn(false);
    openLogin();
  };

  const spinStory = (title) => {
    setSpinningStory(title);
    window.setTimeout(() => setSpinningStory(null), 950);
  };

  const openStory = (story, index) => {
    spinStory(story.title);
    setActiveStoryIndex(index);
  };

  const closeStory = () => {
    setActiveStoryIndex(null);
  };
  const showNextStory = () => {
    setActiveStoryIndex((current) => {
      if (current === null) {
        return current;
      }

      return current >= homeData.stories.length - 1 ? null : current + 1;
    });
  };

  const showPreviousStory = () => {
    setActiveStoryIndex((current) => {
      if (current === null) {
        return current;
      }

      return current <= 0 ? 0 : current - 1;
    });
  };

  const activeStory = activeStoryIndex === null ? null : homeData.stories[activeStoryIndex];

  useEffect(() => {
    setStoryDurationMs(4200);
  }, [activeStoryIndex, activeStory?.video]);

  useEffect(() => {
    if (!activeStory?.video) {
      return;
    }

    storyVideoRef.current?.load?.();
  }, [activeStoryIndex, activeStory?.video]);

  useEffect(() => {
    if (!activeStory || activeStory.video) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      showNextStory();
    }, 4200);

    return () => window.clearTimeout(timer);
  }, [activeStoryIndex, activeStory?.video, homeData.stories.length]);

  const showPreviousBanner = () => {
    setActiveBanner((current) => (current - 1 + bannerItems.length) % bannerItems.length);
  };

  const showNextBanner = () => {
    setActiveBanner((current) => (current + 1) % bannerItems.length);
  };

  const showBanner = (index) => {
    setActiveBanner(index);
  };

  const startBannerDrag = (clientX) => {
    clearBannerTimer();
    dragStartRef.current = clientX;
    setIsBannerDragging(true);
    setBannerDragOffset(0);
  };

  const handleBannerPointerDown = (event) => {
    if (event.button !== undefined && event.button !== 0) {
      return;
    }

    event.currentTarget.setPointerCapture(event.pointerId);
    startBannerDrag(event.clientX);
  };

  const moveBannerDrag = (clientX) => {
    if (dragStartRef.current === null) {
      return;
    }

    setBannerDragOffset(clientX - dragStartRef.current);
  };

  const finishBannerDrag = (clientX) => {
    if (dragStartRef.current === null) {
      return;
    }

    const distance = clientX - dragStartRef.current;
    dragStartRef.current = null;
    setIsBannerDragging(false);
    setBannerDragOffset(0);

    if (Math.abs(distance) < 45) {
      resetBannerTimer();
      return;
    }

    if (distance < 0) {
      showNextBanner();
      return;
    }

    showPreviousBanner();
  };

  const handleBannerPointerUp = (event) => {
    finishBannerDrag(event.clientX);

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const cancelBannerDrag = () => {
    if (dragStartRef.current !== null) {
      resetBannerTimer();
    }

    dragStartRef.current = null;
    setIsBannerDragging(false);
    setBannerDragOffset(0);
  };

  const closeLogin = () => {
    setLoginError('');
    setIsLoginOpen(false);
  };

  const handleSendOtp = async (mobile) => {
    try {
      setIsLoading(true);
      setLoginError('');
      const data = await sendOtp(mobile);

      if (data.status === 'otp_sent') {
        return true;
      }

      setLoginError(t.sendFailed);
      return false;
    } catch (error) {
      setLoginError(error.response?.data?.message || t.serverError);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (mobile, otp) => {
    try {
      setIsLoading(true);
      setLoginError('');
      const data = await verifyOtp({ mobile, otp });

      const token = getTokenFromAuthResponse(data);
      const tokenSaved = setAuthToken(token, getUserTypeFromAuthResponse(data));

      if (!tokenSaved) {
        setLoginError("\u062a\u0648\u06a9\u0646 \u0648\u0631\u0648\u062f \u062f\u0631 \u06a9\u0648\u06a9\u06cc \u0630\u062e\u06cc\u0631\u0647 \u0646\u0634\u062f.");
        return;
      }

      setIsLoggedIn(true);
      setIsLoginOpen(false);
      if (pendingOffer) {
        const offerToClaim = pendingOffer;
        setPendingOffer(null);
        await handleReceiveOffer(offerToClaim, true);
        return;
      }

      router.push('/dashboard');
    } catch (error) {
      setLoginError(error.response?.data?.message || error.message);
    } finally {
      setIsLoading(false);
    }
  };
  const handleReceiveOffer = async (offer, skipAuthCheck = false) => {
    if (offer.isActive === false) {
      setDiscountPopup({
        offer,
        code: '',
        message: '\u0627\u06cc\u0646 \u06a9\u062f \u062a\u062e\u0641\u06cc\u0641 \u062f\u0631 \u062d\u0627\u0644 \u062d\u0627\u0636\u0631 \u063a\u06cc\u0631\u0641\u0639\u0627\u0644 \u0627\u0633\u062a.',
      });
      return;
    }

    if (!skipAuthCheck && !hasAuthToken()) {
      setIsLoggedIn(false);
      setPendingOffer(offer);
      openLogin();
      return;
    }

    try {
      setIsRequestingDiscount(true);
      const data = await requestDiscountCode(offer);
      const receivedCode = getDiscountCode(data, offer) || offer.code || '';

      setDiscountPopup({
        offer,
        code: receivedCode,
        message: receivedCode
          ? getDiscountMessage(data) || '\u06a9\u062f \u062a\u062e\u0641\u06cc\u0641 \u0628\u0627 \u0645\u0648\u0641\u0642\u06cc\u062a \u062f\u0631\u06cc\u0627\u0641\u062a \u0634\u062f.'
          : getDiscountMessage(data) || t.discountFailed,
      });
    } catch (error) {
      const fallbackCode = offer.code || '';

      setDiscountPopup({
        offer,
        code: fallbackCode,
        message: fallbackCode
          ? '\u06a9\u062f \u062a\u062e\u0641\u06cc\u0641 \u0628\u0627 \u0645\u0648\u0641\u0642\u06cc\u062a \u062f\u0631\u06cc\u0627\u0641\u062a \u0634\u062f.'
          : error.response?.data?.message || error.message || t.discountFailed,
      });
    } finally {
      setIsRequestingDiscount(false);
    }
  };


  const renderOfferCard = (offer, index) => {
    const isDebugVip = shouldPreviewVipOffer(offer, debugVipValue);
    const displayedOffer = isDebugVip
      ? { ...offer, offerType: 'vip-discount', isVip: true, hasGift: true, hasDiscount: true }
      : offer;
    const offerStatus = getOfferStatus(displayedOffer);
    const isInactive = offerStatus === '\u063a\u06cc\u0631\u0641\u0639\u0627\u0644';
    const offerType = displayedOffer.offerType || 'simple-discount';
    const offerBenefits = getOfferBenefits(displayedOffer);
    const offerTypeLabel = getOfferTypeLabel(displayedOffer);
    const offerKey = String(displayedOffer.id || displayedOffer.title || `offer-${index}`);
    const offerDescription = getOfferDescription(displayedOffer);
    const hasLongDescription = displayedOffer.offerType === 'vip-discount' && offerDescription.length > 80;
    const isDescriptionExpanded = Boolean(expandedOfferIds[offerKey]);

    return (
      <article className={`home-offer-card home-offer-card--${offerType} ${isInactive ? 'is-inactive' : ''}`} key={offerKey}>
        {displayedOffer.offerType === 'vip-discount' ? <strong className="home-offer-vip-banner">وی‌آی‌پی</strong> : null}
        <div className="home-offer-media">
          <img src={displayedOffer.image} alt={displayedOffer.brand} />
          <span className="home-offer-percent">{getOfferPercent(displayedOffer)}</span>
          {offerTypeLabel ? <span className="home-offer-kind">{offerTypeLabel}</span> : null}
          <span className={`home-offer-status ${isInactive ? 'is-inactive' : ''}`}>{offerStatus}</span>
        </div>
        <div className="home-offer-copy">
          <span>{displayedOffer.brand}</span>
          <h3>{displayedOffer.title}</h3>
          <div className="home-offer-benefits" aria-label="offer benefits">
            {offerBenefits.map((benefit) => (
              <b key={benefit}>{benefit}</b>
            ))}
          </div>
          <p className={`home-offer-description ${isDescriptionExpanded ? 'is-expanded' : ''}`}>{offerDescription}</p>
          {hasLongDescription ? (
            <button
              className="home-offer-read-more"
              type="button"
              onClick={() => setExpandedOfferIds((current) => ({ ...current, [offerKey]: !current[offerKey] }))}
            >
              {isDescriptionExpanded ? 'کمتر' : 'بیشتر'}
            </button>
          ) : null}
        </div>
        <div className="home-offer-footer">
          <button type="button" onClick={() => handleReceiveOffer(offer)} disabled={isRequestingDiscount || isInactive}>
            {isRequestingDiscount ? t.wait : '\u06a9\u062f \u062e\u0631\u06cc\u062f'}
          </button>
        </div>
      </article>
    );
  };
  const handleMobileNav = (id) => {
    if (id === 'home') {
      router.push('/');
      return;
    }

    if (id === 'shop') {
      router.push('/restaurant');
      return;
    }

    if (id === 'faq') {
      router.push('/faq');
      return;
    }

    if (id === 'gifts') {
      document.getElementById('gifts')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    if (!isLoggedIn) {
      openLogin();
      return;
    }

    router.push('/dashboard');
  };


  return (
    <main className={`page-shell home-shell ${isDarkMode ? 'theme-dark' : ''} ${isLoginOpen ? 'is-login-open' : ''}`} dir="rtl">
      <section className="frame home-frame">
        <header className="topbar d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            <Link className="brand d-flex align-items-center" href="/" aria-label={t.home}>
              <Gift className="brand-icon" />
              <span>{t.brand}</span>
            </Link>
            <nav>
              <ul className="nav-list d-flex align-items-center">
                <li><Link href="/">{t.home}</Link></li>
                <li><a href="#gifts">{t.gifts}</a></li>
                <li><a href="#brands">{t.businesses}</a></li>
                <li><a href="#categories">{t.shop}</a></li>
                <li><Link href="/faq">{t.faq}</Link></li>
                <li><button type="button" onClick={openAccount}>{t.club}</button></li>
                <li><a href="#footer">{t.contact}</a></li>
              </ul>
            </nav>
          </div>
          <div className="home-header-actions">
            <button
              className={`home-theme-toggle ${isDarkMode ? 'is-dark' : ''}`}
              type="button"
              onClick={onToggleTheme}
              aria-label={isDarkMode ? t.lightMode : t.darkMode}
              title={isDarkMode ? t.lightMode : t.darkMode}
            >
              <span className="home-theme-toggle-icon home-theme-toggle-sun"><Sun /></span>
              <span className="home-theme-toggle-thumb" />
              <span className="home-theme-toggle-icon home-theme-toggle-moon"><Moon /></span>
            </button>
            <button className="login-btn home-login-btn" type="button" onClick={openAccount}>{isLoggedIn ? '\u062d\u0633\u0627\u0628 \u06a9\u0627\u0631\u0628\u0631\u06cc' : t.login}</button>
          </div>
        </header>

        <section className="home-search-row">
          <label className="home-search-field">
            <Search aria-hidden="true" />
            <input placeholder={t.search} />
          </label>
        </section>

        <section className="home-stories" aria-label={t.selectedBrands}>
          {homeData.stories.map((story, index) => (
            <button
              className={`home-story ${spinningStory === story.title ? 'is-spinning' : ''}`}
              type="button"
              key={story.title}
              onClick={() => openStory(story, index)}
            >
              <span className="home-story-ring">
                {story.video ? (
                  <video src={story.video} poster={story.image} preload="metadata" muted playsInline />
                ) : (
                  <img src={story.image} alt={story.title} />
                )}
              </span>
              <span>{story.title}</span>
            </button>
          ))}
        </section>


        {vipOffers.length ? (
          <section className="home-section home-vip-section" id="vip-gifts">
            <div className="home-section-head">
              <div>
                <span>پیشنهادهای ویژه</span>
                <h2>کارت‌های وی‌آی‌پی</h2>
              </div>
              <a className="home-text-action" href="#gifts">مشاهده باقی کارت‌ها</a>
            </div>
            <div className="home-offer-grid home-vip-offer-grid">
              {vipOffers.map(renderOfferCard)}
            </div>
          </section>
        ) : null}
        <section className="home-hero-grid">
          <div className="home-banner-slider" aria-label={t.bannerAlt}>
            <div
              className={'home-banner-viewport' + (isBannerDragging ? ' is-dragging' : '')}
              onPointerDown={handleBannerPointerDown}
              onPointerMove={(event) => moveBannerDrag(event.clientX)}
              onPointerUp={handleBannerPointerUp}
              onPointerCancel={cancelBannerDrag}
              onLostPointerCapture={cancelBannerDrag}
            >
              <div className="home-banner-track" style={{ transform: 'translateX(calc(' + activeBanner * -100 + '% + ' + bannerDragOffset + 'px))' }}>
                {bannerItems.map((banner, index) => (
                  <div className="home-banner-slide" key={`${banner.title}-${index}`}>
                    <img src={banner.image} alt={`${t.bannerAlt} ${banner.title}`} />
                  </div>
                ))}
              </div>
            </div>

            <button className="home-banner-nav home-banner-nav-prev" type="button" onClick={showNextBanner} aria-label="Next banner">
              <ChevronRight />
            </button>
            <button className="home-banner-nav home-banner-nav-next" type="button" onClick={showPreviousBanner} aria-label="Previous banner">
              <ChevronLeft />
            </button>

            <div className="home-banner-dots" aria-label="Banner navigation">
              {bannerItems.map((banner, index) => (
                <button
                  className={index === activeBanner ? 'is-active' : ''}
                  type="button"
                  key={`${banner.title}-${index}`}
                  onClick={() => showBanner(index)}
                  aria-label={'Show banner ' + (index + 1)}
                />
              ))}
            </div>
          </div>

          <aside className="home-profile-card">
            <div className="home-profile-logo">
              <Gift />
            </div>
            <span className="home-eyebrow">{t.heroKicker}</span>
            <h1>{t.heroTitle}</h1>
            <p>{t.heroText}</p>
            <div className="home-hero-actions">
              <Link className="home-primary-action" href="/restaurant">{t.viewRestaurant}</Link>
              <a href="#gifts">{t.seeGifts}</a>
            </div>
          </aside>
        </section>

        <section className="home-section" id="brands">
          <div className="home-section-head">
            <div>
              <span>{t.selectedBrands}</span>
              <h2>{t.popularBusinesses}</h2>
            </div>
            <button className="home-text-action" type="button">{t.all}</button>
          </div>
          <div className="home-brand-grid">
            {homeData.brands.map((brand) => (
              <Link className="home-brand-card" href={brand.href || `/business/${brand.businessId || 'melal'}`} key={brand.title}>
                {isRestaurantBrand(brand.title) ? (
                  <span className="home-brand-melal-logo" aria-label={brand.title}>
                    <span>{'\u0645\u0644\u0644'}</span>
                    <small>RESTAURANT</small>
                  </span>
                ) : (
                  <img src={brand.image} alt={brand.title} />
                )}
                <strong>{brand.title}</strong>
              </Link>
            ))}
          </div>
        </section>

        <section className="home-section" id="categories">
          <div className="home-section-head">
            <div>
              <span>{t.gifts}</span>
              <h2>{t.fastPath}</h2>
            </div>
          </div>
          <div className="home-category-grid">
            {homeData.categories.map(({ title, icon, href }) => {
              const Icon = categoryIcons[icon] || Gift;

              return (
                <article className="home-category-card" key={title}>
                  <Link href={href || '/#categories'}>
                    <span className="home-category-inner">
                      <Icon />
                      <span>{title}</span>
                    </span>
                  </Link>
                </article>
              );
            })}
          </div>
        </section>

        <section className="home-section" id="gifts">
          <div className="home-section-head">
            <div>
              <span>{t.freshOffers}</span>
              <h2>{t.activeGifts}</h2>
            </div>
            <button className="home-text-action" type="button">{t.all}</button>
          </div>
          <div className="home-offer-grid">
            {regularOffers.map(renderOfferCard)}
          </div>
        </section>
        <section className="home-guide-section" aria-labelledby="home-guide-title">
          <div className="home-guide-head">
            <span>{'\u0631\u0627\u0647\u0646\u0645\u0627\u06cc \u0633\u0631\u06cc\u0639'}</span>
            <h2 id="home-guide-title">{'\u0631\u0627\u0647\u0646\u0645\u0627\u06cc \u067e\u0644\u062a\u0641\u0631\u0645 \u06a9\u06cc \u0645\u06cc\u0627\u06cc'}</h2>
          </div>
          <ol className="home-guide-steps">
            <li>
              <span className="home-guide-number">{'\u06f1'}</span>
              <span className="home-guide-icon"><LogIn /></span>
              <p>{'\u0627\u0628\u062a\u062f\u0627 \u0628\u0627 \u0634\u0645\u0627\u0631\u0647 \u062a\u0645\u0627\u0633 \u062e\u0648\u062f \u0648\u0627\u0631\u062f \u0634\u0648\u06cc\u062f'}</p>
            </li>
            <li>
              <span className="home-guide-number">{'\u06f2'}</span>
              <span className="home-guide-icon"><MousePointerClick /></span>
              <p>{'\u0633\u067e\u0633 \u0631\u0648\u06cc \u062f\u0631\u06cc\u0627\u0641\u062a \u06a9\u062f \u062a\u062e\u0641\u06cc\u0641 \u06a9\u0644\u06cc\u06a9 \u06a9\u0646\u06cc\u062f'}</p>
            </li>
            <li>
              <span className="home-guide-number">{'\u06f3'}</span>
              <span className="home-guide-icon"><TicketPercent /></span>
              <p>{'\u06a9\u062f \u062a\u062e\u0641\u06cc\u0641 \u062e\u0648\u062f \u0631\u0627 \u062f\u0631\u06cc\u0627\u0641\u062a \u06a9\u0646\u06cc\u062f'}</p>
            </li>
            <li>
              <span className="home-guide-number">{'\u06f4'}</span>
              <span className="home-guide-icon"><Trophy /></span>
              <p>{'\u0627\u0632 \u067e\u0631\u0648\u0641\u0627\u06cc\u0644 \u06a9\u0627\u0631\u0628\u0631\u06cc \u0627\u0632 \u0627\u0645\u062a\u06cc\u0627\u0632 \u0648 \u062c\u0648\u0627\u06cc\u0632 \u062e\u0648\u062f \u0645\u0637\u0644\u0639 \u0634\u0648\u06cc\u062f'}</p>
            </li>
          </ol>
        </section>

        <footer className="home-footer" id="footer">
          <div>
            <h2>{t.brand}</h2>
            <p>{t.footerText}</p>
          </div>
          <div className="home-footer-links">
            <Link href="/">{t.home}</Link>
            <Link href="/restaurant">{t.restaurant}</Link>
            <button type="button" onClick={openAccount}>{t.club}</button>
          </div>
        </footer>
      </section>

      <MobileBottomNav currentPage="home" isLoggedIn={isLoggedIn} onNavigate={handleMobileNav} />

      {isLoginOpen && (
        <LoginModal
          loginError={loginError}
          isLoading={isLoading}
          onClose={closeLogin}
          onSendOtp={handleSendOtp}
          onVerifyOtp={handleVerifyOtp}
        />
      )}

      {activeStory && (
        <div className="home-popup-backdrop" onClick={closeStory}>
          <section className="home-story-popup home-story-viewer" onClick={(event) => event.stopPropagation()}>
            <div className="home-story-progress" aria-hidden="true">
              {homeData.stories.map((story, index) => (
                <span
                  className={index < activeStoryIndex ? 'is-done' : index === activeStoryIndex ? 'is-active' : ''}
                  style={index === activeStoryIndex ? { '--story-duration': storyDurationMs + 'ms' } : undefined}
                  key={story.title}
                >
                  <i />
                </span>
              ))}
            </div>
            <button type="button" className="home-popup-close" onClick={closeStory}>{t.close}</button>
            {!activeStory.video && (
              <>
                <button type="button" className="home-story-tap-zone home-story-tap-prev" onClick={showPreviousStory} aria-label="Previous story" />
                <button type="button" className="home-story-tap-zone home-story-tap-next" onClick={showNextStory} aria-label="Next story" />
              </>
            )}
            {activeStory.video ? (
              <video
                ref={storyVideoRef}
                key={activeStory.video}
                src={activeStory.video}
                autoPlay
                controls
                playsInline
                preload="auto"
                onLoadedMetadata={(event) => {
                  const duration = event.currentTarget.duration;
                  if (Number.isFinite(duration) && duration > 0) {
                    setStoryDurationMs(Math.max(1200, duration * 1000));
                  }
                }}
                onEnded={showNextStory}
              />
            ) : (
              <img src={activeStory.image} alt={activeStory.title} />
            )}
            <div className="home-story-footer-controls">
              <button type="button" className="home-story-step-button" onClick={showPreviousStory} aria-label="Previous story">
                <ChevronRight />
              </button>
              <div className="home-story-footer-title">
                <h2>{activeStory.title}</h2>
              </div>
              <button type="button" className="home-story-step-button" onClick={showNextStory} aria-label="Next story">
                <ChevronLeft />
              </button>
            </div>
          </section>
        </div>
      )}

      {discountPopup && (
        <div className="home-popup-backdrop" onClick={() => setDiscountPopup(null)}>
          <section className="home-discount-popup" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="home-popup-close" onClick={() => setDiscountPopup(null)}>{t.close}</button>
            <span className="home-eyebrow">{discountPopup.offer?.brand}</span>
            <h2>{discountPopup.code ? t.discountCode : discountPopup.offer?.title}</h2>
            {discountPopup.code && <div className="home-discount-code">{discountPopup.code}</div>}
            <p>{discountPopup.message}</p>
          </section>
        </div>
      )}
    </main>
  );
}

export default HomePage;









































