import Head from 'next/head';
import App from '../src/App';

const PAGE_TITLE = '\u0631\u0633\u062a\u0648\u0631\u0627\u0646 \u0645\u0644\u0644 | \u06a9\u06cc \u0645\u06cc\u0627\u06cc';

export default function Restaurant({ isDarkMode, onToggleTheme }) {
  return (
    <>
      <Head>
        <title>{PAGE_TITLE}</title>
      </Head>
      <App initialPage="restaurant" isDarkMode={isDarkMode} onToggleTheme={onToggleTheme} />
    </>
  );
}