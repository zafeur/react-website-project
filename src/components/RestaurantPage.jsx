import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import {
  Award,
  ChevronLeft,
  Gamepad2,
  Heart,
  Navigation,
  Star,
  Users,
  Wallet,
} from 'lucide-react';
import restaurantInteriorImage from '../assets/images/restaurant-interior.jpg';
import userAvatarImage from '../assets/images/user-avatar.jpg';
import { getBusinessWallet, getMockWallet } from '../api/wallet';
import { businessProfiles, infoCards, stars, tabs } from '../data/siteData';

const getImageSrc = (image) => image?.src || image;
const DEFAULT_BUSINESS_ID = 'melal';

const normalizeKey = (value = '') => String(value).trim().toLowerCase();

const normalizePhoneHref = (phone = '') => String(phone)
  .replace(/[۰-۹]/g, (digit) => String(digit.charCodeAt(0) - 1776))
  .replace(/[٠-٩]/g, (digit) => String(digit.charCodeAt(0) - 1632))
  .replace(/[^0-9+]/g, '');

const getMapHref = (profile) => profile.mapUrl || undefined;

const getBusinessFromQuery = (queryValue) => {
  if (Array.isArray(queryValue)) {
    return queryValue[0];
  }

  return queryValue;
};

const findBusinessProfile = (businessId = DEFAULT_BUSINESS_ID) => {
  const normalizedBusinessId = normalizeKey(businessId || DEFAULT_BUSINESS_ID);

  return businessProfiles.find((profile) => {
    const aliases = Array.isArray(profile.aliases) ? profile.aliases : [];
    const values = [profile.id, profile.slug, profile.title, profile.shortTitle, ...aliases].map(normalizeKey);

    return values.some((value) => value && (value === normalizedBusinessId || value.includes(normalizedBusinessId) || normalizedBusinessId.includes(value)));
  }) || businessProfiles.find((profile) => profile.id === DEFAULT_BUSINESS_ID) || businessProfiles[0];
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

function RestaurantPage({ isVisible, isLoggedIn = false }) {
  const router = useRouter();
  const selectedBusinessId = getBusinessFromQuery(router.query.business) || DEFAULT_BUSINESS_ID;
  const businessProfile = useMemo(() => findBusinessProfile(selectedBusinessId), [selectedBusinessId]);
  const [walletData, setWalletData] = useState(() => getMockWallet(businessProfile.id));
  const businessWallet = useMemo(() => findBusinessWallet(walletData.wallets, businessProfile), [walletData.wallets, businessProfile]);

  useEffect(() => {
    setWalletData(getMockWallet(businessProfile.id));
  }, [businessProfile.id]);

  useEffect(() => {
    if (!isVisible || !isLoggedIn) {
      return;
    }

    let isMounted = true;

    getBusinessWallet(businessProfile.id)
      .then((data) => {
        if (isMounted) {
          setWalletData(data);
        }
      })
      .catch(() => {
        if (isMounted) {
          setWalletData(getMockWallet(businessProfile.id));
        }
      });

    return () => {
      isMounted = false;
    };
  }, [businessProfile.id, isVisible, isLoggedIn]);

  const walletAmount = isLoggedIn ? businessWallet?.balanceLabel || businessProfile.walletBalanceLabel || '۰ تومان' : 'ورود لازم است';
  const walletStatus = isLoggedIn
    ? businessWallet?.status || businessProfile.walletStatus || 'در خرید بعدی از همین مجموعه قابل استفاده است.'
    : 'برای مشاهده کیف پول اختصاصی این مجموعه وارد حساب شوید.';
  const walletPoints = isLoggedIn ? businessWallet?.points || businessProfile.points : '';
  const walletDiscountCode = isLoggedIn ? businessWallet?.discountCode || businessProfile.discountCode : '';
  const walletCashback = isLoggedIn ? businessWallet?.cashbackLabel || businessProfile.cashbackLabel : '';
  const displayedInfoCards = useMemo(() => (
    infoCards.map((card, index) => {
      if (index === 0) {
        return {
          ...card,
          title: 'موقعیت مکانی',
          text: businessProfile.address || card.text,
          href: getMapHref(businessProfile),
          actionLabel: 'مسیر یابی',
        };
      }

      if (index === 1) {
        return {
          ...card,
          title: 'ساعات کاری',
          text: businessProfile.hours || card.text,
          actionLabel: 'مشاهده',
        };
      }

      if (index === 2) {
        return {
          ...card,
          title: 'تماس با ما',
          text: businessProfile.phone || 'شماره تماس ثبت نشده',
          href: businessProfile.phone ? `tel:${normalizePhoneHref(businessProfile.phone)}` : undefined,
          actionLabel: 'تماس',
        };
      }

      return card;
    })
  ), [businessProfile.address, businessProfile.hours, businessProfile.mapUrl, businessProfile.phone]);
  const bannerImage = businessProfile.bannerImage || getImageSrc(restaurantInteriorImage);
  const bannerMode = businessProfile.bannerMode || 'photo';
  const highlightItems = [
    { icon: Users, title: 'مناسب برای همه', text: businessProfile.category || 'مجموعه' },
    { icon: Award, title: 'خدمات منتخب', text: businessProfile.specialty || 'کیفیت بالا' },
    { icon: Wallet, title: 'کیف پول اختصاصی', text: walletStatus },
    { icon: Gamepad2, title: 'پیشنهاد ویژه', text: businessProfile.cashbackLabel || 'هدیه و تخفیف فعال' },
  ];

  return (
    <div className={isVisible ? 'business-profile-page' : 'business-profile-page d-none'} id="restaurant-top">
      <section className="business-profile-layout">
        <aside className="profile business-profile-card">
          <button className="business-favorite-button" type="button" aria-label="افزودن به علاقه‌مندی‌ها">
            <Heart />
          </button>

          <div className="logo-circle business-logo-circle">
            {businessProfile.logoText ? (
              <>
                <span>{businessProfile.logoText}</span>
                {businessProfile.logoSmall && <small>{businessProfile.logoSmall}</small>}
              </>
            ) : (
              <img src={businessProfile.image} alt={businessProfile.title} />
            )}
          </div>

          <h1 className="profile-title">{businessProfile.title}</h1>
          <div className="rating business-rating d-flex align-items-center justify-content-center">
            <span>{businessProfile.rating || '۴.۸'}</span>
            <span>|</span>
            <span className="d-flex align-items-center gap-1">
              {stars.map((_, index) => (
                <Star className="star" key={index} />
              ))}
            </span>
            <span>{businessProfile.votes || '۲۳۴ رای'}</span>
          </div>

          <div className="business-tags">
            <span>{businessProfile.category || 'مجموعه'}</span>
            <span>{businessProfile.specialty || 'خدمات'}</span>
          </div>

          <button className="follow-btn business-follow-btn" type="button">دنبال کردن</button>

          <section className="business-wallet-card business-wallet-panel">
            <div>
              <Wallet />
              <span>کیف پول این مجموعه</span>
            </div>
            <strong>{walletAmount}</strong>
            <p>{walletStatus}</p>
            {walletPoints && <p>امتیاز شما: {walletPoints}</p>}
            {walletDiscountCode && <p>کد تخفیف فعال: {walletDiscountCode}</p>}
            {walletCashback && <p>کش‌بک خریدها: {walletCashback}</p>}
          </section>

          {businessProfile.instagramUrl && (
            <div className="business-social-actions" aria-label="راه‌های ارتباطی">
              <a
                className="business-instagram-link"
                href={businessProfile.instagramUrl}
                rel="noreferrer"
                target="_blank"
                aria-label={'اینستاگرام ' + businessProfile.title}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1.2" />
                </svg>
                <span>اینستاگرام</span>
              </a>
            </div>
          )}
        </aside>

        <div className="business-main-panel">
          <div className={`business-hero-banner business-hero-banner-${bannerMode}`}>
            <img
              className="hero-photo"
              src={bannerImage}
              alt={`بنر ${businessProfile.title}`}
            />

          </div>

          <div className="info-row business-info-grid">
            {displayedInfoCards.map(({ icon: Icon, title, text, href, actionLabel }) => {
              const ActionIcon = title === 'موقعیت مکانی' ? Navigation : ChevronLeft;
              const isPhoneCard = title === 'تماس با ما';
              const isExternalLink = href && href.startsWith('http');

              return (
                <div
                  className="info-card business-info-card d-flex align-items-start justify-content-between"
                  key={`${title}-${text}`}
                >
                  <span className="business-info-icon"><Icon /></span>
                  <div className="text-end business-info-copy">
                    {title && <span className="info-title">{title}</span>}
                    <span className={`info-text ${isPhoneCard ? 'business-phone-text' : ''}`} dir={isPhoneCard ? 'ltr' : 'rtl'}>{text}</span>
                    {href ? (
                      <a
                        className="business-info-action"
                        href={href}
                        rel={isExternalLink ? 'noreferrer' : undefined}
                        target={isExternalLink ? '_blank' : undefined}
                      >
                        {actionLabel || 'مشاهده'}
                        <ActionIcon />
                      </a>
                    ) : (
                      <span className="business-info-action is-disabled">
                        {actionLabel || 'مشاهده'}
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
          {tabs.map((tab) => (
            <li className={tab === 'هدایا' ? 'active' : ''} key={tab}>
              {tab}
            </li>
          ))}
        </ul>
      </nav>
      <section className="panel review-panel">
        <h2 className="section-title review-title">نظرات کاربران</h2>
        <div className="review-row d-flex align-items-start">
          <img
            className="avatar"
            src={getImageSrc(userAvatarImage)}
            alt="محمد احمدی"
          />
          <div className="text-end">
            <h3 className="review-name">محمد احمدی</h3>
            <div className="review-stars d-flex align-items-center gap-1">
              {stars.map((_, index) => (
                <Star className="star" key={index} />
              ))}
            </div>
            <p className="review-text">
              همیشه تجربه فوق‌العاده‌ای در این مجموعه داشته‌ام. کیفیت خدمات عالی و محیط بسیار دلنشینی دارد. رفتار پرسنل هم محترمانه و حرفه‌ای است.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default RestaurantPage;












