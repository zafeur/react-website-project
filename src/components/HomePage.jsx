import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  ChevronLeft,
  ChevronRight,
  Gift,
  Search,
  ShoppingBag,
  Sparkles,
  Star,
  Store,
  TicketPercent,
} from 'lucide-react';
import LoginModal from './LoginModal';
import { sendOtp, verifyOtp } from '../api/auth';
import { getHomePageData } from '../api/home';
import { setAuthToken } from '../helper/authCookie';

const t = {
  brand: "\u06a9\u06cc \u0645\u06cc\u0627\u06cc",
  home: "\u0635\u0641\u062d\u0647 \u0627\u0635\u0644\u06cc",
  gifts: "\u0647\u062f\u0627\u06cc\u0627",
  businesses: "\u06a9\u0633\u0628\u200c\u0648\u06a9\u0627\u0631\u0647\u0627",
  shop: "\u0641\u0631\u0648\u0634\u06af\u0627\u0647\u06cc",
  club: "\u0628\u0627\u0634\u06af\u0627\u0647 \u0645\u0634\u062a\u0631\u06cc\u0627\u0646",
  faq: "\u0633\u0648\u0627\u0644\u0627\u062a \u0645\u062a\u062f\u0627\u0648\u0644",
  contact: "\u062a\u0645\u0627\u0633 \u0628\u0627 \u0645\u0627",
  login: "\u0648\u0631\u0648\u062f / \u062b\u0628\u062a \u0646\u0627\u0645",
  restaurant: "\u0631\u0633\u062a\u0648\u0631\u0627\u0646 \u0645\u0644\u0644",
  free: "\u0631\u0627\u06cc\u06af\u0627\u0646",
  discount: "\u062a\u062e\u0641\u06cc\u0641",
  special: "\u0648\u06cc\u0698\u0647",
  bastani: "\u0628\u0633\u062a\u0646\u06cc",
  barial: "\u0628\u0631\u06cc\u0627\u0644",
  dorato: "\u062f\u0648\u0631\u0627\u062a\u0648",
  ibamo: "\u0627\u06cc\u0628\u0627\u0645\u0648",
  mojalal: "\u0645\u062c\u0644\u0627\u0644",
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

const defaultHomeData = {
  stories: [
  { title: t.bastani, image: asset('img/logo bastani.jpg') },
  { title: t.brand, image: asset('img/logo-6.b6f80db0.png') },
  { title: t.barial, image: asset('img/barial.jpg') },
  { title: t.dorato, image: asset('img/logo dorato.jpg') },
  { title: t.ibamo, image: asset('img/logo ibamo.jpg') },
  { title: t.mojalal, image: asset('img/mojalal.jpg') },
],

  banners: [
  { title: t.bastani, image: asset('img/banner/bannerweb bastani.6ff0aa72.jpg') },
  { title: t.barial, image: asset('img/banner/bannerweb barial.15abe337.jpg') },
  { title: t.bakhshi, image: asset('img/banner/bannerweb bakhshi.e2078af9 (1).jpg') },
],

  brands: [
  { title: t.restaurant, image: asset('img/logo-6.b6f80db0.png'), href: '/restaurant' },
  { title: t.barial, image: asset('img/barial.jpg'), href: '/restaurant' },
  { title: t.dorato, image: asset('img/logo dorato.jpg'), href: '/restaurant' },
  { title: t.bastani, image: asset('img/logo bastani.jpg'), href: '/restaurant' },
  { title: t.ibamo, image: asset('img/logo ibamo.jpg'), href: '/restaurant' },
  { title: t.mojalal, image: asset('img/mojalal.jpg'), href: '/restaurant' },
],

  categories: [
  { title: t.gifts, icon: 'Gift' },
  { title: t.restaurant, icon: 'Store' },
  { title: t.shop, icon: 'ShoppingBag' },
  { title: t.club, icon: 'Star' },
  { title: t.special, icon: 'Sparkles' },
],

  offers: [
  { title: t.gift1, brand: t.restaurant, tag: t.free, image: asset('img/logo-6.b6f80db0.png') },
  { title: t.gift2, brand: t.barial, tag: t.discount, image: asset('img/barial.jpg') },
  { title: t.gift3, brand: t.dorato, tag: t.special, image: asset('img/logo dorato.jpg') },
],
};

const categoryIcons = {
  Gift,
  Store,
  ShoppingBag,
  Star,
  Sparkles,
};

const normalizeList = (value, fallback) => (Array.isArray(value) && value.length ? value : fallback);

const normalizeHomeData = (data) => ({
  stories: normalizeList(data?.stories, defaultHomeData.stories),
  banners: normalizeList(data?.banners, defaultHomeData.banners),
  brands: normalizeList(data?.brands, defaultHomeData.brands),
  categories: normalizeList(data?.categories, defaultHomeData.categories),
  offers: normalizeList(data?.offers, defaultHomeData.offers),
});

function HomePage() {
  const router = useRouter();
  const [homeData, setHomeData] = useState(defaultHomeData);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [spinningStory, setSpinningStory] = useState(null);
  const [activeBanner, setActiveBanner] = useState(0);
  const [bannerDragOffset, setBannerDragOffset] = useState(0);
  const [isBannerDragging, setIsBannerDragging] = useState(false);
  const bannerTimerRef = useRef(null);
  const dragStartRef = useRef(null);
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const bannerItems = homeData.banners.length ? homeData.banners : defaultHomeData.banners;

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

      if (data.otpSent) {
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

      if (data.token) {
        setAuthToken(data.token, data.user?.type || data.userType || data.role);
      }

      setIsLoginOpen(false);
      router.push('/dashboard');
    } catch (error) {
      setLoginError(error.response?.data?.message || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="page-shell home-shell" dir="rtl">
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
          <button className="login-btn home-login-btn" type="button" onClick={openLogin}>{t.login}</button>
        </header>

        <section className="home-search-row">
          <label className="home-search-field">
            <Search aria-hidden="true" />
            <input placeholder={t.search} />
          </label>
        </section>

        <section className="home-stories" aria-label={t.selectedBrands}>
          {homeData.stories.map((story) => (
            <button
              className={`home-story ${spinningStory === story.title ? 'is-spinning' : ''}`}
              type="button"
              key={story.title}
              onClick={() => spinStory(story.title)}
            >
              <span className="home-story-ring">
                <img src={story.image} alt={story.title} />
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
                {bannerItems.map((banner) => (
                  <div className="home-banner-slide" key={banner.title}>
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
                  key={banner.title}
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
              <article className="home-brand-card" key={brand.title}>
                <img src={brand.image} alt={brand.title} />
                <strong>{brand.title}</strong>
              </article>
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
            {homeData.categories.map(({ title, icon }) => {
              const Icon = categoryIcons[icon] || Gift;

              return (
                <article className="home-category-card" key={title}>
                  <Icon />
                  <span>{title}</span>
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
            {homeData.offers.map((offer) => (
              <article className="home-offer-card" key={offer.title}>
                <img src={offer.image} alt={offer.brand} />
                <div className="home-offer-copy">
                  <span>{offer.brand}</span>
                  <h3>{offer.title}</h3>
                </div>
                <div className="home-offer-footer">
                  <span><TicketPercent /> {offer.tag}</span>
                  <button type="button">{t.receive}</button>
                </div>
              </article>
            ))}
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

      {isLoginOpen && (
        <LoginModal
          loginError={loginError}
          isLoading={isLoading}
          onClose={closeLogin}
          onSendOtp={handleSendOtp}
          onVerifyOtp={handleVerifyOtp}
        />
      )}
    </main>
  );
}

export default HomePage;