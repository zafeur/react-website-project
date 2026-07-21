import { mobileBottomNav } from '../data/siteData';

function MobileBottomNav({ currentPage, isLoggedIn, onNavigate }) {
  return (
    <nav className="mobile-bottom-nav" aria-label="ناوبری موبایل">
      {mobileBottomNav.map(({ id, title, icon: Icon }) => {
        const isActive =
          id === currentPage ||
          (id === 'account' && currentPage === 'dashboard') ||
          (id === 'shop' && currentPage === 'restaurant');

        return (
          <button className={isActive ? 'active' : ''} type="button" key={id} onClick={() => onNavigate(id)}>
            <Icon />
            <span>{id === 'account' && !isLoggedIn ? 'ورود' : title}</span>
          </button>
        );
      })}
    </nav>
  );
}

export default MobileBottomNav;

