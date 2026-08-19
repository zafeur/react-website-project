import { useEffect, useState } from 'react';
import Head from 'next/head';

import 'bootstrap/dist/css/bootstrap.min.css';
import '../src/App.css';
import '../src/components/Header.css';
import '../src/components/BusinessProfilePage.css';
import '../src/components/BusinessProfileEmptyState.css';
import '../src/components/DashboardPage.css';
import '../src/components/LoginModal.css';
import '../src/components/MobileBottomNav.css';
import '../src/components/HomePage.css';
import '../src/components/FaqMembershipPage.css';
import '../src/components/ContactPage.css';

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
  const [isDarkMode, setIsDarkMode] = useState(getSavedDarkMode);

  useEffect(() => {
    window.localStorage.setItem(
      'keymiyay-theme',
      isDarkMode ? 'dark' : 'light'
    );

    document.documentElement.classList.toggle('theme-dark', isDarkMode);
  }, [isDarkMode]);

  return (
    <>
      <Head>
        <link rel="manifest" href="/manifest.json" />
<meta name="theme-color" content="#7c3aed" />      </Head>

      <Component
        {...pageProps}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode((current) => !current)}
      />
    </>
  );
}