import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, Crown, Gift, LogOut, Mail, PencilLine, Phone, UserRound } from 'lucide-react';
import userAvatarImage from '../assets/images/user-avatar.jpg';
import { extractActiveGiftsFromReport, extractUserProfileFromReport, getDiscountReport } from '../api/user';
import { businessProfiles, dashboardActions, mobileProfileLinks } from '../data/siteData';
import { toPersianDigits } from '../helper/persianDigits';

const getImageSrc = (image) => image?.src || image;

const normalizeMediaUrl = (value = '') => {
  if (!value) return '';
  const raw = Array.isArray(value) ? value[0] : value;
  const text = String(raw).trim().replace(/^\"|\"$/g, '');
  if (!text || text === '[]') return '';
  if (/^(https?:|data:|blob:|\/)/.test(text)) return text;

  return 'https://api.keymiay.com/images/' + encodeURIComponent(text).replace(/%2F/g, '/');
};

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

  return fullName || [firstName, lastName].filter(Boolean).join(' ') || 'کاربر کی میای';
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
  return 'account';
};

const disabledSections = new Set(['wallet', 'processes', 'referral', 'history', 'stats']);

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

const normalizeComparable = (value = '') => String(value).trim().toLowerCase().replace(/[\s\u200c_-]+/g, '');

const cleanReportText = (value = '') => String(value)
  .replace(/\r?\n/g, ' ')
  .replace(/:\s*"?\[\]"?/g, '')
  .replace(/"?\[\]"?/g, '')
  .replace(/^[:\s"']+|[:\s"']+$/g, '')
  .replace(/\s+/g, ' ')
  .trim();

const hasPersianLetters = (value = '') => /[\u0600-\u06ff]/.test(String(value));

const isValidDiscountCode = (value = '') => {
  const normalized = cleanReportText(value);
  return /^[A-Za-z0-9_-]{4,}$/.test(normalized) && !hasPersianLetters(normalized);
};

const normalizeGiftStatus = (value, title, place) => {
  const normalized = cleanReportText(value);
  if (!normalized || normalized === title || normalized === place) return '\u0641\u0639\u0627\u0644';
  if (normalizeComparable(normalized) === normalizeComparable(title) || normalizeComparable(normalized) === normalizeComparable(place)) {
    return '\u0641\u0639\u0627\u0644';
  }

  const statusWords = ['\u0641\u0639\u0627\u0644', 'active', 'used', 'expired', '\u0645\u0646\u0642\u0636\u06cc', '\u0627\u0633\u062a\u0641\u0627\u062f\u0647'];
  const looksLikeDate = /\d{4}[-/]\d{1,2}[-/]\d{1,2}|\d{1,2}[-/]\d{1,2}[-/]\d{2,4}/.test(normalized);
  if (looksLikeDate || statusWords.some((word) => normalized.toLowerCase().includes(word))) {
    return normalized;
  }

  return '\u0641\u0639\u0627\u0644';
};

const findBusinessProfileForGift = (gift) => {
  if (isPrimitiveValue(gift)) return null;

  const collection = gift?.collection || gift?.business || gift?.brand || gift?.code?.collection;
  const directCollectionId = firstValue(gift, ['collection_id', 'collectionId', 'business_id', 'businessId']);
  const deepCollectionId = getDeepValue(gift, ['collection_id', 'collectionId', 'business_id', 'businessId', 'id']);
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
    return [directCollectionId, deepCollectionId].filter(Boolean).some((id) => profileIds.includes(String(id)));
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

const getGiftImage = (gift, matchedProfile) => {
  if (isPrimitiveValue(gift)) return matchedProfile?.image || matchedProfile?.bannerImage || '';

  const image = getDeepValue(gift, ['profile_image', 'profileImage', 'banner_image', 'bannerImage', 'image', 'images', 'logo', 'logo_url', 'image_url']);
  return normalizeMediaUrl(image || matchedProfile?.image || matchedProfile?.bannerImage || '');
};

const normalizeGift = (gift, index) => {
  const primitiveCode = isPrimitiveValue(gift) ? String(gift) : '';
  const matchedProfile = findBusinessProfileForGift(gift);
  const collectionName = getGiftCollectionName(gift, matchedProfile);
  const rawCode = primitiveCode || getDeepValue(gift, ['code', 'discount_code', 'discountCode', 'coupon_code', 'couponCode', 'token']);
  const code = isValidDiscountCode(rawCode) ? cleanReportText(rawCode) : '';
  const rawTitle = cleanReportText(getDeepValue(gift, ['title', 'gift_title', 'giftTitle', 'discount_title', 'discountTitle', 'code_title', 'codeTitle']));
  const title = rawTitle || collectionName || '\u0647\u062f\u06cc\u0647 \u0641\u0639\u0627\u0644';
  const time = normalizeGiftStatus(getDeepValue(gift, ['expires_at', 'expire_at', 'expiresAt', 'used_at', 'created_at', 'date', 'starts_at', 'startsAt', 'status']), title, collectionName);

  const apiImage = getGiftImage(gift, null);
  const fallbackImage = getGiftImage({}, matchedProfile);

  return {
    id: getDeepValue(gift, ['id', 'discount_id', 'discountId', 'code_id', 'codeId']) || code || `${title}-${index}`,
    title,
    place: collectionName,
    time: toPersianDigits(time),
    image: apiImage || fallbackImage,
    imageFallback: fallbackImage,
    code,
  };
};

function DashboardPage({ isVisible, sectionRequest, userProfile, onEditProfile, onLogout, onProfileFromReport }) {
  const [activeSection, setActiveSection] = useState('gifts');
  const [activeGiftItems, setActiveGiftItems] = useState([]);
  const [isReportLoading, setIsReportLoading] = useState(false);
  const [reportError, setReportError] = useState('');

  const profileName = useMemo(() => getProfileName(userProfile), [userProfile]);
  const profileMobile = toPersianDigits(getProfileField(userProfile, ['mobile', 'phone', 'phone_number', 'mobile_number']));
  const profileEmail = getProfileField(userProfile, ['email']);
  const profileBirthDate = toPersianDigits(getProfileField(userProfile, ['birthDate', 'birth_date', 'date', 'birthday']));
  const profileIsComplete = isProfileComplete(userProfile);
  const profileLevel = profileIsComplete ? 'اطلاعات تکمیل شده' : 'تکمیل نشده';
  const profileScore = profileIsComplete ? 'تکمیل شده' : 'تکمیل نشده';
  const profileAvatar = getProfileAvatar(userProfile) || getImageSrc(userAvatarImage);

  const loadActiveGifts = async () => {
    try {
      setIsReportLoading(true);
      setReportError('');
      const data = await getDiscountReport();
      const reportProfile = extractUserProfileFromReport(data);
      if (reportProfile) {
        onProfileFromReport?.(reportProfile);
      }
      setActiveGiftItems(extractActiveGiftsFromReport(data).map(normalizeGift));
    } catch (error) {
      setActiveGiftItems([]);
      setReportError(error.response?.data?.message || error.message || 'دریافت هدیه‌های فعال انجام نشد.');
    } finally {
      setIsReportLoading(false);
    }
  };

  useEffect(() => {
    if (isVisible) {
      loadActiveGifts();
    }
  }, [isVisible]);

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

  const renderActiveGifts = (mobile = false) => {
    if (isReportLoading) {
      return <p className="dashboard-empty-state">در حال دریافت هدیه‌های فعال...</p>;
    }

    if (reportError) {
      return <p className="dashboard-empty-state">{reportError}</p>;
    }

    if (!activeGiftItems.length) {
      return <p className="dashboard-empty-state">هدیه فعالی برای این حساب ثبت نشده است.</p>;
    }

    const listClass = mobile ? 'mobile-active-gifts-list' : 'active-gifts-grid';
    const itemClass = mobile ? 'mobile-active-gift' : 'active-gift-card';

    return (
      <div className={listClass}>
        {activeGiftItems.map((gift) => (
          <article className={itemClass} key={gift.id}>
            {gift.image ? <img src={gift.image} alt={gift.title} onError={(event) => handleGiftImageError(event, gift.imageFallback)} /> : <div className="active-gift-fallback"><Gift /></div>}
            <div className="active-gift-fallback active-gift-fallback-broken"><Gift /></div>
            <div>
              <h3>{gift.title}</h3>
              <p>{gift.code ? '\u06a9\u062f \u062a\u062e\u0641\u06cc\u0641' : gift.place}</p>
              {gift.code ? <span dir="ltr">{gift.code}</span> : <span>{gift.time}</span>}
            </div>
          </article>
        ))}
      </div>
    );
  };

  return (
    <section className="dashboard-page">
      <section className="mobile-dashboard">
        <section className="mobile-profile-card" id="mobile-account">
          <img src={profileAvatar} alt={profileName} />
          <div>
            <h1>{profileName}</h1>
            <button type="button" onClick={onEditProfile}>تکمیل / ویرایش اطلاعات</button>
          </div>
        </section>

        <section className="mobile-dashboard-section" id="mobile-dashboard-section">
          {activeSection === 'gifts' && (
            <section className="mobile-section-card">
              <div className="mobile-section-head">
                <h2>هدیه‌های فعال من</h2>
                <span>{activeGiftItems.length} هدیه</span>
              </div>
              {renderActiveGifts(true)}
            </section>
          )}
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
            </div>
          </section>
        )}

        {activeSection === 'gifts' && (
          <section className="panel active-gifts-panel" id="all-active-gifts">
            <div className="panel-head-row">
              <h2>هدیه‌های فعال من</h2>
              <button type="button" className="dashboard-inline-action" onClick={loadActiveGifts}>بروزرسانی</button>
            </div>
            {renderActiveGifts(false)}
          </section>
        )}
      </div>
    </section>
  );
}

export default DashboardPage;
