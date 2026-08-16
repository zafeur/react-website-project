import Head from 'next/head';
import HomePage from '../src/components/HomePage';

export default function Home({ isDarkMode, onToggleTheme }) {
  return (
    <>
      <Head>
        <title>{'کی میای'}</title>
        <meta
          name="description"
          content="صفحه اصلی کی میای برای مشاهده هدایا، برندها و پیشنهادهای ویژه"
        />
      </Head>
      <HomePage isDarkMode={isDarkMode} onToggleTheme={onToggleTheme} />
    </>
  );
}
