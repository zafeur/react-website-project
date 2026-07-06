import Head from 'next/head';
import App from '../src/App';

export default function Restaurant({ isDarkMode, onToggleTheme }) {
  return (
    <>
      <Head>
        <title>{'رستوران ملل | کی میای'}</title>
      </Head>
      <App initialPage="restaurant" isDarkMode={isDarkMode} onToggleTheme={onToggleTheme} />
    </>
  );
}
