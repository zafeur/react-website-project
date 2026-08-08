import { ChevronDown, Gift, LayoutDashboard, LogOut, Moon, Sun } from 'lucide-react';
import Link from 'next/link';

const HOME_LABEL = '\u0635\u0641\u062d\u0647 \u0627\u0635\u0644\u06cc';
const BRAND_LABEL = '\u06a9\u06cc \u0645\u06cc\u0627\u06cc';
const DASHBOARD_LABEL = '\u067e\u0631\u0648\u0641\u0627\u06cc\u0644 \u062f\u0627\u0634\u0628\u0648\u0631\u062f';
const LOGOUT_LABEL = '\u062e\u0631\u0648\u062c';
const LOGIN_LABEL = '\u0648\u0631\u0648\u062f / \u062b\u0628\u062a \u0646\u0627\u0645';
const DEFAULT_USER_NAME = '\u06a9\u0627\u0631\u0628\u0631 \u06a9\u06cc \u0645\u06cc\u0627\u06cc';

const navItems = [
  { label: '\u0635\u0641\u062d\u0647 \u0627\u0635\u0644\u06cc', href: '/' },
  { label: '\u0647\u062f\u0627\u06cc\u0627', href: '/#gifts' },
  { label: '\u06a9\u0633\u0628\u200c\u0648\u06a9\u0627\u0631\u0647\u0627', href: '/#brands' },
  { label: '\u0641\u0631\u0648\u0634\u06af\u0627\u0647\u06cc', href: '/#categories' },
  { label: '\u0633\u0648\u0627\u0644\u0627\u062a \u0645\u062a\u062f\u0627\u0648\u0644', href: '/faq' },
  { label: '\u0628\u0627\u0634\u06af\u0627\u0647 \u0645\u0634\u062a\u0631\u06cc\u0627\u0646', action: 'account' },
  { label: '\u062a\u0645\u0627\u0633 \u0628\u0627 \u0645\u0627', href: '/#footer' },
];

const firstValue = (source, keys) => {
  for (const key of keys) {
    const value = source?.[key];
    if (value !== undefined && value !== null && value !== '') {
      return value;
    }
  }

  return '';
};

const getProfileName = (profile) => {
  const firstName = firstValue(profile, ['firstName', 'first_name', 'name']);
  const lastName = firstValue(profile, ['lastName', 'last_name', 'family', 'family_name']);
  const fullName = firstValue(profile, ['fullName', 'full_name', 'display_name', 'displayName', 'username']);
  return fullName || [firstName, lastName].filter(Boolean).join(' ') || DEFAULT_USER_NAME;
};

const getProfileInitial = (name) => [...String(name || DEFAULT_USER_NAME).trim()][0] || '\u06a9';
const normalizeMediaUrl = (value = '') => {
  const text = String(value || '').trim().replace(/^\"|\"$/g, '');
  if (!text || text === '[]') return '';
  if (/^(https?:|data:|blob:|\/)/.test(text)) return text;
  return 'https://api.keymiay.com/images/' + encodeURIComponent(text).replace(/%2F/g, '/');
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

function Header({ isLoggedIn, isUserMenuOpen, onToggleUserMenu, onDashboard, onLogout, onLogin, isDarkMode = false, onToggleTheme, userProfile }) {
  const userName = getProfileName(userProfile);
  const userInitial = getProfileInitial(userName);
  const userAvatar = getProfileAvatar(userProfile);

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
          className={`home-theme-toggle \${isDarkMode ? 'is-dark' : ''}`}
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
            <button className={`user-menu-btn \${isUserMenuOpen ? 'is-open' : ''}`} type="button" onClick={onToggleUserMenu}>
              <span className="user-mini-avatar">{userAvatar ? <img src={userAvatar} alt={userName} /> : userInitial}</span>
              <span>{userName}</span>
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
