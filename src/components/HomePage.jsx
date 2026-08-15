import { faqs } from '../data/faqData';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Copy,
  Gift,
  LogIn,
  Moon,
  MousePointerClick,
  Info,
  PhoneCall,
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
import { brandAssets } from '../data/brandAssets';

const t = {
  brand: "\u06a9\u06cc \u0645\u06cc\u0627\u06cc",
  home: "\u0635\u0641\u062d\u0647 \u0627\u0635\u0644\u06cc",
  gifts: "\u0647\u062f\u0627\u06cc\u0627",
  businesses: "\u06a9\u0633\u0628\u200c\u0648\u06a9\u0627\u0631\u0647\u0627",
  shop: "\u0641\u0631\u0648\u0634\u06af\u0627\u0647\u06cc",
  club: "\u0628\u0627\u0634\u06af\u0627\u0647 \u0645\u0634\u062a\u0631\u06cc\u0627\u0646",
  faq: "\u0633\u0648\u0627\u0644\u0627\u062a \u0645\u062a\u062f\u0627\u0648\u0644",
  contact: "\u062a\u0645\u0627\u0633 \u0628\u0627 \u0645\u0627",
  about: "\u062f\u0631\u0628\u0627\u0631\u0647 \u0645\u0627",
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
  heroKicker: "\u062f\u0631\u0628\u0627\u0631\u0647 \u0645\u0627",
  heroTitle: "\u0631\u0627\u0647\u06cc \u0628\u0631\u0627\u06cc \u0627\u0646\u062a\u062e\u0627\u0628 \u0647\u0627\u06cc \u0628\u0647\u062a\u0631.",
  heroText: "\u0628\u0627 \u06a9\u06cc\u200c\u0645\u06cc\u0627\u06cc\u060c \u0647\u0631 \u062e\u0631\u06cc\u062f \u0645\u06cc\u200c\u062a\u0648\u0646\u0647 \u0634\u0631\u0648\u0639 \u06cc\u06a9 \u0647\u062f\u06cc\u0647\u060c \u062a\u062e\u0641\u06cc\u0641 \u06cc\u0627 \u062a\u062c\u0631\u0628\u0647 \u062c\u062f\u06cc\u062f \u0628\u0627\u0634\u0647.",
  heroSummary: "\u06a9\u06cc\u200c\u0645\u06cc\u0627\u06cc \u06a9\u0633\u0628\u200c\u0648\u06a9\u0627\u0631\u0647\u0627\u06cc \u06cc\u06a9 \u0634\u0647\u0631 \u0631\u0648 \u0628\u0647 \u0647\u0645 \u0648\u0635\u0644 \u0645\u06cc\u200c\u06a9\u0646\u0647 \u062a\u0627 \u0645\u0634\u062a\u0631\u06cc\u200c\u0647\u0627 \u0628\u06cc\u0646 \u0645\u062c\u0645\u0648\u0639\u0647\u200c\u0647\u0627 \u062d\u0631\u06a9\u062a \u06a9\u0646\u0646 \u0648 \u0647\u0631 \u062e\u0631\u06cc\u062f\u060c \u0641\u0631\u0635\u062a \u062c\u062f\u06cc\u062f\u06cc \u0628\u0631\u0627\u06cc \u062e\u0631\u06cc\u062f \u0628\u0639\u062f\u06cc \u0628\u0633\u0627\u0632\u0647.",
  startupTitle: "\u06a9\u0633\u0628\u200c\u0648\u06a9\u0627\u0631\u0647\u0627 \u0631\u0648 \u0628\u0647 \u0647\u0645 \u0648\u0635\u0644 \u0645\u06cc\u200c\u06a9\u0646\u06cc\u0645.",
  startupText: "\u0645\u0634\u062a\u0631\u06cc\u200c\u0647\u0627 \u0631\u0648 \u0628\u0647 \u062d\u0631\u06a9\u062a \u062f\u0631\u0645\u06cc\u0627\u0631\u06cc\u0645.",
  viewRestaurant: "\u0645\u0634\u0627\u0647\u062f\u0647 \u0645\u062c\u0645\u0648\u0639\u0647\u200c\u0647\u0627",
  seeGifts: "\u062f\u06cc\u062f\u0646 \u0647\u062f\u0627\u06cc\u0627",
  selectedBrands: "\u0628\u0631\u0646\u062f\u0647\u0627\u06cc \u0645\u0646\u062a\u062e\u0628",
  popularBusinesses: "\u06a9\u0633\u0628\u200c\u0648\u06a9\u0627\u0631\u0647\u0627\u06cc \u0645\u062d\u0628\u0648\u0628",
  fastPath: "\u0645\u0633\u06cc\u0631 \u0633\u0631\u06cc\u0639 \u0628\u0631\u0627\u06cc \u067e\u06cc\u062f\u0627 \u06a9\u0631\u062f\u0646 \u0647\u062f\u06cc\u0647",
  freshOffers: "\u067e\u06cc\u0634\u0646\u0647\u0627\u062f\u0647\u0627\u06cc \u062a\u0627\u0632\u0647",
  activeGifts: "\u0647\u062f\u06cc\u0647\u200c\u0647\u0627 \u0648 \u062a\u062e\u0641\u06cc\u0641\u200c\u0647\u0627\u06cc \u0641\u0639\u0627\u0644",
  giftDiscountKicker: "\u0647\u062f\u06cc\u0647 \u0648 \u062a\u062e\u0641\u06cc\u0641",
  giftDiscountCards: "\u06a9\u0627\u0631\u062a\u200c\u0647\u0627\u06cc \u0647\u062f\u06cc\u0647\u200c\u062f\u0627\u0631 \u0648 \u062a\u062e\u0641\u06cc\u0641\u06cc",
  simpleDiscountKicker: "\u062a\u062e\u0641\u06cc\u0641 \u0633\u0627\u062f\u0647",
  simpleDiscountCards: "\u06a9\u0627\u0631\u062a\u200c\u0647\u0627\u06cc \u0641\u0642\u0637 \u062a\u062e\u0641\u06cc\u0641",
  all: "\u0645\u0634\u0627\u0647\u062f\u0647 \u0647\u0645\u0647",
  receive: "\u062f\u0631\u06cc\u0627\u0641\u062a",
  close: "\u0628\u0633\u062a\u0646",
  wait: "\u0644\u0637\u0641\u0627 \u0635\u0628\u0631 \u06a9\u0646\u06cc\u062f...",
  discountCode: "\u06a9\u062f \u062a\u062e\u0641\u06cc\u0641 \u0634\u0645\u0627",
  discountRequested: "\u062f\u0631\u062e\u0648\u0627\u0633\u062a \u0634\u0645\u0627 \u062b\u0628\u062a \u0634\u062f.",
  discountFailed: "\u062f\u0631\u06cc\u0627\u0641\u062a \u06a9\u062f \u062a\u062e\u0641\u06cc\u0641 \u0627\u0646\u062c\u0627\u0645 \u0646\u0634\u062f.",
  copyCode: "\u06a9\u067e\u06cc \u06a9\u062f",
  copiedCode: "\u06a9\u067e\u06cc \u0634\u062f",
  search: "\u062c\u0633\u062a\u062c\u0648\u06cc \u0628\u0631\u0646\u062f\u060c \u0647\u062f\u06cc\u0647 \u06cc\u0627 \u067e\u06cc\u0634\u0646\u0647\u0627\u062f...",
  searchResults: "\u0646\u062a\u0627\u06cc\u062c \u062c\u0633\u062a\u062c\u0648",
  noResults: "\u0646\u062a\u06cc\u062c\u0647\u200c\u0627\u06cc \u067e\u06cc\u062f\u0627 \u0646\u0634\u062f",
  allGiftsByCollection: "\u0644\u06cc\u0633\u062a \u0647\u062f\u06cc\u0647\u200c\u0647\u0627\u06cc \u0645\u062c\u0645\u0648\u0639\u0647\u200c\u0647\u0627",
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

const mergeExtraBanners = (banners) => banners;

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.VITE_API_BASE_URL || '';

const isApiBannerImage = (value) => {
  const image = String(value || '').trim();

  if (!image) {
    return false;
  }

  return !image.startsWith('/home/');
};

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
  { title: t.restaurant, businessId: 'melal', image: asset('img/restaurant-melal.png'), href: '/collections/melal' },
  { title: t.barial, businessId: 'barial', collectionId: '4', image: asset('img/barial.jpg'), href: '/collections/4' },
  { title: t.dorato, businessId: 'dorato', collectionId: '5', image: asset('img/logo dorato.jpg'), href: '/collections/5' },
  { title: t.bastani, businessId: 'bastani', collectionId: '2', image: asset('img/business-banners/bastani-logo-enhanced.png'), href: '/collections/2' },
  { title: t.ibamo, businessId: 'ibamo', collectionId: '1', image: asset('img/logo ibamo.jpg'), href: '/collections/1' },
  { title: t.mojalal, businessId: 'mojalal', collectionId: '3', image: asset('img/mojalal.jpg'), href: '/collections/3' },
],

  categories: [
  { title: t.gifts, icon: 'Gift', href: '#gifts' },
  { title: t.restaurant, icon: 'Store', href: '/collections/melal' },
  { title: t.shop, icon: 'ShoppingBag', disabled: true },
  { title: t.club, icon: 'Star', disabled: true },
  { title: t.special, icon: 'Sparkles', href: '#vip-gifts' },
],

  offers: [
  { id: 'melal-discount', businessId: 'melal', title: t.gift1, brand: t.restaurant, tag: t.free, vip: 0, hasGift: true, hasDiscount: false, image: asset('img/restaurant-melal.png') },
  { id: 'barial-discount', businessId: 'barial', collectionId: '4', title: t.gift2, brand: t.barial, tag: t.discount, vip: 0, hasGift: true, hasDiscount: true, image: asset('img/barial.jpg') },
  { id: 'dorato-discount', businessId: 'dorato', collectionId: '5', title: t.gift3, brand: t.dorato, tag: t.special, vip: 0, hasGift: true, hasDiscount: true, image: asset('img/logo dorato.jpg') },
  { id: 'ibamo-discount', businessId: 'ibamo', collectionId: '1', title: '\u06a9\u062f \u062a\u062e\u0641\u06cc\u0641 \u062e\u0631\u06cc\u062f \u0627\u0632 \u0627\u06cc\u0628\u0627\u0645\u0648', brand: t.ibamo, tag: t.discount, vip: 0, hasGift: false, hasDiscount: true, code: 'IBAMO72WDBU', image: asset('img/logo ibamo.jpg') },
  { id: 'bakhshi-discount', businessId: 'bakhshi', collectionId: '6', title: '\u06a9\u062f \u062a\u062e\u0641\u06cc\u0641 \u062e\u0631\u06cc\u062f \u0627\u0632 \u0628\u062e\u0634\u06cc', brand: t.bakhshi, tag: t.discount, vip: 0, hasGift: false, hasDiscount: true, image: asset('img/bakhshi.jpg') },
  { id: 'bastani-discount', businessId: 'bastani', collectionId: '2', title: '\u06a9\u062f \u062a\u062e\u0641\u06cc\u0641 \u062e\u0631\u06cc\u062f \u0627\u0632 \u0628\u0627\u0633\u062a\u0627\u0646\u06cc', brand: t.bastani, tag: t.discount, vip: 0, hasGift: false, hasDiscount: true, image: asset('img/business-banners/bastani-logo-enhanced.png') },
  { id: 'mojalal-discount', businessId: 'mojalal', collectionId: '3', title: '\u06a9\u062f \u062a\u062e\u0641\u06cc\u0641 \u062e\u0631\u06cc\u062f \u0627\u0632 \u0645\u062c\u0644\u0644', brand: t.mojalal, tag: t.discount, vip: 0, hasGift: false, hasDiscount: true, image: asset('img/mojalal.jpg') },
],
};

const emptyHomeData = {
  stories: [],
  banners: [],
  brands: [],
  categories: defaultHomeData.categories,
  offers: [],
};

const categoryIcons = {
  Gift,
  LogIn,
  Store,
  ShoppingBag,
  Star,
  Sparkles,
};

const normalizeList = (value, fallback = []) => (Array.isArray(value) && value.length ? value : fallback);

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

const getOfferDataSources = (offer) => [
  offer,
  offer?.collection,
  offer?.business,
  offer?.brand,
  offer?.discount,
  offer?.code,
  offer?.gift,
].filter((source) => source && typeof source === 'object');

const firstOfferDefinedValue = (offer, keys) => {
  for (const source of getOfferDataSources(offer)) {
    const value = firstDefinedValue(source, keys);

    if (value !== undefined) {
      return value;
    }
  }

  return undefined;
};

const offerHasNestedValue = (offer, keys) => {
  for (const source of getOfferDataSources(offer)) {
    const value = offerHasValue(source, keys);

    if (value !== undefined) {
      return value;
    }
  }

  return undefined;
};

const normalizeOfferActive = (offer) => {
  const explicitActive = flagValue(firstOfferDefinedValue(offer, [
    'gift_active',
    'giftActive',
    'discount_active',
    'discountActive',
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

  return {};
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
const normalizeCards = (items, fallback = []) =>
  items
    .map((item, index) => {
      const fallbackItem = fallback.length ? fallback[index % fallback.length] : {};

      return {
        ...item,
        title: firstValue(item, ['title', 'name', 'brand', 'business_name']) || fallbackItem.title || '',
        image: normalizeImage(item, fallbackItem.image || ''),
        href: firstValue(item, ['href', 'url', 'link']) || fallbackItem.href,
        businessId: firstValue(item, ['businessId', 'business_id', 'businessSlug', 'business_slug', 'slug']) || fallbackItem.businessId,
      };
    })
    .filter((item) => item.title || item.image);

const normalizeLookupText = (value) =>
  String(value || '')
    .toLowerCase()
    .replace(/[\s\u200c_\-]+/g, '');

const businessAliases = {
  melal: ['melal', 'ملل', 'رستوران ملل'],
  barial: ['barial', 'barialbeauty', 'باریال', 'بریال'],
  dorato: ['dorato', 'دوراتو'],
  ibamo: ['ibamo', 'ایبامو', 'ایبی با مو', 'ای بی با مو', 'ایی با مو'],
  bakhshi: ['bakhshi', 'بخشی'],
  bastani: ['bastani', 'باستانی'],
  mojalal: ['mojalal', 'mojallal', 'مجلال', 'مجلل'],
};

const knownCollectionIdByBusiness = {
  ibamo: '1',
  bastani: '2',
  mojalal: '3',
  barial: '4',
  dorato: '5',
  bakhshi: '6',
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

const getCollectionIdForOffer = (offer) => {
  const explicitCollectionId = firstValue(offer, ['collectionId', 'collection_id', 'collectionID']);
  const businessKey = getKnownBusinessKey(offer);

  if (explicitCollectionId) return explicitCollectionId;
  if (businessKey === 'melal') return '';

  return knownCollectionIdByBusiness[businessKey] || '';
};

const getOfferFallback = (offer, index) => {
  const businessKey = getKnownBusinessKey(offer);

  return defaultHomeData.offers.find((fallbackOffer) => fallbackOffer.businessId === businessKey) ||
    defaultHomeData.offers[index % defaultHomeData.offers.length] ||
    {};
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
  const isVip = flagValue(firstOfferDefinedValue(offer, ['vip', 'is_vip', 'isVip', 'isVIP', 'vip_flag', 'vipFlag', 'vip_status', 'vipStatus', 'vip_discount', 'vipDiscount', 'is_vip_discount', 'isVipDiscount'])) === true;
  const explicitGift = offerHasNestedValue(offer, [
    'hasGift',
    'has_gift',
    'hasGifts',
    'has_gifts',
    'gift',
    'gifts',
    'gift_active',
    'giftActive',
    'gift_enabled',
    'giftEnabled',
    'gift_status',
    'giftStatus',
    'gift_count',
    'giftCount',
    'gift_title',
    'giftTitle',
    'gift_name',
    'giftName',
    'gift_description',
    'giftDescription',
    'gift_value',
    'giftValue',
    'gift_amount',
    'giftAmount',
  ]);
  const explicitDiscount = offerHasNestedValue(offer, ['hasDiscount', 'has_discount', 'discount', 'discount_active', 'discountActive', 'discount_enabled', 'discountEnabled', 'discount_status', 'discountStatus', 'discount_title', 'discountTitle', 'discount_percent', 'discountPercent', 'discount_value', 'discountValue', 'discount_amount', 'discountAmount', 'percent', 'percentage', 'code', 'discount_code', 'discountCode', 'coupon', 'coupon_code', 'couponCode']);
  const searchableText = getOfferDataSources(offer)
    .map((source) => `${source.title || ''} ${source.name || ''} ${source.tag || ''} ${source.description || ''}`)
    .join(' ')
    .toLowerCase();
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
    const shouldUseFallbackCode = Boolean(businessKey && fallback.businessId === businessKey);
    const normalizedOffer = {
      ...fallback,
      ...offer,
      id: firstValue(offer, ['id', 'discount_id', 'discountId', 'offer_id', 'offerId']) || fallback.id,
      collectionId: getCollectionIdForOffer(offer) || fallback.collectionId,
      businessId: businessKey || firstValue(offer, ['businessId', 'business_id', 'businessSlug', 'business_slug', 'slug', 'prefix']) || fallback.businessId,
      title: getBusinessDisplayValue(offer, ['title', 'name', 'gift_title', 'giftTitle'], fallback.title, businessKey),
      brand: getBusinessDisplayValue(offer, ['brand', 'business', 'business_name', 'place'], fallback.brand, businessKey),
      tag: firstValue(offer, ['tag', 'badge', 'type', 'discount_type']) || fallback.tag,
      image: normalizeImage(offer, fallback.image),
      code: firstValue(offer, discountCodeKeys) || (shouldUseFallbackCode ? fallback.code : '') || '',
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
  const collectionId = getCollectionIdForOffer(item);
  return collectionId ? `/collections/${collectionId}` : undefined;
};

const getBrandHref = (brand) => {
  const collectionId = firstValue(brand, ['collectionId', 'collection_id']) || getCollectionIdForOffer(brand);
  return collectionId ? `/collections/${collectionId}` : brand.href || '#brands';
};

const normalizeSearchText = (value) =>
  String(value || '')
    .toLowerCase()
    .replace(/[\u064a]/g, '\u06cc')
    .replace(/[\u0643]/g, '\u06a9')
    .replace(/\s+/g, ' ')
    .trim();

const normalizeLooseSearchText = (value) =>
  normalizeSearchText(value).replace(/[\s\u200c_\-]+/g, '');

const buildBrandsFromOffers = (offers) => {
  const seen = new Set();

  return offers
    .map((offer) => {
      const collectionId = getCollectionIdForOffer(offer);
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
        href: collectionId ? `/collections/${collectionId}` : '#brands',
      };
    })
    .filter(Boolean);
};

const ensureDefaultBrands = (brands) => {
  const normalizedBrands = Array.isArray(brands) ? brands : [];
  const existingKeys = new Set(
    normalizedBrands
      .map((brand) => getKnownBusinessKey(brand) || firstValue(brand, ['businessId', 'business_id', 'collectionId', 'collection_id']))
      .filter(Boolean)
  );
  const missingDefaults = defaultHomeData.brands.filter((brand) => {
    const key = getKnownBusinessKey(brand) || brand.businessId || brand.collectionId;
    return key && !existingKeys.has(key);
  });

  return [...missingDefaults, ...normalizedBrands];
};

const buildStoriesFromOffers = (offers) =>
  buildBrandsFromOffers(offers)
    .map((brand) => ({
      title: getStoryDisplayTitle(brand.title),
      businessId: brand.businessId,
      collectionId: brand.collectionId,
      image: brand.image,
      href: brand.href,
    }))
    .filter((story) => story.image);

const InstagramGlyph = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17" cy="7" r="1.1" />
  </svg>
);

const keymiayFaqGroups = [
  {
    title: 'برای مشتریان',
    questions: [
      ['کی‌میای چیست؟', 'کی‌میای یک پلتفرم شهری است که کسب‌وکارها و مشتریان را به یکدیگر متصل می‌کند. در کی‌میای، خرید از یک مجموعه می‌تواند برای شما هدیه، تخفیف یا پیشنهاد ویژه‌ای از مجموعه‌ای دیگر ایجاد کند.'],
      ['عضویت در کی‌میای برای مشتریان رایگان است؟', 'بله، استفاده از خدمات و عضویت مشتریان در کی‌میای رایگان است.'],
      ['چطور از هدایا و تخفیف‌های کی‌میای استفاده کنم؟', 'کافی است از مجموعه‌های عضو کی‌میای خرید کنید و طبق شرایط اعلام‌شده، هدیه یا تخفیف مربوط به خریدتان را دریافت کنید.'],
      ['هدیه من را چه کسی ارائه می‌دهد؟', 'هدیه یا تخفیف توسط مجموعه‌ای که پیشنهاد مربوط به آن است ارائه می‌شود و شرایط استفاده از آن در کی‌میای مشخص خواهد بود.'],
      ['آیا می‌توانم از چند مجموعه مختلف هدیه بگیرم؟', 'بله؛ بسته به کمپین‌ها و پیشنهادهای فعال، می‌توانید از مجموعه‌های مختلف استفاده کنید.'],
      ['چطور بفهمم چه مجموعه‌هایی عضو کی‌میای هستند؟', 'لیست مجموعه‌های فعال، اطلاعات، آدرس، ساعات کاری و پیشنهادهای آن‌ها در پلتفرم کی‌میای قابل مشاهده است.'],
      ['آیا هدیه‌ها تاریخ انقضا دارند؟', 'ممکن است بعضی هدایا یا پیشنهادها دارای بازه زمانی مشخص باشند. شرایط هر پیشنهاد هنگام استفاده اعلام می‌شود.'],
      ['اگر از یک مجموعه خرید کنم، حتما هدیه دریافت می‌کنم؟', 'دریافت هدیه وابسته به شرایط همان مجموعه و کمپین فعال است و شرایط آن قبل از استفاده مشخص می‌شود.'],
    ],
  },
  {
    title: 'برای کسب‌وکارها',
    questions: [
      ['چرا یک کسب‌وکار باید عضو کی‌میای شود؟', 'کی‌میای به کسب‌وکارها کمک می‌کند از ظرفیت مشتریان سایر مجموعه‌ها برای جذب مشتری جدید استفاده کنند و در یک شبکه مشترک با دیگر کسب‌وکارها همکاری داشته باشند.'],
      ['مدل همکاری کی‌میای با کسب‌وکارها چگونه است؟', 'کسب‌وکار با ارائه هدیه، تخفیف یا پیشنهاد ویژه وارد شبکه می‌شود و در مقابل، می‌تواند از مشتریان سایر مجموعه‌های عضو نیز بهره‌مند شود.'],
      ['آیا کی‌میای فقط یک سایت معرفی کسب‌وکارهاست؟', 'خیر. معرفی مجموعه تنها یکی از امکانات کی‌میای است. هدف اصلی، ایجاد شبکه گردش مشتری بین کسب‌وکارها و ایجاد فرصت‌های جدید فروش است.'],
      ['مشتری چطور از یک کسب‌وکار به کسب‌وکار دیگر منتقل می‌شود؟', 'مشتری پس از خرید یا دریافت پیشنهاد از یک مجموعه، می‌تواند با استفاده از هدیه یا پیشنهاد مربوطه به مجموعه دیگری هدایت شود.'],
      ['چه نوع کسب‌وکارهایی می‌توانند عضو کی‌میای شوند؟', 'رستوران و کافه، فروشگاه، سالن زیبایی، کلینیک، باشگاه، خدمات، مراکز تفریحی و سایر کسب‌وکارهای شهری می‌توانند متناسب با شرایط پلتفرم عضو شوند.'],
      ['آیا کسب‌وکار می‌تواند خودش هدیه و تخفیفش را تعیین کند؟', 'بله. مجموعه می‌تواند پیشنهاد، درصد تخفیف یا هدیه موردنظر خود را مطابق قوانین و ساختار کی‌میای تعریف کند.'],
      ['کیف پول کی‌میای چیست؟', 'کیف پول اعتباری ابزاری برای مدیریت اعتبار و تخفیف مشتری است. مجموعه می‌تواند طبق سازوکار تعیین‌شده، اعتبار کیف پول مشتری را شارژ یا از آن کسر کند.'],
      ['آیا عملکرد کمپین قابل اندازه‌گیری است؟', 'بله. کی‌میای می‌تواند اطلاعاتی مانند تعداد مشتریان ورودی، هدایا، خریدهای انجام‌شده و عملکرد مجموعه در کمپین را در اختیار مجموعه قرار دهد.'],
      ['آیا کی‌میای برای کسب‌وکارها تبلیغات هم انجام می‌دهد؟', 'بله. بسته به نوع همکاری، خدماتی مانند تبلیغات محیطی، تبلیغات فضای مجازی، تولید محتوا، پیامک مارکتینگ و معرفی در پلتفرم قابل ارائه است.'],
      ['آیا امکان همکاری چند کسب‌وکار با یکدیگر وجود دارد؟', 'بله. یکی از مهم‌ترین قابلیت‌های کی‌میای ایجاد همکاری بین کسب‌وکارها و شکل‌دادن به یک شبکه مشترک جذب و گردش مشتری است.'],
    ],
  },
  {
    title: 'درباره کمپین‌ها',
    questions: [
      ['کمپین‌های کی‌میای چه هستند؟', 'کمپین‌های شهری کی‌میای مجموعه‌ای از فعالیت‌های تبلیغاتی و همکاری بین کسب‌وکارها هستند که با هدف افزایش دیده‌شدن، جذب مشتری و ایجاد گردش مشتری اجرا می‌شوند.'],
      ['آیا همه مجموعه‌ها در هر کمپین حضور دارند؟', 'خیر. نوع حضور و سطح خدمات هر مجموعه براساس نوع همکاری و پکیج انتخابی مشخص می‌شود.'],
      ['چگونه می‌توانم یک کسب‌وکار را به کی‌میای معرفی کنم؟', 'می‌توانید اطلاعات مجموعه موردنظر را از طریق راه‌های ارتباطی کی‌میای برای تیم ما ارسال کنید.'],
      ['اگر مشکلی در استفاده از هدیه یا تخفیف داشتم چه کار کنم؟', 'از طریق پشتیبانی کی‌میای موضوع را اعلام کنید تا درخواست شما بررسی و پیگیری شود.'],
      ['چگونه کسب‌وکار خودم را به کی‌میای اضافه کنم؟', 'از طریق بخش عضویت کسب‌وکارها درخواست خود را ثبت کنید تا کارشناسان کی‌میای برای ادامه فرآیند با شما تماس بگیرند.'],
      ['برای همکاری با کی‌میای باید قرارداد داشته باشم؟', 'بسته به نوع همکاری و خدمات انتخابی، شرایط همکاری و قرارداد مربوطه توسط کی‌میای مشخص می‌شود.'],
      ['کی‌میای در چه شهرهایی فعالیت می‌کند؟', 'کی‌میای فعالیت خود را از گرگان آغاز کرده و توسعه شبکه آن به شهرهای دیگر نیز در برنامه قرار دارد.'],
    ],
  },
];

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
  const offerStories = buildStoriesFromOffers(discountOffers);

  return {
    ...normalizedHome,
    stories: discountStories.length ? discountStories : homeStories.length ? homeStories : offerStories,
    brands: ensureDefaultBrands(discountOffers.length ? buildBrandsFromOffers(discountOffers) : normalizedHome.brands),
    offers: mergeOfferLists(normalizedHome.offers, discountOffers),
  };
};

const HOME_DATA_CACHE_KEY = 'keymiay:last-home-data:v3';
const HOME_MOBILE_CACHE_KEY = 'keymiyay-home-mobile';
const PROFILE_STORAGE_KEY = 'keymiyay-user-profile';

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

const loadCachedHomeMobile = () => {
  if (typeof window === 'undefined') {
    return '';
  }

  try {
    const cachedMobile = window.localStorage.getItem(HOME_MOBILE_CACHE_KEY);

    if (cachedMobile) {
      return cachedMobile;
    }

    const cachedProfile = window.localStorage.getItem(PROFILE_STORAGE_KEY);
    const profile = cachedProfile ? JSON.parse(cachedProfile) : null;

    return firstValue(profile || {}, ['mobile', 'phone', 'phone_number', 'mobile_number', 'cellphone']) || '';
  } catch {
    return '';
  }
};

const saveCachedHomeMobile = (mobile) => {
  if (typeof window === 'undefined' || !mobile) {
    return;
  }

  try {
    window.localStorage.setItem(HOME_MOBILE_CACHE_KEY, mobile);
  } catch {
    // Mobile cache is only used to prefill code generation requests.
  }
};

const hasUsableHomeData = (data) => Boolean(data?.stories?.length || data?.offers?.length || data?.brands?.length || data?.banners?.length);
const normalizeHomeData = (payload) => {
  const data = resolveHomeData(payload);
  const brands = ensureDefaultBrands(normalizeCards(
    normalizeList(data?.brands || data?.businesses || data?.stores, []),
    defaultHomeData.brands
  ));

  return {
    stories: normalizeApiStories(data),
    banners: normalizeCards(normalizeList(data?.banners || data?.sliders || data?.slides, []), []),
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

const discountCodeKeys = [
  'code',
  'generated_code',
  'generatedCode',
  'user_code',
  'userCode',
  'discount_code',
  'discountCode',
  'coupon',
  'coupon_code',
  'couponCode',
];

const isOfferMatch = (item, offer) => {
  if (!item || typeof item !== 'object' || !offer) {
    return false;
  }

  const itemBusinessText = [
    firstValue(item, ['collection', 'collection_name', 'collectionName']),
    firstValue(item, ['businessId', 'business_id', 'businessSlug', 'business_slug', 'slug', 'prefix']),
    firstValue(item, ['business', 'business_name', 'brand', 'place']),
    firstValue(item, ['title', 'name', 'gift_title', 'giftTitle']),
  ].filter(Boolean).join(' ');
  const offerBusinessCandidates = [
    offer.collection,
    offer.collection_name,
    offer.collectionName,
    offer.businessId,
    offer.business_id,
    offer.businessSlug,
    offer.business_slug,
    offer.prefix,
    offer.slug,
    offer.brand,
    offer.title,
    offer.name,
  ]
    .filter(Boolean)
    .map(normalizeSearchText)
    .filter(Boolean);
  const itemBusiness = normalizeSearchText(itemBusinessText);
  const looseItemBusiness = normalizeLooseSearchText(itemBusinessText);
  const itemBusinessKey = getKnownBusinessKey(item);
  const offerBusinessKey = getKnownBusinessKey(offer);
  const itemCode = String(firstValue(item, discountCodeKeys) || '').trim();
  const offerCode = String(firstValue(offer, discountCodeKeys) || '').trim();
  const codeMatches = itemCode && offerCode && itemCode === offerCode;
  const businessMatches = offerBusinessCandidates.some((offerBusiness) =>
    itemBusiness && (itemBusiness.includes(offerBusiness) || offerBusiness.includes(itemBusiness))
  );
  const looseBusinessMatches = offerBusinessCandidates.some((offerBusiness) =>
    looseItemBusiness && (
      looseItemBusiness.includes(normalizeLooseSearchText(offerBusiness)) ||
      normalizeLooseSearchText(offerBusiness).includes(looseItemBusiness)
    )
  );
  const knownBusinessMatches = itemBusinessKey && offerBusinessKey && itemBusinessKey === offerBusinessKey;

  return Boolean(
    codeMatches ||
    businessMatches ||
    looseBusinessMatches ||
    knownBusinessMatches
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

const getDirectGeneratedCode = (data) => {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return undefined;
  }

  const directCode = firstValue(data, discountCodeKeys);
  if (directCode) {
    return directCode;
  }

  for (const key of ['data', 'result', 'discount', 'code']) {
    const value = data[key];

    if (typeof value === 'string' && discountCodeKeys.includes(key)) {
      return value;
    }

    if (value && typeof value === 'object' && !Array.isArray(value)) {
      const nestedCode = firstValue(value, discountCodeKeys);

      if (nestedCode) {
        return nestedCode;
      }
    }

    if (Array.isArray(value) && value.length === 1 && value[0] && typeof value[0] === 'object') {
      const nestedCode = firstValue(value[0], discountCodeKeys);

      if (nestedCode) {
        return nestedCode;
      }
    }
  }

  return undefined;
};

const getDiscountCode = (data, offer) =>
  findOfferDiscountCode(data, offer) || getDirectGeneratedCode(data) || firstValue(offer, discountCodeKeys);

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

const getOfferListLabel = (offer) =>
  cleanOfferText(firstValue(offer, ['gift_title', 'giftTitle', 'title', 'name', 'description'])) ||
  offer.brand ||
  t.discount;

const getOfferIdentity = (offer) =>
  String(
    firstDefinedValue(offer, ['id', 'discount_id', 'discountId', 'offer_id', 'offerId', 'code', 'discount_code', 'discountCode']) ||
    `${offer?.collectionId || ''}-${offer?.businessId || ''}-${offer?.title || ''}-${offer?.brand || ''}`
  ).toLowerCase();

function HomePage({ isDarkMode = false, onToggleTheme }) {
  const router = useRouter();
  const [homeData, setHomeData] = useState(emptyHomeData);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [spinningStory, setSpinningStory] = useState(null);
  const [activeBanner, setActiveBanner] = useState(0);
  const [bannerDragOffset, setBannerDragOffset] = useState(0);
  const [isBannerDragging, setIsBannerDragging] = useState(false);
  const [failedBannerImages, setFailedBannerImages] = useState({});
  const bannerTimerRef = useRef(null);
  const dragStartRef = useRef(null);
  const storyVideoRef = useRef(null);
  const brandTapRef = useRef(null);
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeStoryIndex, setActiveStoryIndex] = useState(null);
  const [storyDurationMs, setStoryDurationMs] = useState(4200);
  const [pendingOffer, setPendingOffer] = useState(null);
  const [discountPopup, setDiscountPopup] = useState(null);
  const [isDiscountCodeCopied, setIsDiscountCodeCopied] = useState(false);
  const [isRequestingDiscount, setIsRequestingDiscount] = useState(false);
  const [requestingOfferId, setRequestingOfferId] = useState(null);
  const [expandedOfferIds, setExpandedOfferIds] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const displayedBrands = ensureDefaultBrands(homeData.brands);
  const brandLoopItems = displayedBrands.length > 1
    ? [...displayedBrands, ...displayedBrands]
    : displayedBrands;
  const bannerItems = mergeExtraBanners(homeData.banners)
    .filter((banner) => isApiBannerImage(banner?.image))
    .filter((banner) => !failedBannerImages[banner.image]);
  const bannerCount = bannerItems.length;
  const bannerDots = bannerCount ? bannerItems : [{ title: 'placeholder-1' }, { title: 'placeholder-2' }, { title: 'placeholder-3' }];
  const debugVipValue = getDebugVipValue(router);
  const vipOffers = homeData.offers.filter((offer) => offer.offerType === 'vip-discount' || shouldPreviewVipOffer(offer, debugVipValue));
  const nonVipOffers = homeData.offers.filter((offer) => !(offer.offerType === 'vip-discount' || shouldPreviewVipOffer(offer, debugVipValue)));
  const classifiedGiftDiscountOffers = nonVipOffers.filter((offer) => offer.offerType === 'gift-discount');
  const giftDiscountOffers = classifiedGiftDiscountOffers.length
    ? classifiedGiftDiscountOffers
    : nonVipOffers.filter((offer) => offer.hasGift && offer.hasDiscount).slice(0, 3);
  const visibleGiftDiscountOffers = giftDiscountOffers.length
    ? giftDiscountOffers
    : nonVipOffers.filter((offer) => offer.isActive).slice(0, 3);
  const giftDiscountOfferIds = new Set(visibleGiftDiscountOffers.map(getOfferIdentity));
  const discountOnlyOffers = nonVipOffers.filter((offer) => offer.hasDiscount || !giftDiscountOfferIds.has(getOfferIdentity(offer)));
  const normalizedSearchQuery = normalizeSearchText(searchQuery);
  const filteredOffers = normalizedSearchQuery
    ? homeData.offers.filter((offer) => {
        const haystack = normalizeSearchText([
          offer.brand,
          offer.title,
          offer.description,
          offer.tag,
          offer.code,
          offer.prefix,
          offer.businessId,
        ].join(' '));

        return haystack.includes(normalizedSearchQuery);
      })
    : [];
  const filteredBrands = normalizedSearchQuery && filteredOffers.length === 0
    ? displayedBrands.filter((brand) => normalizeSearchText([
        brand.title,
        brand.businessId,
        brand.collectionId,
      ].join(' ')).includes(normalizedSearchQuery))
    : [];
  const searchResultCount = filteredOffers.length || filteredBrands.length;
  const primaryCollectionHref = displayedBrands.find((brand) => brand.href && brand.href.startsWith('/collections/'))?.href ||
    getCollectionHref(homeData.offers[0]) ||
    '/#brands';
  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const rows = Array.from(document.querySelectorAll(
      '.home-shell .home-stories, .home-shell .home-brand-grid, .home-shell .home-offer-section .home-offer-grid, .home-shell .home-section#gifts > .home-offer-grid, .home-shell #discount-only > .home-offer-grid'
    ));
    const cleanup = [];

    rows.forEach((row) => {
      if (!row) {
        return;
      }

      const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
      const isBrandRow = row.classList.contains('home-brand-grid');
      const isStoryRow = row.classList.contains('home-stories');
      let isPaused = false;
      let resumeTimer;
      let scrollDirection = 1;
      let isDragging = false;
      let dragStartX = 0;
      let dragStartScrollLeft = 0;
      let didDrag = false;
      let brandTapCandidate = null;
      let didNavigateBrandTap = false;
      let animationFrame = 0;
      let momentumFrame = 0;
      let previousFrameTime = 0;
      let lastDragX = 0;
      let lastDragTime = 0;
      let swipeVelocity = 0;
      const dragClickThreshold = 14;
      const pixelsPerSecond = isBrandRow ? 42 : isStoryRow ? 48 : 24;
      const stopMomentum = () => {
        window.cancelAnimationFrame(momentumFrame);
        momentumFrame = 0;
        swipeVelocity = 0;
      };
      const pause = () => {
        isPaused = true;
        window.clearTimeout(resumeTimer);
      };
      const resume = () => {
        window.clearTimeout(resumeTimer);
        resumeTimer = window.setTimeout(() => {
          isPaused = false;
        }, 900);
      };
      const shouldHoldAutoScroll = () =>
        isPaused ||
        (!isBrandRow && !isStoryRow && row.matches(':hover')) ||
        (document.activeElement && row.contains(document.activeElement)) ||
        document.hidden;
      const autoScroll = (frameTime) => {
        const maxScroll = row.scrollWidth - row.clientWidth;
        if (maxScroll <= 8) {
          animationFrame = window.requestAnimationFrame(autoScroll);
          return;
        }

        if (!previousFrameTime) {
          previousFrameTime = frameTime;
        }

        const elapsedSeconds = Math.min((frameTime - previousFrameTime) / 1000, 0.06);
        previousFrameTime = frameTime;

        if (!reduceMotion && !shouldHoldAutoScroll()) {
          if (row.scrollLeft >= maxScroll - 1) {
            scrollDirection = -1;
          } else if (row.scrollLeft <= 1) {
            scrollDirection = 1;
          }

          const next = row.scrollLeft + pixelsPerSecond * elapsedSeconds * scrollDirection;
          row.scrollLeft = Math.max(0, Math.min(maxScroll, next));
        }

        animationFrame = window.requestAnimationFrame(autoScroll);
      };
      const startMomentum = () => {
        if (reduceMotion || Math.abs(swipeVelocity) < 0.08) {
          return;
        }

        let lastMomentumTime = 0;
        let scrollVelocity = -swipeVelocity;
        const glide = (frameTime) => {
          if (!lastMomentumTime) {
            lastMomentumTime = frameTime;
          }

          const elapsedMs = Math.min(frameTime - lastMomentumTime, 32);
          lastMomentumTime = frameTime;
          const maxScroll = row.scrollWidth - row.clientWidth;
          const next = Math.max(0, Math.min(maxScroll, row.scrollLeft + scrollVelocity * elapsedMs));
          const hitEdge = next <= 0 || next >= maxScroll;

          row.scrollLeft = next;
          scrollVelocity *= Math.pow(0.94, elapsedMs / 16);

          if (hitEdge || Math.abs(scrollVelocity) < 0.02) {
            momentumFrame = 0;
            swipeVelocity = 0;
            previousFrameTime = 0;
            return;
          }

          momentumFrame = window.requestAnimationFrame(glide);
        };

        momentumFrame = window.requestAnimationFrame(glide);
      };
      const startDrag = (event) => {
        if (event.pointerType === 'mouse' && event.button !== 0) {
          return;
        }

        pause();
        stopMomentum();
        isDragging = true;
        didDrag = false;
        didNavigateBrandTap = false;
        dragStartX = event.clientX;
        dragStartScrollLeft = row.scrollLeft;
        lastDragX = event.clientX;
        lastDragTime = window.performance.now();
        const brandCard = isBrandRow
          ? event.target?.closest?.('.home-brand-card')
          : null;
        const brandHref = brandCard?.dataset?.brandHref || brandCard?.getAttribute?.('href');
        brandTapCandidate = brandCard && row.contains(brandCard) && brandHref && brandHref !== '#brands'
          ? {
              href: brandHref,
              pointerId: event.pointerId,
              x: event.clientX,
              y: event.clientY,
            }
          : null;
      };
      const moveDrag = (event) => {
        if (!isDragging) {
          return;
        }

        const deltaX = event.clientX - dragStartX;
        if (Math.abs(deltaX) > dragClickThreshold) {
          const now = window.performance.now();
          const elapsed = Math.max(now - lastDragTime, 1);
          didDrag = true;
          event.preventDefault();
          row.classList.add('is-dragging');
          if (!row.hasPointerCapture?.(event.pointerId)) {
            row.setPointerCapture?.(event.pointerId);
          }
          row.scrollLeft = dragStartScrollLeft - deltaX;
          swipeVelocity = (event.clientX - lastDragX) / elapsed;
          lastDragX = event.clientX;
          lastDragTime = now;
        }
      };
      const endDrag = (event) => {
        if (isDragging && row.hasPointerCapture?.(event.pointerId)) {
          row.releasePointerCapture?.(event.pointerId);
        }

        const tap = brandTapCandidate;
        brandTapCandidate = null;
        isDragging = false;
        row.classList.remove('is-dragging');
        previousFrameTime = 0;
        if (didDrag) {
          startMomentum();
        }
        resume();

        if (
          tap &&
          tap.pointerId === event.pointerId &&
          !didDrag &&
          Math.hypot(event.clientX - tap.x, event.clientY - tap.y) <= 10
        ) {
          didNavigateBrandTap = true;
          router.push(tap.href);
        }
      };
      const handleRowClick = (event) => {
        if (didNavigateBrandTap) {
          event.preventDefault();
          event.stopPropagation();
          didNavigateBrandTap = false;
          return;
        }

        if (didDrag) {
          event.preventDefault();
          event.stopPropagation();
          didDrag = false;
          return;
        }

        if (!isBrandRow) {
          return;
        }

        const brandCard = event.target?.closest?.('.home-brand-card');
        const href = brandCard?.dataset?.brandHref || brandCard?.getAttribute?.('href');

        if (!brandCard || !row.contains(brandCard) || !href || href === '#brands') {
          return;
        }

        event.preventDefault();
        event.stopPropagation();
        router.push(href);
      };
      animationFrame = window.requestAnimationFrame(autoScroll);

      row.addEventListener('pointerdown', startDrag);
      row.addEventListener('pointermove', moveDrag);
      row.addEventListener('touchstart', pause, { passive: true });
      row.addEventListener('wheel', pause, { passive: true });
      row.addEventListener('pointerup', endDrag);
      row.addEventListener('pointercancel', endDrag);
      row.addEventListener('touchend', resume);
      row.addEventListener('mouseleave', resume);
      row.addEventListener('click', handleRowClick, true);

      cleanup.push(() => {
        window.cancelAnimationFrame(animationFrame);
        window.cancelAnimationFrame(momentumFrame);
        window.clearTimeout(resumeTimer);
        row.removeEventListener('pointerdown', startDrag);
        row.removeEventListener('pointermove', moveDrag);
        row.removeEventListener('touchstart', pause);
        row.removeEventListener('wheel', pause);
        row.removeEventListener('pointerup', endDrag);
        row.removeEventListener('pointercancel', endDrag);
        row.removeEventListener('touchend', resume);
        row.removeEventListener('mouseleave', resume);
        row.removeEventListener('click', handleRowClick, true);
      });
    });

    return () => cleanup.forEach((dispose) => dispose());
  }, [homeData.stories, homeData.brands, homeData.offers, vipOffers.length, visibleGiftDiscountOffers.length, discountOnlyOffers.length, router]);

  useEffect(() => {
    setIsDiscountCodeCopied(false);
  }, [discountPopup?.code]);

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
        setHomeData(cachedHomeData && hasUsableHomeData(cachedHomeData) ? cachedHomeData : emptyHomeData);
        return;
      }

      const homePayload = hasFreshHome ? homeResult.value : cachedHomeData || emptyHomeData;
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

    if (bannerCount <= 1) {
      return;
    }

    bannerTimerRef.current = window.setTimeout(() => {
      setActiveBanner((current) => (current + 1) % bannerCount);
    }, 4200);
  };

  useEffect(() => {
    resetBannerTimer();

    return () => {
      clearBannerTimer();
    };
  }, [activeBanner, bannerCount]);

  useEffect(() => {
    if (bannerCount === 0 && activeBanner !== 0) {
      setActiveBanner(0);
      return;
    }

    if (bannerCount > 0 && activeBanner >= bannerCount) {
      setActiveBanner(0);
    }
  }, [activeBanner, bannerCount]);

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
  const storyDisplayItems = homeData.stories.map((story, index) => ({ story, index })).reverse();

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
    if (bannerCount <= 1) {
      return;
    }

    setActiveBanner((current) => (current - 1 + bannerCount) % bannerCount);
  };

  const showNextBanner = () => {
    if (bannerCount <= 1) {
      return;
    }

    setActiveBanner((current) => (current + 1) % bannerCount);
  };

  const showBanner = (index) => {
    if (bannerCount === 0) {
      return;
    }

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
      saveCachedHomeMobile(mobile);
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
      saveCachedHomeMobile(mobile);
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

    const existingCode = firstValue(offer, discountCodeKeys);

    if (existingCode) {
      setDiscountPopup({
        offer,
        code: existingCode,
        message: '\u06a9\u062f \u062a\u062e\u0641\u06cc\u0641 \u0622\u0645\u0627\u062f\u0647 \u0627\u0633\u062a.',
      });
      return;
    }

    try {
      setRequestingOfferId(offer.id);
      setIsRequestingDiscount(true);
      const data = await requestDiscountCode(offer, { mobile: loadCachedHomeMobile() });
      const receivedCode = getDiscountCode(data, offer) || '';

      setDiscountPopup({
        offer,
        code: receivedCode,
        message: receivedCode
          ? getDiscountMessage(data) || '\u06a9\u062f \u062a\u062e\u0641\u06cc\u0641 \u0628\u0627 \u0645\u0648\u0641\u0642\u06cc\u062a \u062f\u0631\u06cc\u0627\u0641\u062a \u0634\u062f.'
          : getDiscountMessage(data) || '\u062f\u0631 \u062d\u0627\u0644 \u062d\u0627\u0636\u0631 \u06a9\u062f\u06cc \u0628\u0631\u0627\u06cc \u0627\u06cc\u0646 \u067e\u06cc\u0634\u0646\u0647\u0627\u062f \u062f\u0631 \u062f\u0633\u062a\u0631\u0633 \u0646\u06cc\u0633\u062a. \u0644\u0637\u0641\u0627 \u06a9\u0645\u06cc \u0628\u0639\u062f \u062f\u0648\u0628\u0627\u0631\u0647 \u062a\u0644\u0627\u0634 \u06a9\u0646\u06cc\u062f.',
      });
    } catch {
      setDiscountPopup({
        offer,
        code: '',
        message: t.discountFailed,
      });
    } finally {
      setIsRequestingDiscount(false);
      setRequestingOfferId(null);
    }
  };

  const copyDiscountCode = async () => {
    if (!discountPopup?.code) return;

    try {
      await navigator.clipboard.writeText(discountPopup.code);
      setIsDiscountCodeCopied(true);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = discountPopup.code;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setIsDiscountCodeCopied(true);
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
    const collectionHref = getCollectionHref(displayedOffer);

    return (
      <article className={`home-offer-card home-offer-card--${offerType} ${isInactive ? 'is-inactive' : ''}`} key={offerKey}>
        {displayedOffer.offerType === 'vip-discount' ? <strong className="home-offer-vip-banner">وی‌آی‌پی</strong> : null}
        <div className="home-offer-media">
          {collectionHref ? (
            <Link className="home-offer-media-link" href={collectionHref} aria-label={displayedOffer.brand || displayedOffer.title}>
              <img src={displayedOffer.image} alt={displayedOffer.brand} />
            </Link>
          ) : (
            <img src={displayedOffer.image} alt={displayedOffer.brand} />
          )}
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
            {requestingOfferId === offer.id ? t.wait : '\u06a9\u062f \u062e\u0631\u06cc\u062f'}
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
      document.getElementById('brands')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    if (id === 'faq') {
      router.push('/faq');
      return;
    }

    if (id === 'gifts') {
      document.getElementById('gifts')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    if (!isLoggedIn) {
      openLogin();
      return;
    }

    router.push('/dashboard');
  };

  const handleBrandClick = (event, href) => {
    if (!href || href === '#brands') {
      return;
    }

    event.preventDefault();
    router.push(href);
  };

  const handleBrandPointerDown = (event, href) => {
    if (event.pointerType === 'mouse' && event.button !== 0) {
      brandTapRef.current = null;
      return;
    }

    brandTapRef.current = {
      href,
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
    };
  };

  const handleBrandPointerUp = (event, href) => {
    const tap = brandTapRef.current;
    brandTapRef.current = null;

    if (event.pointerType === 'mouse' && event.button !== 0) {
      return;
    }

    if (!tap || tap.pointerId !== event.pointerId || !href || href === '#brands') {
      return;
    }

    const moved = Math.hypot(event.clientX - tap.x, event.clientY - tap.y);

    if (moved <= 10) {
      router.push(href);
    }
  };


  return (
    <main className={`page-shell home-shell ${isDarkMode ? 'theme-dark' : ''} ${isLoginOpen ? 'is-login-open' : ''}`} dir="rtl">
      <section className="frame home-frame">
        <header className="topbar d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            <Link className="brand d-flex align-items-center" href="/" aria-label={t.home}>
              <img className="brand-logo-mark" src={brandAssets.logoMark} alt="" aria-hidden="true" />
              <img className="brand-logo-type" src={brandAssets.logoType} alt={t.brand} />
            </Link>
            <nav>
              <ul className="nav-list d-flex align-items-center">
                <li><Link href="/">{t.home}</Link></li>
                <li><button type="button" onClick={() => document.getElementById('gifts')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>{t.gifts}</button></li>
                <li><a href="#brands">{t.businesses}</a></li>
                <li><a href="#brands">{t.shop}</a></li>
                <li><Link href="/faq">{t.faq}</Link></li>
                <li><button type="button" onClick={openAccount}>{t.club}</button></li>
                <li><Link href="/contact">{t.contact}</Link></li>
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
            <input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder={t.search} />
            {searchQuery ? (
              <button className="home-search-clear" type="button" onClick={() => setSearchQuery('')} aria-label={t.close}>
                ×
              </button>
            ) : null}
          </label>
        </section>

        {normalizedSearchQuery ? (
          <section className="home-section home-search-results-section">
            <div className="home-section-head">
              <div>
                <span>{searchResultCount ? `${searchResultCount} نتیجه پیدا شد` : t.noResults}</span>
                <h2>{t.searchResults}</h2>
              </div>
              <strong>{searchQuery}</strong>
            </div>
            {filteredOffers.length ? (
              <div className="home-search-offer-results">
                {filteredOffers.map(renderOfferCard)}
              </div>
            ) : filteredBrands.length ? (
              <div className="home-brand-grid">
                {filteredBrands.map((brand) => {
                  const href = getBrandHref(brand);

                  return (
                    <Link
                      className="home-brand-card"
                      href={href}
                      data-brand-href={href}
                      onClick={(event) => handleBrandClick(event, href)}
                      onPointerDown={(event) => handleBrandPointerDown(event, href)}
                      onPointerUp={(event) => handleBrandPointerUp(event, href)}
                      key={`search-brand-${brand.title}`}
                    >
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
                  );
                })}
              </div>
            ) : null}
          </section>
        ) : null}

        <section className="home-about-intro" id="about" aria-label={t.about}>
          <div className="home-about-icon" aria-hidden="true">
            <Info />
          </div>
          <div className="home-about-copy">
            <span>{t.about}</span>
            <p>{t.heroText}</p>
            <p>{t.heroSummary}</p>
          </div>
          <div className="home-about-side">
            <strong>{t.startupTitle}</strong>
            <p>{t.startupText}</p>
            <div className="home-about-contact">
              <a href="tel:09059399545"><PhoneCall />09059399545</a>
              <a href="https://www.instagram.com/keymiay.app/" target="_blank" rel="noreferrer"><InstagramGlyph />keymiay.app</a>
            </div>
          </div>
        </section>

        <section className="home-stories" aria-label={t.selectedBrands}>
          {storyDisplayItems.map(({ story, index }) => (
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
                {bannerCount ? (
                  bannerItems.map((banner, index) => (
                    <div className="home-banner-slide" key={`${banner.title}-${index}`}>
                      <img
                        src={banner.image}
                        alt={`${t.bannerAlt} ${banner.title}`}
                        onError={() => setFailedBannerImages((current) => ({ ...current, [banner.image]: true }))}
                      />
                    </div>
                  ))
                ) : (
                  <div className="home-banner-slide is-placeholder" aria-hidden="true">
                    <span className="home-banner-empty" />
                  </div>
                )}
              </div>
            </div>

            <button className="home-banner-nav home-banner-nav-prev" type="button" onClick={showNextBanner} aria-label="Next banner">
              <ChevronRight />
            </button>
            <button className="home-banner-nav home-banner-nav-next" type="button" onClick={showPreviousBanner} aria-label="Previous banner">
              <ChevronLeft />
            </button>

            <div className="home-banner-dots" aria-label="Banner navigation">
              {bannerDots.map((banner, index) => (
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
              <a className="home-primary-action" href="#brands">{t.viewRestaurant}</a>
              <button type="button" onClick={() => document.getElementById('gifts')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>{t.seeGifts}</button>
            </div>
          </aside>
        </section>

        {vipOffers.length ? (
  <section className="home-section home-offer-section home-vip-section" id="vip-gifts">
    <div className="home-section-head">
      <div>
        <span>پیشنهادهای ویژه</span>

      </div>

      <button
        className="home-text-action"
        type="button"
        onClick={() =>
          document.getElementById('gifts')?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          })
        }
      >
        مشاهده بقیه کارت‌ها
      </button>
    </div>

    <div className="home-offer-grid home-vip-offer-grid">
      {vipOffers.map(renderOfferCard)}
    </div>
  </section>
     ) : null}

        <section className="home-section" id="brands">
          <div className="home-section-head">
            <div>
              <span>{t.selectedBrands}</span>
              <h2>{t.popularBusinesses}</h2>
            </div>
            <button className="home-text-action" type="button">{t.all}</button>
          </div>
          <div className="home-brand-grid" data-auto-loop="true">
            {brandLoopItems.map((brand, index) => {
              const href = getBrandHref(brand);

              return (
                <Link
                  className="home-brand-card"
                  href={href}
                  data-brand-href={href}
                  onClick={(event) => handleBrandClick(event, href)}
                  onPointerDown={(event) => handleBrandPointerDown(event, href)}
                  onPointerUp={(event) => handleBrandPointerUp(event, href)}
                  key={`${brand.title}-${index}`}
                >
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
              );
            })}
          </div>
        </section>

        {visibleGiftDiscountOffers.length ? (
          <section className="home-section home-offer-section" id="gifts">
            <div className="home-section-head">
              <div>
                <span>{t.giftDiscountKicker}</span>
                <h2>{t.giftDiscountCards}</h2>
              </div>
              <button className="home-text-action" type="button">{t.all}</button>
            </div>
            <div className="home-offer-grid">
              {visibleGiftDiscountOffers.map(renderOfferCard)}
            </div>
          </section>
        ) : null}

        {discountOnlyOffers.length ? (
          <section className="home-section home-offer-section" id="discount-only">
            <div className="home-section-head">
              <div>
                <span>{t.simpleDiscountKicker}</span>
                <h2>{t.simpleDiscountCards}</h2>
              </div>
              <button className="home-text-action" type="button">{t.all}</button>
            </div>
            <div className="home-offer-grid">
              {discountOnlyOffers.map(renderOfferCard)}
            </div>
          </section>
        ) : null}
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

        <section className="home-section home-faq-section" id="faq-preview">
          <div className="home-section-head">
            <div>
              <span>سوالات کی‌میای</span>
              <h2>سوالات متداول کی‌میای</h2>
            </div>
            <Link className="home-text-action" href="/faq">مشاهده کامل</Link>
          </div>
          <div className="home-faq-groups">
            {keymiayFaqGroups.map((group) => (
              <details className="home-faq-group" key={group.title}>
                <summary className="home-faq-group-summary">
                  <h3>{group.title}</h3>
                  <span>{toPersianDigits(group.questions.length)} سوال</span>
                </summary>
                <div className="home-faq-list">
                  {group.questions.map(([question, answer], index) => (
                    <details className="home-faq-item" key={question}>
                      <summary>
                        <span>{toPersianDigits(index + 1)}</span>
                        {question}
                      </summary>
                      <p>{answer}</p>
                    </details>
                  ))}
                </div>
              </details>
            ))}
          </div>
        </section>
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
    <section
      className="home-discount-popup"
      onClick={(event) => event.stopPropagation()}
    >
      <button
        type="button"
        className="home-popup-close"
        onClick={() => setDiscountPopup(null)}
      >
        {t.close}
      </button>

      <span className="home-eyebrow">
        {discountPopup.offer?.brand}
      </span>

      <h2>
        {discountPopup.code
          ? t.discountCode
          : discountPopup.offer?.title}
      </h2>

      {discountPopup.code ? (
        <div className="home-discount-code-wrap">
          <div className="home-discount-code">{discountPopup.code}</div>
          <button className="home-discount-copy" type="button" onClick={copyDiscountCode}>
            {isDiscountCodeCopied ? <Check /> : <Copy />}
            <span>{isDiscountCodeCopied ? t.copiedCode : t.copyCode}</span>
          </button>
        </div>
      ) : (
        <div className="home-discount-code is-empty">کدی دریافت نشد</div>
      )}

      <p>{discountPopup.message}</p>
    </section>
  </div>
)}
    </main>
  );
}

export default HomePage;

























