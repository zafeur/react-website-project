import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../src/App.css';
import '../src/components/Header.css';
import '../src/components/RestaurantPage.css';
import '../src/components/DashboardPage.css';
import '../src/components/LoginModal.css';
import '../src/components/MobileBottomNav.css';
import '../src/components/HomePage.css';
import '../src/components/PetPage.css';
import '../src/components/FaqMembershipPage.css';
import '../src/components/GlobalDarkMode.css';

const getSavedDarkMode = () => {
  if (typeof window === 'undefined') {
    return false;
  }

  return (
    window.localStorage.getItem('keymiyay-theme') === 'dark' ||
    document.documentElement.classList.contains('theme-dark')
  );
};

export default function MyApp({ Component, pageProps }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [hasHydratedTheme, setHasHydratedTheme] = useState(false);

  useEffect(() => {
    setIsDarkMode(getSavedDarkMode());
    setHasHydratedTheme(true);
  }, []);

  useEffect(() => {
    if (!hasHydratedTheme) {
      return;
    }

    window.localStorage.setItem('keymiyay-theme', isDarkMode ? 'dark' : 'light');
    document.documentElement.classList.toggle('theme-dark', isDarkMode);
  }, [hasHydratedTheme, isDarkMode]);

  return (
    <Component
      {...pageProps}
      isDarkMode={isDarkMode}
      onToggleTheme={() => setIsDarkMode((current) => !current)}
    />
  );
}