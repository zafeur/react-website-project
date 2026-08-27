import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  PhoneCall,
  Sun,
  Moon,
  MessageCircle,
  MapPin,
} from 'lucide-react';

import MobileBottomNav from './MobileBottomNav';
import { sendOtp, verifyOtp } from '../api/auth';
import { brandAssets, defaultProfileAvatar } from '../data/brandAssets';
import { clearAuthToken, getTokenFromAuthResponse, getUserTypeFromAuthResponse, hasAuthToken, setAuthToken } from '../helper/authCookie';
import { AUTH_SESSION_EXPIRED_EVENT, resetAuthSessionExpiryNotice } from '../helper/authSession';
import { normalizeMediaUrl } from '../helper/mediaUrl';
import LoginModal from './LoginModal';

const InstagramGlyph = () => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    focusable="false"
  >
    <rect
      x="3.5"
      y="3.5"
      width="17"
      height="17"
      rx="5"
    />
    <circle
      cx="12"
      cy="12"
      r="4"
    />
    <circle
      cx="17.2"
      cy="6.8"
      r="1"
    />
  </svg>
);

const nav = {
  brand: 'کی میای',
  home: 'صفحه اصلی',
  gifts: 'هدایا',
  shop: 'فروشگاهی',
  faq: 'سوالات متداول',
  club: 'باشگاه مشتریان',
  contact: 'تماس با ما',
  login: 'ورود / ثبت نام',
  dashboard: 'پروفایل داشبورد',
  logout: 'خروج',
  defaultUser: 'کاربر کی میای',
};

const PROFILE_STORAGE_KEY = 'keymiyay-user-profile';

const firstValue = (source, keys) => {
  for (const key of keys) {
    const value = source?.[key];
    if (value !== undefined && value !== null && value !== '') return value;
  }

  return '';
};

const getProfileName = (profile) => {
  const firstName = firstValue(profile, ['firstName', 'first_name', 'name']);
  const lastName = firstValue(profile, ['lastName', 'last_name', 'family', 'family_name']);
  const fullName = firstValue(profile, ['fullName', 'full_name', 'display_name', 'displayName', 'username']);
  return [firstName, lastName].filter(Boolean).join(' ') || fullName || nav.defaultUser;
};

const getProfileAvatar = (profile) => normalizeMediaUrl(firstValue(profile, [
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

function ContactPage({
  isDarkMode = false,
  onToggleTheme,
}) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const userName = getProfileName(userProfile);
  const userAvatar = getProfileAvatar(userProfile) || defaultProfileAvatar;

  useEffect(() => {
    const loggedIn = hasAuthToken();
    setIsLoggedIn(loggedIn);

    if (!loggedIn || typeof window === 'undefined') return;

    try {
      const savedProfile = window.localStorage.getItem(PROFILE_STORAGE_KEY);
      if (savedProfile) setUserProfile(JSON.parse(savedProfile));
    } catch {
      window.localStorage.removeItem(PROFILE_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    const handleSessionExpired = () => {
      setIsLoggedIn(false);
      setIsUserMenuOpen(false);
      setUserProfile(null);
    };

    window.addEventListener(AUTH_SESSION_EXPIRED_EVENT, handleSessionExpired);

    return () => {
      window.removeEventListener(AUTH_SESSION_EXPIRED_EVENT, handleSessionExpired);
    };
  }, []);

  const handleMobileNav = (id) => {
    if (id === 'home') {
      window.location.href = '/';
      return;
    }

    if (id === 'shop') {
      window.location.href = '/#brands';
      return;
    }

    if (id === 'faq') {
      window.location.href = '/faq';
      return;
    }

    if (id === 'gifts') {
      window.location.href = '/gifts';
      return;
    }

    window.location.href = '/dashboard';
  };

  const openLogin = () => {
    setLoginError('');
    setIsLoginOpen(true);
  };

  const closeLogin = () => {
    setLoginError('');
    setIsLoginOpen(false);
  };

  const handleSendOtp = async (mobile) => {
    try {
      setIsAuthLoading(true);
      setLoginError('');
      const data = await sendOtp(mobile);

      if (data.status === 'otp_sent') return true;

      setLoginError('ارسال کد انجام نشد.');
      return false;
    } catch {
      setLoginError('خطایی رخ داده است. لطفاً دوباره تلاش کنید.');
      return false;
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleVerifyOtp = async (mobile, otp) => {
    try {
      setIsAuthLoading(true);
      setLoginError('');
      const data = await verifyOtp({ mobile, otp });
      const token = getTokenFromAuthResponse(data);
      const tokenSaved = setAuthToken(token, getUserTypeFromAuthResponse(data));

      if (!tokenSaved) {
        setLoginError('توکن ورود در کوکی ذخیره نشد.');
        return;
      }

      resetAuthSessionExpiryNotice();
      setIsLoggedIn(true);
      setIsLoginOpen(false);
      window.location.href = '/dashboard';
    } catch (error) {
      setLoginError(error?.response?.data?.message || 'ورود انجام نشد. لطفاً دوباره تلاش کنید.');
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleLogout = () => {
    clearAuthToken();
    setIsLoggedIn(false);
    setIsUserMenuOpen(false);
    setUserProfile(null);

    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(PROFILE_STORAGE_KEY);
      window.location.href = '/';
    }
  };

  return (
    <main
      className={`page-shell contact-shell ${
        isDarkMode ? 'theme-dark' : ''
      }`}
      dir="rtl"
    >
      <section className="frame contact-frame">

        {/* ================= HEADER ================= */}

        <header className="topbar d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center">

            <Link
              className="brand d-flex align-items-center"
              href="/"
              aria-label={nav.home}
            >
              <img
                className="brand-logo-type"
                src={brandAssets.logoType}
                alt={nav.brand}
              />
            </Link>

            <nav>
              <ul className="nav-list d-flex align-items-center">

                <li>
                  <Link href="/">
                    {nav.home}
                  </Link>
                </li>

                <li>
                  <Link href="/gifts">
                    {nav.gifts}
                  </Link>
                </li>

                <li>
                  <Link href="/#brands">
                    {nav.shop}
                  </Link>
                </li>

                <li>
                  <Link href="/faq">
                    {nav.faq}
                  </Link>
                </li>

                <li>
                  <Link href="/dashboard">
                    {nav.club}
                  </Link>
                </li>

                <li>
                  <Link
                    href="/contact"
                    className="active-link"
                  >
                    {nav.contact}
                  </Link>
                </li>

              </ul>
            </nav>
          </div>

          <div className="home-header-actions">

            <button
              className={`home-theme-toggle ${
                isDarkMode ? 'is-dark' : ''
              }`}
              type="button"
              onClick={onToggleTheme}
              aria-label={
                isDarkMode
                  ? 'حالت روشن'
                  : 'حالت تاریک'
              }
              title={
                isDarkMode
                  ? 'حالت روشن'
                  : 'حالت تاریک'
              }
            >
              <span className="home-theme-toggle-icon home-theme-toggle-sun">
                <Sun />
              </span>

              <span className="home-theme-toggle-thumb" />

              <span className="home-theme-toggle-icon home-theme-toggle-moon">
                <Moon />
              </span>
            </button>

            {isLoggedIn ? (
              <div className="user-menu-wrap">
                <button
                  className={`user-menu-btn ${isUserMenuOpen ? 'is-open' : ''}`}
                  type="button"
                  onClick={() => setIsUserMenuOpen((current) => !current)}
                >
                  <span className="user-mini-avatar">
                    <img src={userAvatar} alt={userName} />
                  </span>
                  <span className="user-menu-name" dir="rtl">
                    {userName}
                  </span>
                  <ChevronDown />
                </button>

                {isUserMenuOpen && (
                  <div className="user-dropdown">
                    <button
                      type="button"
                      onClick={() => {
                        window.location.href = '/dashboard';
                      }}
                    >
                      <LayoutDashboard />
                      {nav.dashboard}
                    </button>
                    <button type="button" onClick={handleLogout}>
                      <LogOut />
                      {nav.logout}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button className="login-btn" type="button" onClick={openLogin}>
                {nav.login}
              </button>
            )}

          </div>
        </header>


        {/* ================= CONTACT HERO ================= */}

        <section
          className="contact-hero"
          aria-label="ارتباط با کی‌میای"
        >

          <div className="contact-hero-copy">

            <span>
              ارتباط با کی‌میای
            </span>

            <p>
              برای پیگیری هدایا، همکاری کسب‌وکارها،
              معرفی مجموعه یا سوال درباره خدمات کی‌میای،
              از طریق شماره تماس یا صفحه اینستاگرام
              با ما در ارتباط باشید.
            </p>

          </div>

          <div
            className="contact-hero-mark"
            aria-hidden="true"
          >
            <MessageCircle />
          </div>

        </section>


        {/* ================= CONTACT CARDS ================= */}

        <section
          className="contact-card-grid"
          aria-label="راه‌های ارتباطی"
        >

          {/* PHONE */}

          <a
            className="contact-card contact-card-primary"
            href="tel:09059399545"
          >
            <span className="contact-card-icon">
              <PhoneCall />
            </span>

            <span>
              شماره تماس
            </span>

            <strong dir="ltr">
              09059399545
            </strong>
          </a>


          {/* INSTAGRAM */}

          <a
            className="contact-card"
            href="https://www.instagram.com/keymiay.app/"
            target="_blank"
            rel="noreferrer"
          >
            <span className="contact-card-icon">
              <InstagramGlyph />
            </span>

            <span>
              آدرس پیج
            </span>

            <strong dir="ltr">
              keymiay.app
            </strong>
          </a>


          {/* LOCATION */}

          <div className="contact-card">

            <span className="contact-card-icon">
              <MapPin />
            </span>

            <span>
              شروع فعالیت
            </span>

            <strong>
              گرگان
            </strong>

          </div>

        </section>

      </section>


      {/* ================= MOBILE NAV ================= */}

      <MobileBottomNav
        currentPage="contact"
        isLoggedIn={isLoggedIn}
        onNavigate={handleMobileNav}
      />

      {isLoginOpen && (
        <LoginModal
          loginError={loginError}
          isLoading={isAuthLoading}
          onClose={closeLogin}
          onSendOtp={handleSendOtp}
          onVerifyOtp={handleVerifyOtp}
        />
      )}

    </main>
  );
}

export default ContactPage;
