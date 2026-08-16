import Head from 'next/head';
import App from '../src/App';

export default function Dashboard({ isDarkMode, onToggleTheme }) {
  return (
    <>
      <Head>
        <title>{'داشبورد | کی میای'}</title>
      </Head>
      <App initialPage="dashboard" isDarkMode={isDarkMode} onToggleTheme={onToggleTheme} />
    </>
  );
}
