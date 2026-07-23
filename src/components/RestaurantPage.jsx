import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { ChevronLeft, Star, Wallet } from 'lucide-react';
import restaurantInteriorImage from '../assets/images/restaurant-interior.jpg';
import userAvatarImage from '../assets/images/user-avatar.jpg';
import { getBusinessWallet, getMockWallet } from '../api/wallet';
import { businessProfiles, galleryImages, gifts, infoCards, stars, tabs } from '../data/siteData';

const getImageSrc = (image) => image?.src || image;
const DEFAULT_BUSINESS_ID = 'melal';

const normalizeKey = (value = '') => String(value).trim().toLowerCase();

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

  return (
    <div className={isVisible ? 'business-profile-page' : 'business-profile-page d-none'} id="restaurant-top">
      <section className="hero-grid">
        <div>
          <img
            className="hero-photo"
            src={getImageSrc(restaurantInteriorImage)}
            alt={`پروفایل ${businessProfile.title}`}
          />

          <div className="info-row">
            {infoCards.map(({ icon: Icon, title, text }) => (
              <div className="info-card d-flex align-items-center justify-content-between" key={text}>
                <Icon />
                <div className="text-end">
                  {title && <span className="info-title">{title}</span>}
                  <span className="info-text">{text}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="profile">
          <div className="logo-circle">
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
          <div className="rating d-flex align-items-center justify-content-center">
            <span>{businessProfile.rating || '۴.۸'}</span>
            <span>|</span>
            <span className="d-flex align-items-center gap-1">
              {stars.map((_, index) => (
                <Star className="star" key={index} />
              ))}
            </span>
            <span>{businessProfile.votes || '۲۳۴ رای'}</span>
          </div>
          <div className="meta d-flex align-items-center justify-content-center">
            <span>{businessProfile.category || 'مجموعه'}</span>
            <span className="dot" />
            <span>{businessProfile.specialty || 'خدمات'}</span>
          </div>
          <button className="follow-btn">دنبال کردن</button>

          <section className="business-wallet-card">
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
        </aside>
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



