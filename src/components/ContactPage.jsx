import Link from 'next/link';
import { PhoneCall, Sun, Moon, MessageCircle, MapPin } from 'lucide-react';
import MobileBottomNav from './MobileBottomNav';
import { brandAssets } from '../data/brandAssets';

const InstagramGlyph = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.2" cy="6.8" r="1" />
  </svg>
);

const nav = {
  brand: 'کی میای',
  home: 'صفحه اصلی',
  gifts: 'هدایا',
  businesses: 'کسب‌وکارها',
  shop: 'فروشگاهی',
  faq: 'سوالات متداول',
  club: 'باشگاه مشتریان',
  contact: 'تماس با ما',
};

function ContactPage({ isDarkMode = false, onToggleTheme }) {
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
      window.location.href = '/#gifts';
      return;
    }

    window.location.href = '/dashboard';
  };

  return (
    <main className={`page-shell contact-shell ${isDarkMode ? 'theme-dark' : ''}`} dir="rtl">
      <section className="frame contact-frame">
        <header className="topbar d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            <Link className="brand d-flex align-items-center" href="/" aria-label={nav.home}>
              <img className="brand-logo-mark" src={brandAssets.logoMark} alt="" aria-hidden="true" />
              <img className="brand-logo-type" src={brandAssets.logoType} alt={nav.brand} />
            </Link>
            <nav>
              <ul className="nav-list d-flex align-items-center">
                <li><Link href="/">{nav.home}</Link></li>
                <li><Link href="/#gifts">{nav.gifts}</Link></li>
                <li><Link href="/#brands">{nav.businesses}</Link></li>
                <li><Link href="/#brands">{nav.shop}</Link></li>
                <li><Link href="/faq">{nav.faq}</Link></li>
                <li><Link href="/dashboard">{nav.club}</Link></li>
                <li><Link href="/contact" className="active-link">{nav.contact}</Link></li>
              </ul>
            </nav>
          </div>
          <div className="home-header-actions">
            <button
              className={`home-theme-toggle ${isDarkMode ? 'is-dark' : ''}`}
              type="button"
              onClick={onToggleTheme}
              aria-label={isDarkMode ? 'حالت روشن' : 'حالت تاریک'}
              title={isDarkMode ? 'حالت روشن' : 'حالت تاریک'}
            >
              <span className="home-theme-toggle-icon home-theme-toggle-sun"><Sun /></span>
              <span className="home-theme-toggle-thumb" />
              <span className="home-theme-toggle-icon home-theme-toggle-moon"><Moon /></span>
            </button>
          </div>
        </header>

        <section className="contact-hero" aria-labelledby="contact-title">
          <div className="contact-hero-copy">
            <span>ارتباط با کی‌میای</span>
            <h1 id="contact-title">تماس با ما</h1>
            <p>
              برای پیگیری هدایا، همکاری کسب‌وکارها، معرفی مجموعه یا سوال درباره خدمات کی‌میای،
              از طریق شماره تماس یا صفحه اینستاگرام با ما در ارتباط باشید.
            </p>
          </div>
          <div className="contact-hero-mark" aria-hidden="true">
            <MessageCircle />
          </div>
        </section>

        <section className="contact-card-grid" aria-label="راه‌های ارتباطی">
          <a className="contact-card contact-card-primary" href="tel:09059399545">
            <span className="contact-card-icon"><PhoneCall /></span>
            <span>شماره تماس</span>
            <strong dir="ltr">09059399545</strong>
          </a>

          <a className="contact-card" href="https://www.instagram.com/keymiay.app/" target="_blank" rel="noreferrer">
            <span className="contact-card-icon"><InstagramGlyph /></span>
            <span>آدرس پیج</span>
            <strong dir="ltr">keymiay.app</strong>
          </a>

          <div className="contact-card">
            <span className="contact-card-icon"><MapPin /></span>
            <span>شروع فعالیت</span>
            <strong>گرگان</strong>
          </div>
        </section>
      </section>

      <MobileBottomNav currentPage="contact" isLoggedIn={false} onNavigate={handleMobileNav} />
    </main>
  );
}

export default ContactPage;
