import { ChevronDown, Gift, LayoutDashboard, LogOut } from 'lucide-react';
import Link from 'next/link';
import { dashboardNavLinks, navLinks } from '../data/siteData';

const HOME_LABEL = "صفحه اصلی";

function Header({ currentPage, isLoggedIn, isUserMenuOpen, onToggleUserMenu, onDashboard, onLogout, onLogin }) {
  const links = currentPage === 'dashboard' ? dashboardNavLinks : navLinks;

  return (
    <header className="topbar d-flex align-items-center justify-content-between">
      <div className="d-flex align-items-center">
        <Link className="brand d-flex align-items-center" href="/" aria-label={HOME_LABEL}>
          <Gift className="brand-icon" />
          <span>کی میای</span>
        </Link>
        <nav>
          <ul className="nav-list d-flex align-items-center">
            {links.map((link) => (
              <li key={link}>
                {link === HOME_LABEL ? <Link href="/">{link}</Link> : link}
              </li>
            ))}
            <li><Link href="/faq">{"\u0633\u0648\u0627\u0644\u0627\u062a \u0645\u062a\u062f\u0627\u0648\u0644"}</Link></li>
          </ul>
        </nav>
      </div>

      {isLoggedIn ? (
        <div className="user-menu-wrap">
          <button className={`user-menu-btn ${isUserMenuOpen ? 'is-open' : ''}`} type="button" onClick={onToggleUserMenu}>
            <span className="user-mini-avatar">ع</span>
            <span>عباس شایگان</span>
            <ChevronDown />
          </button>
          {isUserMenuOpen && (
            <div className="user-dropdown">
              <button type="button" onClick={onDashboard}>
                <LayoutDashboard />
                پروفایل داشبورد
              </button>
              <button type="button" onClick={onLogout}>
                <LogOut />
                خروج
              </button>
            </div>
          )}
        </div>
      ) : (
        <button className="login-btn" type="button" onClick={onLogin}>ورود / ثبت نام</button>
      )}
    </header>
  );
}

export default Header;
