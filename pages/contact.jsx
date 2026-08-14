import Head from 'next/head';
import ContactPage from '../src/components/ContactPage';

export default function Contact({ isDarkMode, onToggleTheme }) {
  return (
    <>
      <Head>
        <title>تماس با ما | کی میای</title>
        <meta
          name="description"
          content="راه‌های ارتباطی کی میای، شماره تماس و آدرس صفحه اینستاگرام"
        />
      </Head>
      <ContactPage isDarkMode={isDarkMode} onToggleTheme={onToggleTheme} />
    </>
  );
}
