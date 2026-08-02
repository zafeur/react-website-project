import { ChevronDown, Gift, LayoutDashboard, LogOut, Moon, Sun } from 'lucide-react';
import Link from 'next/link';

const HOME_LABEL = 'صفحه اصلی';
const BRAND_LABEL = 'کی میای';
const USER_INITIAL = 'ع';
const USER_NAME = 'عباس شایگان';
const DASHBOARD_LABEL = 'پروفایل داشبورد';
const LOGOUT_LABEL = 'خروج';
const LOGIN_LABEL = 'ورود / ثبت نام';

const navItems = [
  { label: 'صفحه اصلی', href: '/' },
  { label: 'هدایا', href: '/#gifts' },
  { label: 'کسب‌وکارها', href: '/#brands' },
  { label: 'فروشگاهی', href: '/#categories' },
  { label: 'سوالات متداول', href: '/faq' },
  { label: 'باشگاه مشتریان', action: 'account' },
  { label: 'تماس با ما', href: '/#footer' },
];

function Header({ isLoggedIn, isUserMenuOpen, onToggleUserMenu, onDashboard, onLogout, onLogin, isDarkMode = false, onToggleTheme }) {
  const openAccount = () => {
    if (isLoggedIn) {
      onDashboard?.();
      return;
    }

    onLogin?.();
  };

  return (
    <header className="topbar d-flex align-items-center justify-content-between">
      <div className="d-flex align-items-center">
        <Link className="brand d-flex align-items-center" href="/" aria-label={HOME_LABEL}>
          <Gift className="brand-icon" />
          <span>{BRAND_LABEL}</span>
        </Link>
        <nav>
          <ul className="nav-list d-flex align-items-center">
            {navItems.map((item) => (
              <li key={item.label}>
                {item.action === 'account' ? (
                  <button type="button" onClick={openAccount}>{item.label}</button>
                ) : (
                  <Link href={item.href}>{item.label}</Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="home-header-actions">
        <button
          className={`home-theme-toggle ${isDarkMode ? 'is-dark' : ''}`}
          type="button"
          onClick={onToggleTheme}
          aria-label={isDarkMode ? 'Light mode' : 'Dark mode'}
          title={isDarkMode ? 'Light mode' : 'Dark mode'}
        >
          <span className="home-theme-toggle-icon home-theme-toggle-sun"><Sun /></span>
          <span className="home-theme-toggle-thumb" />
          <span className="home-theme-toggle-icon home-theme-toggle-moon"><Moon /></span>
        </button>

        {isLoggedIn ? (
          <div className="user-menu-wrap">
            <button className={`user-menu-btn ${isUserMenuOpen ? 'is-open' : ''}`} type="button" onClick={onToggleUserMenu}>
              <span className="user-mini-avatar">{USER_INITIAL}</span>
              <span>{USER_NAME}</span>
              <ChevronDown />
            </button>
            {isUserMenuOpen && (
              <div className="user-dropdown">
                <button type="button" onClick={onDashboard}>
                  <LayoutDashboard />
                  {DASHBOARD_LABEL}
                </button>
                <button type="button" onClick={onLogout}>
                  <LogOut />
                  {LOGOUT_LABEL}
                </button>
              </div>
            )}
          </div>
        ) : (
          <button className="login-btn" type="button" onClick={onLogin}>{LOGIN_LABEL}</button>
        )}
      </div>
    </header>
  );
}

export default Header;
