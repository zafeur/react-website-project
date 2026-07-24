import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  ChevronLeft,
  ChevronRight,
  Gift,
  Moon,
  PawPrint,
  Search,
  ShoppingBag,
  Sparkles,
  Star,
  Store,
  Sun,
  TicketPercent,
} from 'lucide-react';
import LoginModal from './LoginModal';
import MobileBottomNav from './MobileBottomNav';
import { sendOtp, verifyOtp } from '../api/auth';
import { getHomePageData, requestDiscountCode } from '../api/home';
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
  pet: "\u062d\u06cc\u0648\u0627\u0646\u0627\u062a \u062e\u0627\u0646\u06af\u06cc",
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
  { title: t.restaurant, businessId: 'melal', image: asset('img/restaurant-melal.png'), href: '/business/melal' },
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
  { id: 'melal-discount', businessId: 'melal', title: t.gift1, brand: t.restaurant, tag: t.free, image: asset('img/restaurant-melal.png') },
  { id: 'barial-discount', businessId: 'barial', title: t.gift2, brand: t.barial, tag: t.discount, image: asset('img/barial.jpg') },
  { id: 'dorato-discount', businessId: 'dorato', title: t.gift3, brand: t.dorato, tag: t.special, image: asset('img/logo dorato.jpg') },
  { id: 'ibamo-discount', businessId: 'ibamo', title: 'کد تخفیف خرید از ایبامو', brand: t.ibamo, tag: t.discount, code: 'IBAMO72WDBU', image: asset('img/logo ibamo.jpg') },
  { id: 'bakhshi-discount', businessId: 'bakhshi', title: 'کد تخفیف خرید از بخشی', brand: t.bakhshi, tag: t.discount, image: asset('img/bakhshi.jpg') },
  { id: 'bastani-discount', businessId: 'bastani', title: 'کد تخفیف خرید از باستانی', brand: t.bastani, tag: t.discount, image: asset('img/business-banners/bastani-logo-enhanced.png') },
  { id: 'mojalal-discount', businessId: 'mojalal', title: 'کد تخفیف خرید از مجلل', brand: t.mojalal, tag: t.discount, image: asset('img/mojalal.jpg') },
],
};

const categoryIcons = {
  Gift,
  Store,
  PawPrint,
  ShoppingBag,
  Star,
  Sparkles,
};

const normalizeList = (value, fallback) => (Array.isArray(value) && value.length ? value : fallback);

const firstValue = (item, keys) => keys.map((key) => item?.[key]).find(Boolean);

const resolveHomeData = (data) => data?.data || data?.home || data?.homepage || data || {};

const isRestaurantBrand = (title = '') =>
  title === t.restaurant || title.toLowerCase().includes('restaurant') || title.includes('\u0645\u0644\u0644');

const normalizeImage = (item, fallback) =>
  normalizeMediaUrl(
    firstValue(item, ['image', 'image_url', 'imageUrl', 'logo', 'logo_url', 'thumbnail', 'thumbnail_url', 'poster']),
    fallback
  );

const normalizeStories = (items) =>
  items.map((story, index) => {
    const rawTitle = firstValue(story, ['title', 'name', 'brand', 'business_name']) || `${t.selectedBrands} ${index + 1}`;
    const title = getStoryDisplayTitle(rawTitle);

    return {
      ...story,
      title,
      image: normalizeImage(story, defaultHomeData.stories[index % defaultHomeData.stories.length].image),
      video: normalizeMediaUrl(
        firstValue(story, ['video', 'video_url', 'videoUrl', 'media', 'media_url', 'mediaUrl', 'story_video', 'storyVideo']) || storyVideoByTitle[title] || storyVideoByTitle[rawTitle],
        ''
      ),
    };
  });

const normalizeCards = (items, fallback) =>
  items.map((item, index) => ({
    ...item,
    title: firstValue(item, ['title', 'name', 'brand', 'business_name']) || fallback[index % fallback.length].title,
    image: normalizeImage(item, fallback[index % fallback.length].image),
    href: firstValue(item, ['href', 'url', 'link']) || fallback[index % fallback.length].href,
    businessId: firstValue(item, ['businessId', 'business_id', 'businessSlug', 'business_slug', 'slug']) || fallback[index % fallback.length].businessId,
  }));

const normalizeOffers = (items) =>
  items.map((offer, index) => {
    const fallback = defaultHomeData.offers[index % defaultHomeData.offers.length];

    return {
      ...offer,
      id: firstValue(offer, ['id', 'discount_id', 'discountId', 'offer_id', 'offerId']) || fallback.id,
      businessId: firstValue(offer, ['businessId', 'business_id', 'businessSlug', 'business_slug', 'slug']) || fallback.businessId,
      title: firstValue(offer, ['title', 'name', 'gift_title', 'giftTitle']) || fallback.title,
      brand: firstValue(offer, ['brand', 'business', 'business_name', 'place']) || fallback.brand,
      tag: firstValue(offer, ['tag', 'badge', 'type', 'discount_type']) || fallback.tag,
      image: normalizeImage(offer, fallback.image),
    };
  });

const normalizeHomeData = (payload) => {
  const data = resolveHomeData(payload);
  const brands = normalizeCards(
    normalizeList(data?.brands || data?.businesses || data?.stores, defaultHomeData.brands),
    defaultHomeData.brands
  ).map((brand) =>
    isRestaurantBrand(brand.title)
      ? { ...brand, image: defaultHomeData.brands[0].image, businessId: brand.businessId || 'melal', href: brand.href || '/business/melal' }
      : brand
  );

  return {
    stories: normalizeStories(normalizeList(data?.stories || data?.story || data?.story_items, defaultHomeData.stories)),
    banners: normalizeCards(normalizeList(data?.banners || data?.sliders || data?.slides, defaultHomeData.banners), defaultHomeData.banners),
    brands,
    categories: normalizeList(data?.categories, defaultHomeData.categories),
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
const getOfferPercent = (offer) =>
  firstValue(offer, ['percent', 'discountPercent', 'discount_percent', 'percentage', 'badge']) ||
  (String(offer.tag || '').includes('رایگان') ? 'رایگان' : String(offer.title || '').match(/[۰-۹0-9]+\s*٪|٪\s*[۰-۹0-9]+|[۰-۹0-9]+\s*%|%\s*[۰-۹0-9]+/)?.[0] || '۱۰٪');

const getOfferStatus = (offer, index) =>
  firstValue(offer, ['status', 'time', 'expires', 'expiresIn', 'expires_in', 'timer']) ||
  (index % 3 === 0 ? 'منقضی' : index % 3 === 1 ? '۳۳۳:۰۱:۱۰:۱۹' : 'فعال');

const getOfferDescription = (offer) =>
  firstValue(offer, ['description', 'subtitle', 'text', 'body']) ||
  `با خرید از مجموعه‌های همکار کی میای، هدیه یا تخفیف ویژه ${offer.brand || 'این مجموعه'} را دریافت کنید.`;

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
  const bannerItems = mergeExtraBanners(homeData.banners.length ? homeData.banners : defaultHomeData.banners);


  useEffect(() => {
    setIsLoggedIn(hasAuthToken());
  }, []);

  useEffect(() => {
    let isMounted = true;

    getHomePageData()
      .then((data) => {
        if (isMounted) {
          setHomeData(normalizeHomeData(data));
        }
      })
      .catch(() => {
        if (isMounted) {
          setHomeData(defaultHomeData);
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
    if (!skipAuthCheck && !isLoggedIn) {
      setPendingOffer(offer);
      openLogin();
      return;
    }

    try {
      setIsRequestingDiscount(true);
      const data = await requestDiscountCode(offer);
      setDiscountPopup({
        offer,
        code: getDiscountCode(data, offer) || offer.code || '',
        message: getDiscountMessage(data) || t.discountRequested,
      });
    } catch (error) {
      setDiscountPopup({
        offer,
        code: '',
        message: error.response?.data?.message || error.message || t.discountFailed,
      });
    } finally {
      setIsRequestingDiscount(false);
    }
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
                <li><button type="button" onClick={openLogin}>{t.club}</button></li>
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
            <button className="login-btn home-login-btn" type="button" onClick={openLogin}>{t.login}</button>
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
                  <Link href={href || '#'}>
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
            {homeData.offers.map((offer, index) => {
              const offerStatus = getOfferStatus(offer, index);
              const isExpired = String(offerStatus).includes('منقضی');

              return (
                <article className={`home-offer-card ${isExpired ? 'is-expired' : ''}`} key={offer.title}>
                  <div className="home-offer-media">
                    <img src={offer.image} alt={offer.brand} />
                    <span className="home-offer-percent">{getOfferPercent(offer)}</span>
                    <span className={`home-offer-status ${isExpired ? 'is-expired' : ''}`}>{offerStatus}</span>
                  </div>
                  <div className="home-offer-copy">
                    <span>{offer.brand}</span>
                    <h3>{offer.title}</h3>
                    <p>{getOfferDescription(offer)}</p>
                  </div>
                  <div className="home-offer-footer">
                    <button type="button" onClick={() => handleReceiveOffer(offer)} disabled={isRequestingDiscount}>
                      {isRequestingDiscount ? t.wait : 'کد خرید'}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
        <footer className="home-footer" id="footer">
          <div>
            <h2>{t.brand}</h2>
            <p>{t.footerText}</p>
          </div>
          <div className="home-footer-links">
            <Link href="/">{t.home}</Link>
            <Link href="/restaurant">{t.restaurant}</Link>
            <button type="button" onClick={openLogin}>{t.club}</button>
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










