import Head from 'next/head';
import GiftsPage from '../src/components/GiftsPage';

export default function Gifts({ isDarkMode, onToggleTheme }) {
  return (
    <>
      <Head>
        <title>{'هدایا | کی میای'}</title>
        <meta
          name="description"
          content="مشاهده همه مجموعه‌های کی میای و هدیه‌های فعال هر مجموعه"
        />
      </Head>
      <GiftsPage isDarkMode={isDarkMode} onToggleTheme={onToggleTheme} />
    </>
  );
}
