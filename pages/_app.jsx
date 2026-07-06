import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../src/App.css';
import '../src/components/Header.css';
import '../src/components/RestaurantPage.css';
import '../src/components/DashboardPage.css';
import '../src/components/LoginModal.css';
import '../src/components/MobileBottomNav.css';
import '../src/components/HomePage.css';
import '../src/components/FaqMembershipPage.css';

const getSavedDarkMode = () => {
  if (typeof window === 'undefined') {
    return false;
  }

  return window.localStorage.getItem('keymiyay-theme') === 'dark';
};

export default function MyApp({ Component, pageProps }) {
  const [isDarkMode, setIsDarkMode] = useState(getSavedDarkMode);

  useEffect(() => {
    window.localStorage.setItem('keymiyay-theme', isDarkMode ? 'dark' : 'light');
    document.documentElement.classList.toggle('theme-dark', isDarkMode);
  }, [isDarkMode]);

  return (
    <Component
      {...pageProps}
      isDarkMode={isDarkMode}
      onToggleTheme={() => setIsDarkMode((current) => !current)}
    />
  );
}
