import Head from 'next/head';
import App from '../../src/App';

export default function DashboardWallet({ isDarkMode, onToggleTheme }) {
  return (
    <>
      <Head>
        <title>{'\u06a9\u06cc\u0641 \u067e\u0648\u0644 | \u06a9\u06cc \u0645\u06cc\u0627\u06cc'}</title>
      </Head>
      <App
        initialPage="dashboard"
        initialDashboardSection="wallet"
        isDarkMode={isDarkMode}
        onToggleTheme={onToggleTheme}
      />
    </>
  );
}