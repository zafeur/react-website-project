import { useEffect, useMemo, useState } from 'react';
import { Crown, LogOut } from 'lucide-react';
import userAvatarImage from '../assets/images/user-avatar.jpg';
import { extractActiveGiftsFromReport, getDiscountReport } from '../api/user';
import { dashboardActions, mobileProfileLinks } from '../data/siteData';

const getImageSrc = (image) => image?.src || image;
const toPersianDigits = (value) =>
  String(value ?? '').replace(/[0-9]/g, (digit) => '??????????'[Number(digit)]);

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

const normalizeGift = (gift, index) => {
  const title = firstValue(gift, ['title', 'name', 'gift_title', 'discount_title', 'code_title']) || 'هدیه فعال';
  const place =
    getNestedValue(gift, ['collection.name', 'business.name', 'brand.name', 'code.collection.name']) ||
    firstValue(gift, ['place', 'business_name', 'collection_name', 'brand', 'prefix']) ||
    'مجموعه کی میای';
  const time = firstValue(gift, ['expires_at', 'expire_at', 'expiresAt', 'used_at', 'created_at', 'date']) || 'فعال';
  const image =
    getNestedValue(gift, ['collection.images', 'collection.image', 'business.image', 'brand.image']) ||
    firstValue(gift, ['image', 'images', 'logo']) ||
    getImageSrc(userAvatarImage);

  return {
    id: firstValue(gift, ['id', 'code', 'token']) || `${title}-${index}`,
    title,
    place,
    time,
    image,
  };
};

function DashboardPage({ isVisible, sectionRequest, userProfile, onEditProfile, onLogout }) {
  const [activeSection, setActiveSection] = useState('gifts');
  const [activeGiftItems, setActiveGiftItems] = useState([]);
  const [isReportLoading, setIsReportLoading] = useState(false);
  const [reportError, setReportError] = useState('');

  const profileName = useMemo(() => getProfileName(userProfile), [userProfile]);
  const profileMobile = toPersianDigits(getProfileField(userProfile, ['mobile', 'phone', 'phone_number', 'mobile_number']));
  const profileEmail = getProfileField(userProfile, ['email']);
  const profileBirthDate = toPersianDigits(getProfileField(userProfile, ['birthDate', 'birth_date', 'birthday']));
  const profileLevel = getProfileField(userProfile, ['level', 'rank', 'membership_level']) || 'تکمیل نشده';
  const profileScore = getProfileField(userProfile, ['score', 'points', 'credit']) || 'تکمیل نشده';

  const loadActiveGifts = async () => {
    try {
      setIsReportLoading(true);
      setReportError('');
      const data = await getDiscountReport();
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

  const showSection = (section) => {
    if (disabledSections.has(section)) {
      setActiveSection('gifts');
      return;
    }

    setActiveSection(section);
    window.setTimeout(() => {
      const isMobile = window.matchMedia?.('(max-width: 768px)').matches;
      const targetId = isMobile
        ? section === 'account'
          ? 'mobile-account'
          : 'mobile-dashboard-section'
        : 'dashboard-active-section';

      document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);
  };

  useEffect(() => {
    if (isVisible && sectionRequest?.section) {
      showSection(sectionRequest.section);
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
            <img src={gift.image} alt={gift.title} />
            <div>
              <h3>{gift.title}</h3>
              <p>{gift.place}</p>
              <span>{gift.time}</span>
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
          <img src={getImageSrc(userAvatarImage)} alt={profileName} />
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
        <img className="dashboard-avatar" src={getImageSrc(userAvatarImage)} alt={profileName} />
        <div className="dashboard-user-copy">
          <h1><Crown /> {profileName}</h1>
          <p>سطح شما: <span>{profileLevel}</span></p>
          <strong>{profileScore}</strong>
          <button className="dashboard-inline-action" type="button" onClick={onEditProfile}>تکمیل / ویرایش اطلاعات</button>
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
              <button className="dashboard-inline-action" type="button" onClick={onEditProfile}>ویرایش اطلاعات</button>
            </div>
            <div className="account-info-grid">
              <article><span>نام کاربر</span><strong>{profileName}</strong></article>
              <article><span>شماره تماس</span><strong>{profileMobile || 'ثبت نشده'}</strong></article>
              <article><span>ایمیل</span><strong>{profileEmail || 'ثبت نشده'}</strong></article>
              <article><span>تاریخ تولد</span><strong>{profileBirthDate || 'ثبت نشده'}</strong></article>
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