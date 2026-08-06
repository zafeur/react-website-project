import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import {
  Award,
  ChevronLeft,
  Gamepad2,
  Navigation,
  Star,
  Users,
  Wallet,
} from 'lucide-react';
import restaurantInteriorImage from '../assets/images/restaurant-interior.jpg';
import userAvatarImage from '../assets/images/user-avatar.jpg';
import { getDiscountCards } from '../api/home';
import { getCollectionDetails, toggleCollectionFollow } from '../api/collections';
import { getBusinessWallet, getMockWallet } from '../api/wallet';
import { toPersianDigits } from '../helper/persianDigits';
import { businessProfiles, stars } from '../data/siteData';

const getImageSrc = (image) => image?.src || image;
const DEFAULT_BUSINESS_ID = 'melal';
const API_MEDIA_BASE_URL = 'https://api.didarads.com/api/v1/';

const uiText = {
  walletRequired: '\u0648\u0631\u0648\u062f \u0644\u0627\u0632\u0645 \u0627\u0633\u062a',
  walletEmpty: '\u06f0 \u062a\u0648\u0645\u0627\u0646',
  walletUsable: '\u062f\u0631 \u062e\u0631\u06cc\u062f \u0628\u0639\u062f\u06cc \u0627\u0632 \u0647\u0645\u06cc\u0646 \u0645\u062c\u0645\u0648\u0639\u0647 \u0642\u0627\u0628\u0644 \u0627\u0633\u062a\u0641\u0627\u062f\u0647 \u0627\u0633\u062a.',
  walletLoginText: '\u0628\u0631\u0627\u06cc \u0645\u0634\u0627\u0647\u062f\u0647 \u06a9\u06cc\u0641 \u067e\u0648\u0644 \u0627\u062e\u062a\u0635\u0627\u0635\u06cc \u0627\u06cc\u0646 \u0645\u062c\u0645\u0648\u0639\u0647 \u0648\u0627\u0631\u062f \u062d\u0633\u0627\u0628 \u0634\u0648\u06cc\u062f.',
  locationTitle: '\u0645\u0648\u0642\u0639\u06cc\u062a \u0645\u06a9\u0627\u0646\u06cc',
  routeAction: '\u0645\u0633\u06cc\u0631 \u06cc\u0627\u0628\u06cc',
  hoursTitle: '\u0633\u0627\u0639\u0627\u062a \u06a9\u0627\u0631\u06cc',
  viewAction: '\u0645\u0634\u0627\u0647\u062f\u0647',
  contactTitle: '\u062a\u0645\u0627\u0633 \u0628\u0627 \u0645\u0627',
  missingPhone: '\u0634\u0645\u0627\u0631\u0647 \u062a\u0645\u0627\u0633 \u062b\u0628\u062a \u0646\u0634\u062f\u0647',
  callAction: '\u062a\u0645\u0627\u0633',
  suitableForAll: '\u0645\u0646\u0627\u0633\u0628 \u0628\u0631\u0627\u06cc \u0647\u0645\u0647',
  collectionFallback: '\u0645\u062c\u0645\u0648\u0639\u0647',
  selectedServices: '\u062e\u062f\u0645\u0627\u062a \u0645\u0646\u062a\u062e\u0628',
  servicesFallback: '\u062e\u062f\u0645\u0627\u062a',
  qualityFallback: '\u06a9\u06cc\u0641\u06cc\u062a \u0628\u0627\u0644\u0627',
  walletTitle: '\u06a9\u06cc\u0641 \u067e\u0648\u0644 \u0627\u062e\u062a\u0635\u0627\u0635\u06cc',
  specialOffer: '\u067e\u06cc\u0634\u0646\u0647\u0627\u062f \u0648\u06cc\u0698\u0647',
  activeGiftDiscount: '\u0647\u062f\u06cc\u0647 \u0648 \u062a\u062e\u0641\u06cc\u0641 \u0641\u0639\u0627\u0644',
  defaultRating: '\u06f4.\u06f8',
  defaultVotes: '\u06f2\u06f3\u06f4 \u0631\u0627\u06cc',
  collectionWallet: '\u06a9\u06cc\u0641 \u067e\u0648\u0644 \u0627\u06cc\u0646 \u0645\u062c\u0645\u0648\u0639\u0647',
  points: '\u0627\u0645\u062a\u06cc\u0627\u0632 \u0634\u0645\u0627',
  activeDiscountCode: '\u06a9\u062f \u062a\u062e\u0641\u06cc\u0641 \u0641\u0639\u0627\u0644',
  cashback: '\u06a9\u0634\u200c\u0628\u06a9 \u062e\u0631\u06cc\u062f\u0647\u0627',
  socialActions: '\u0631\u0627\u0647\u200c\u0647\u0627\u06cc \u0627\u0631\u062a\u0628\u0627\u0637\u06cc',
  instagram: '\u0627\u06cc\u0646\u0633\u062a\u0627\u06af\u0631\u0627\u0645',
  banner: '\u0628\u0646\u0631',
  reviews: '\u0646\u0638\u0631\u0627\u062a \u06a9\u0627\u0631\u0628\u0631\u0627\u0646',
  reviewerName: '\u0645\u062d\u0645\u062f \u0627\u062d\u0645\u062f\u06cc',
  reviewText: '\u0647\u0645\u06cc\u0634\u0647 \u062a\u062c\u0631\u0628\u0647 \u062e\u0648\u0628\u06cc \u062f\u0631 \u0627\u06cc\u0646 \u0645\u062c\u0645\u0648\u0639\u0647 \u062f\u0627\u0634\u062a\u0647\u200c\u0627\u0645. \u06a9\u06cc\u0641\u06cc\u062a \u062e\u062f\u0645\u0627\u062a \u0639\u0627\u0644\u06cc \u0627\u0633\u062a \u0648 \u0645\u062d\u06cc\u0637 \u0628\u0633\u06cc\u0627\u0631 \u062f\u0644\u0646\u0634\u06cc\u0646\u06cc \u062f\u0627\u0631\u062f. \u0631\u0641\u062a\u0627\u0631 \u067e\u0631\u0633\u0646\u0644 \u0647\u0645 \u0645\u062d\u062a\u0631\u0645\u0627\u0646\u0647 \u0648 \u062d\u0631\u0641\u0647\u200c\u0627\u06cc \u0627\u0633\u062a.',
};

const profileTabs = ['\u062f\u0631\u0628\u0627\u0631\u0647 \u0645\u0627', '\u0645\u062d\u0635\u0648\u0644\u0627\u062a \u0648 \u062e\u062f\u0645\u0627\u062a', '\u0647\u062f\u0627\u06cc\u0627', '\u06af\u0627\u0644\u0631\u06cc', '\u0646\u0638\u0631\u0627\u062a \u06a9\u0627\u0631\u0628\u0631\u0627\u0646', '\u0645\u0648\u0642\u0639\u06cc\u062a'];

const firstValue = (item, keys) => keys
  .map((key) => item?.[key])
  .find((value) => value !== undefined && value !== null && value !== '');

const normalizeKey = (value = '') => String(value).trim().toLowerCase();

const normalizeTextKey = (value = '') => String(value)
  .trim()
  .toLowerCase()
  .replace(/[\s\u200c_\-]+/g, '');

const normalizeMediaUrl = (value, fallback) => {
  if (!value) return fallback;
  if (/^(https?:|data:|blob:|\/)/.test(value)) return value;

  try {
    return new URL(value, API_MEDIA_BASE_URL).toString();
  } catch {
    return fallback;
  }
};

const normalizePhoneHref = (phone = '') => String(phone)
  .replace(/[\u06F0-\u06F9]/g, (digit) => String(digit.charCodeAt(0) - 1776))
  .replace(/[\u0660-\u0669]/g, (digit) => String(digit.charCodeAt(0) - 1632))
  .replace(/[^0-9+]/g, '');

const replaceBrokenImage = (event, fallback) => {
  if (!fallback) return;
  event.currentTarget.onerror = null;
  event.currentTarget.src = fallback;
};

const resolveApiData = (payload) => payload?.data || payload?.collection || payload?.details || payload;

const formatWalletBalance = (amount) => `${new Intl.NumberFormat('fa-IR').format(Number(amount) || 0)} \u062a\u0648\u0645\u0627\u0646`;

const findCollectionList = (source) => {
  if (Array.isArray(source)) return source;
  if (!source || typeof source !== 'object') return [];

  for (const key of ['collections', 'collection', 'codes', 'discounts', 'data', 'items', 'records', 'result']) {
    const value = source[key];
    if (Array.isArray(value)) return value;

    if (value && typeof value === 'object') {
      const nested = findCollectionList(value);
      if (nested.length) return nested;
    }
  }

  return [];
};

const findBusinessProfile = (businessId = DEFAULT_BUSINESS_ID) => {
  const rawBusinessId = String(businessId || '').trim();
  const normalizedBusinessId = normalizeKey(rawBusinessId || DEFAULT_BUSINESS_ID);
  const isNumericCollection = /^\d+$/.test(rawBusinessId);

  const matchedProfile = businessProfiles.find((profile) => {
    const aliases = Array.isArray(profile.aliases) ? profile.aliases : [];
    const values = [profile.id, profile.slug, profile.collectionId, profile.title, profile.shortTitle, ...aliases].map(normalizeKey);
    return values.some((value) => value && (value === normalizedBusinessId || (!isNumericCollection && (value.includes(normalizedBusinessId) || normalizedBusinessId.includes(value)))));
  });

  if (matchedProfile) return matchedProfile;

  if (isNumericCollection) {
    return {
      ...(businessProfiles[0] || {}),
      id: `collection-${rawBusinessId}`,
      slug: `collection-${rawBusinessId}`,
      collectionId: rawBusinessId,
      title: `${uiText.collectionFallback} ${toPersianDigits(rawBusinessId)}`,
      shortTitle: `${uiText.collectionFallback} ${toPersianDigits(rawBusinessId)}`,
      logoText: '',
      logoSmall: '',
      category: uiText.collectionFallback,
      specialty: uiText.servicesFallback,
      description: '',
      image: getImageSrc(restaurantInteriorImage),
      bannerImage: getImageSrc(restaurantInteriorImage),
    };
  }

  return businessProfiles.find((profile) => profile.id === DEFAULT_BUSINESS_ID) || businessProfiles[0];
};

const findBusinessProfileFromApiData = (data, fallbackProfile) => {
  const candidates = [
    firstValue(data, ['prefix', 'slug', 'businessSlug', 'business_slug']),
    firstValue(data, ['name', 'title', 'business_name', 'collection_name']),
    firstValue(data, ['image', 'images', 'logo', 'logo_url', 'image_url']),
  ].filter(Boolean).map(normalizeTextKey);

  return businessProfiles.find((profile) => {
    const aliases = Array.isArray(profile.aliases) ? profile.aliases : [];
    const profileValues = [profile.id, profile.slug, profile.title, profile.shortTitle, profile.image, ...aliases]
      .filter(Boolean)
      .map(normalizeTextKey);

    return candidates.some((candidate) => profileValues.some((value) => value && candidate && (candidate.includes(value) || value.includes(candidate))));
  }) || fallbackProfile;
};

const findApiCollection = (payload, businessId) => {
  const normalizedBusinessId = normalizeTextKey(businessId || DEFAULT_BUSINESS_ID);

  return findCollectionList(payload).find((item) => {
    const values = [
      firstValue(item, ['id', 'collection_id', 'collectionId']),
      firstValue(item, ['prefix', 'slug', 'businessSlug', 'business_slug']),
      firstValue(item, ['name', 'title', 'business_name']),
      firstValue(item, ['images', 'image', 'logo', 'logo_url']),
    ].map(normalizeTextKey);

    return values.some((value) => value && (value === normalizedBusinessId || value.includes(normalizedBusinessId) || normalizedBusinessId.includes(value)));
  });
};

const normalizeApiCollectionProfile = (source, fallbackProfile) => {
  const data = resolveApiData(source) || {};
  const matchedFallbackProfile = findBusinessProfileFromApiData(data, fallbackProfile);
  const collectionId = firstValue(data, ['collection_id', 'collectionId', 'id']) || matchedFallbackProfile.collectionId;
  const slug = firstValue(data, ['prefix', 'slug', 'businessSlug', 'business_slug']) || matchedFallbackProfile.slug || matchedFallbackProfile.id;
  const title = firstValue(data, ['title', 'name', 'business_name', 'collection_name']) || matchedFallbackProfile.title;
  const imageFallback = matchedFallbackProfile.image || fallbackProfile.image || getImageSrc(restaurantInteriorImage);
  const bannerFallbackImage = matchedFallbackProfile.bannerImage || fallbackProfile.bannerImage || getImageSrc(restaurantInteriorImage);
  const image = normalizeMediaUrl(firstValue(data, ['profile_image', 'profileImage', 'image', 'images', 'logo', 'logo_url', 'image_url']), imageFallback);
  const bannerImage = normalizeMediaUrl(firstValue(data, ['banner_image', 'bannerImage', 'banner', 'cover_image', 'coverImage']), bannerFallbackImage);
  const walletBalance = firstValue(data, ['wallet_balance', 'walletBalance', 'walletBalanceAmount', 'balance', 'credit']);

  return {
    ...matchedFallbackProfile,
    ...data,
    id: slug || collectionId || matchedFallbackProfile.id,
    slug,
    collectionId,
    logoText: data.logoText || data.logo_text || '',
    logoSmall: data.logoSmall || data.logo_small || '',
    title,
    shortTitle: firstValue(data, ['shortTitle', 'short_title', 'short_name']) || title,
    image,
    imageFallback,
    bannerImage,
    bannerFallbackImage,
    bannerMode: matchedFallbackProfile.bannerMode || 'photo',
    description: firstValue(data, ['description', 'about', 'body', 'text']) || matchedFallbackProfile.description,
    category: firstValue(data, ['category', 'type', 'business_type']) || matchedFallbackProfile.category,
    specialty: firstValue(data, ['specialty', 'sub_category', 'subtitle']) || matchedFallbackProfile.specialty,
    rating: toPersianDigits(firstValue(data, ['rating', 'rate', 'score']) || matchedFallbackProfile.rating),
    votes: toPersianDigits(firstValue(data, ['votes', 'reviews_count', 'rate_count']) || matchedFallbackProfile.votes),
    address: toPersianDigits(firstValue(data, ['address', 'full_address', 'fullAddress', 'street_address', 'streetAddress']) || matchedFallbackProfile.address),
    phone: toPersianDigits(firstValue(data, ['phone_number', 'phoneNumber', 'phone', 'mobile', 'tel', 'telephone']) || matchedFallbackProfile.phone),
    hours: toPersianDigits(firstValue(data, ['hours', 'working_hours', 'work_time']) || matchedFallbackProfile.hours),
    walletBalance: walletBalance !== undefined ? Number(walletBalance) || 0 : matchedFallbackProfile.walletBalance,
    walletBalanceLabel: walletBalance !== undefined ? formatWalletBalance(walletBalance) : matchedFallbackProfile.walletBalanceLabel,
    mapUrl: firstValue(data, ['mapUrl', 'map_url', 'location_url', 'google_map', 'googleMap']) || matchedFallbackProfile.mapUrl,
    instagramUrl: firstValue(data, ['instagramUrl', 'instagram_url', 'instagram']) || matchedFallbackProfile.instagramUrl,
    isFollowed: Boolean(firstValue(data, ['is_followed', 'isFollowed', 'followed'])) || Boolean(matchedFallbackProfile.isFollowed),
  };
};

const findBusinessWallet = (wallets, profile) => (
  wallets.find((wallet) => {
    const aliases = Array.isArray(profile.aliases) ? profile.aliases : [];
    const haystack = `${wallet.id || ''} ${wallet.title || ''}`.toLowerCase();
    return [profile.id, profile.slug, profile.title, profile.shortTitle, ...aliases]
      .filter(Boolean)
      .some((key) => haystack.includes(String(key).toLowerCase()));
  }) || wallets[0]
);

const getBusinessFromQuery = (queryValue) => Array.isArray(queryValue) ? queryValue[0] : queryValue;
const getCollectionFromQuery = (router) => {
  const queryValue = getBusinessFromQuery(router.query.collection || router.query.id || router.query.collectionId);
  if (queryValue) return queryValue;

  const pathMatch = typeof router.asPath === 'string' ? router.asPath.match(/\/collections\/([^/?#]+)/) : null;
  return pathMatch ? decodeURIComponent(pathMatch[1]) : undefined;
};
const getMapHref = (profile) => profile.mapUrl || undefined;

function BusinessProfilePage({ isVisible, isLoggedIn = false, onRequireLogin }) {
  const router = useRouter();
  const selectedCollectionId = getCollectionFromQuery(router);
  const selectedBusinessId = selectedCollectionId || getBusinessFromQuery(router.query.business) || DEFAULT_BUSINESS_ID;
  const fallbackBusinessProfile = useMemo(() => findBusinessProfile(selectedBusinessId), [selectedBusinessId]);
  const [apiBusinessProfile, setApiBusinessProfile] = useState(null);
  const [isProfileLoading, setIsProfileLoading] = useState(Boolean(selectedCollectionId));
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const [followMessage, setFollowMessage] = useState('');
  const businessProfile = apiBusinessProfile || fallbackBusinessProfile;
  const [walletData, setWalletData] = useState(() => getMockWallet(businessProfile.id));
  const businessWallet = useMemo(() => findBusinessWallet(walletData.wallets, businessProfile), [walletData.wallets, businessProfile]);

  useEffect(() => {
    let isMounted = true;
    setApiBusinessProfile(null);
    setIsProfileLoading(Boolean(selectedCollectionId));
    setFollowMessage('');

    const loadCollectionProfile = async () => {
      let apiCollection = null;
      let baseProfile = fallbackBusinessProfile;

      if (selectedCollectionId) {
        try {
          const details = await getCollectionDetails(selectedCollectionId);
          if (!isMounted) return;

          const fromDetails = normalizeApiCollectionProfile(details, {
            ...fallbackBusinessProfile,
            collectionId: selectedCollectionId,
          });
          setApiBusinessProfile(fromDetails);
          setIsFollowing(Boolean(fromDetails.isFollowed));
          setIsProfileLoading(false);
          return;
        } catch {
          // Fall through to the public discount list if details are unavailable.
        }
      }

      try {
        const payload = await getDiscountCards();
        if (!isMounted) return;

        apiCollection = findApiCollection(payload, selectedCollectionId || selectedBusinessId);
        if (!apiCollection) {
          setIsProfileLoading(false);
          return;
        }

        const fromDiscountList = normalizeApiCollectionProfile(apiCollection, baseProfile);
        setApiBusinessProfile(fromDiscountList);
        setIsFollowing(Boolean(fromDiscountList.isFollowed));

        if (!fromDiscountList.collectionId) {
          setIsProfileLoading(false);
          return;
        }

        try {
          const details = await getCollectionDetails(fromDiscountList.collectionId);
          if (isMounted) {
            const fromDetails = normalizeApiCollectionProfile(details, fromDiscountList);
            setApiBusinessProfile(fromDetails);
            setIsFollowing(Boolean(fromDetails.isFollowed));
          }
        } catch {
          // Public discount data is still dynamic; authenticated details are optional.
        }

        if (isMounted) setIsProfileLoading(false);
      } catch {
        if (isMounted) {
          setApiBusinessProfile(null);
          setIsProfileLoading(false);
        }
      }
    };

    loadCollectionProfile();

    return () => {
      isMounted = false;
    };
  }, [fallbackBusinessProfile, selectedBusinessId, selectedCollectionId]);

  useEffect(() => {
    setWalletData(getMockWallet(businessProfile.id));
  }, [businessProfile.id]);

  useEffect(() => {
    if (!isVisible || !isLoggedIn) return;

    let isMounted = true;

    getBusinessWallet(businessProfile.id)
      .then((data) => {
        if (isMounted) setWalletData(data);
      })
      .catch(() => {
        if (isMounted) setWalletData(getMockWallet(businessProfile.id));
      });

    return () => {
      isMounted = false;
    };
  }, [businessProfile.id, isVisible, isLoggedIn]);

  const handleFollow = async () => {
    if (!businessProfile.collectionId) {
      setFollowMessage('\u0634\u0646\u0627\u0633\u0647 \u0645\u062c\u0645\u0648\u0639\u0647 \u0627\u0632 \u0633\u0645\u062a \u0633\u0631\u0648\u0631 \u062f\u0631\u06cc\u0627\u0641\u062a \u0646\u0634\u062f.');
      return;
    }

    if (!isLoggedIn) {
      setFollowMessage('\u0628\u0631\u0627\u06cc \u062f\u0646\u0628\u0627\u0644 \u06a9\u0631\u062f\u0646 \u0645\u062c\u0645\u0648\u0639\u0647 \u0627\u0628\u062a\u062f\u0627 \u0648\u0627\u0631\u062f \u062d\u0633\u0627\u0628 \u0634\u0648\u06cc\u062f.');
      onRequireLogin?.();
      return;
    }

    try {
      setIsFollowLoading(true);
      setFollowMessage('');
      const data = await toggleCollectionFollow(businessProfile.collectionId);
      const nextFollowState = firstValue(resolveApiData(data), ['is_followed', 'isFollowed', 'followed']);
      setIsFollowing(nextFollowState === undefined ? (current) => !current : Boolean(nextFollowState));
      setFollowMessage(firstValue(resolveApiData(data), ['message', 'text']) || '\u0648\u0636\u0639\u06cc\u062a \u062f\u0646\u0628\u0627\u0644 \u06a9\u0631\u062f\u0646 \u0628\u0647\u200c\u0631\u0648\u0632\u0631\u0633\u0627\u0646\u06cc \u0634\u062f.');
    } catch (error) {
      setFollowMessage(error.response?.data?.message || error.message || '\u062f\u0646\u0628\u0627\u0644 \u06a9\u0631\u062f\u0646 \u0645\u062c\u0645\u0648\u0639\u0647 \u0627\u0646\u062c\u0627\u0645 \u0646\u0634\u062f.');
    } finally {
      setIsFollowLoading(false);
    }
  };

  if (isVisible && selectedCollectionId && isProfileLoading && !apiBusinessProfile) {
    return (
      <div className="business-profile-page business-profile-loading-page" id="restaurant-top">
        <section className="business-profile-loading-card" aria-busy="true">
          <span className="business-profile-loading-logo" />
          <span className="business-profile-loading-line business-profile-loading-line-title" />
          <span className="business-profile-loading-line" />
        </section>
      </div>
    );
  }
  const walletAmount = toPersianDigits(isLoggedIn ? businessProfile.walletBalanceLabel || businessWallet?.balanceLabel || uiText.walletEmpty : uiText.walletRequired);
  const walletStatus = isLoggedIn
    ? businessWallet?.status || businessProfile.walletStatus || uiText.walletUsable
    : uiText.walletLoginText;
  const walletPoints = toPersianDigits(isLoggedIn ? businessWallet?.points || businessProfile.points : '');
  const walletDiscountCode = isLoggedIn ? businessWallet?.discountCode || businessProfile.discountCode : '';
  const walletCashback = toPersianDigits(isLoggedIn ? businessWallet?.cashbackLabel || businessProfile.cashbackLabel : '');
  const bannerImage = businessProfile.bannerImage || getImageSrc(restaurantInteriorImage);
  const bannerMode = businessProfile.bannerMode || 'photo';
  const displayedInfoCards = [
    {
      icon: Navigation,
      title: uiText.locationTitle,
      text: businessProfile.address || uiText.locationTitle,
      href: getMapHref(businessProfile),
      actionLabel: uiText.routeAction,
    },
    {
      icon: Wallet,
      title: uiText.hoursTitle,
      text: businessProfile.hours || uiText.viewAction,
      actionLabel: uiText.viewAction,
    },
    {
      icon: ChevronLeft,
      title: uiText.contactTitle,
      text: businessProfile.phone || uiText.missingPhone,
      href: businessProfile.phone ? `tel:${normalizePhoneHref(businessProfile.phone)}` : undefined,
      actionLabel: uiText.callAction,
    },
  ];

  const highlightItems = [
    { icon: Users, title: uiText.suitableForAll, text: businessProfile.category || uiText.collectionFallback },
    { icon: Award, title: uiText.selectedServices, text: businessProfile.specialty || uiText.qualityFallback },
    { icon: Wallet, title: uiText.walletTitle, text: walletStatus },
    { icon: Gamepad2, title: uiText.specialOffer, text: businessProfile.cashbackLabel || uiText.activeGiftDiscount },
  ];

  return (
    <div className={isVisible ? 'business-profile-page' : 'business-profile-page d-none'} id="restaurant-top">
      <section className="business-profile-layout">
        <aside className="profile business-profile-card">
          <div className="logo-circle business-logo-circle">
            {businessProfile.logoText ? (
              <>
                <span>{businessProfile.logoText}</span>
                {businessProfile.logoSmall && <small>{businessProfile.logoSmall}</small>}
              </>
            ) : (
              <img src={businessProfile.image} alt={businessProfile.title} onError={(event) => replaceBrokenImage(event, businessProfile.imageFallback)} />
            )}
          </div>

          <h1 className="profile-title">{businessProfile.title}</h1>
          <div className="rating business-rating d-flex align-items-center justify-content-center">
            <span>{businessProfile.rating || uiText.defaultRating}</span>
            <span>|</span>
            <span className="d-flex align-items-center gap-1">
              {stars.map((_, index) => (
                <Star className="star" key={index} />
              ))}
            </span>
            <span>{businessProfile.votes || uiText.defaultVotes}</span>
          </div>

          <div className="business-tags">
            <span>{businessProfile.category || uiText.collectionFallback}</span>
            <span>{businessProfile.specialty || uiText.servicesFallback}</span>
          </div>

          <button className="follow-btn business-follow-btn" type="button" onClick={handleFollow} disabled={isFollowLoading}>
            {isFollowLoading ? '\u0644\u0637\u0641\u0627 \u0635\u0628\u0631 \u06a9\u0646\u06cc\u062f...' : isFollowing ? '\u062f\u0646\u0628\u0627\u0644 \u0634\u062f\u0647' : '\u062f\u0646\u0628\u0627\u0644 \u06a9\u0631\u062f\u0646'}
          </button>
          {followMessage && <p className="business-follow-message">{followMessage}</p>}

          <section className="business-wallet-card business-wallet-panel">
            <div>
              <Wallet />
              <span>{uiText.collectionWallet}</span>
            </div>
            <strong>{walletAmount}</strong>
            <p>{walletStatus}</p>
            {walletPoints && <p>{uiText.points}: {walletPoints}</p>}
            {walletDiscountCode && <p>{uiText.activeDiscountCode}: {walletDiscountCode}</p>}
            {walletCashback && <p>{uiText.cashback}: {walletCashback}</p>}
          </section>

          {businessProfile.instagramUrl && (
            <div className="business-social-actions" aria-label={uiText.socialActions}>
              <a
                className="business-instagram-link"
                href={businessProfile.instagramUrl}
                rel="noreferrer"
                target="_blank"
                aria-label={`${uiText.instagram} ${businessProfile.title}`}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1.2" />
                </svg>
                <span>{uiText.instagram}</span>
              </a>
            </div>
          )}
        </aside>

        <div className="business-main-panel">
          <div className={`business-hero-banner business-hero-banner-${bannerMode}`}>
            <img className="hero-photo" src={bannerImage} alt={`${uiText.banner} ${businessProfile.title}`} onError={(event) => replaceBrokenImage(event, businessProfile.bannerFallbackImage)} />
          </div>

          <div className="info-row business-info-grid">
            {displayedInfoCards.map(({ icon: Icon, title, text, href, actionLabel }) => {
              const ActionIcon = title === uiText.locationTitle ? Navigation : ChevronLeft;
              const isPhoneCard = title === uiText.contactTitle;
              const isExternalLink = href && href.startsWith('http');

              return (
                <div className="info-card business-info-card" key={`${title}-${text}`}>
                  <span className="business-info-icon"><Icon /></span>
                  <div className="text-end business-info-copy">
                    {title && <span className="info-title">{title}</span>}
                    <span className={`info-text ${isPhoneCard ? 'business-phone-text' : ''}`} dir={isPhoneCard ? 'ltr' : 'rtl'}>{text}</span>
                    {href ? (
                      <a className="business-info-action" href={href} rel={isExternalLink ? 'noreferrer' : undefined} target={isExternalLink ? '_blank' : undefined}>
                        {actionLabel || uiText.viewAction}
                        <ActionIcon />
                      </a>
                    ) : (
                      <span className="business-info-action is-disabled">
                        {actionLabel || uiText.viewAction}
                        <ActionIcon />
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="business-feature-strip">
            {highlightItems.map(({ icon: Icon, title, text }) => (
              <div className="business-feature-item" key={title}>
                <Icon />
                <div>
                  <strong>{title}</strong>
                  <span>{text}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <nav className="tabs">
        <ul className="d-flex align-items-center justify-content-between">
          {profileTabs.map((tab) => (
            <li className={tab === profileTabs[2] ? 'active' : ''} key={tab}>{tab}</li>
          ))}
        </ul>
      </nav>

      <section className="panel review-panel">
        <h2 className="section-title review-title">{uiText.reviews}</h2>
        <div className="review-row d-flex align-items-start">
          <img className="avatar" src={getImageSrc(userAvatarImage)} alt={uiText.reviewerName} />
          <div className="text-end">
            <h3 className="review-name">{uiText.reviewerName}</h3>
            <div className="review-stars d-flex align-items-center gap-1">
              {stars.map((_, index) => (
                <Star className="star" key={index} />
              ))}
            </div>
            <p className="review-text">{uiText.reviewText}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default BusinessProfilePage;


