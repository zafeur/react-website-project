import Head from 'next/head';
import { useRouter } from 'next/router';
import App from '../../src/App';

const DEFAULT_TITLE = '\u067e\u0631\u0648\u0641\u0627\u06cc\u0644 \u0645\u062c\u0645\u0648\u0639\u0647';
const SITE_TITLE = '\u06a9\u06cc \u0645\u06cc\u0627\u06cc';

const getCollectionValue = (collection) => (Array.isArray(collection) ? collection[0] : collection);

export default function CollectionProfile({ isDarkMode, onToggleTheme }) {
  const router = useRouter();
  const collection = getCollectionValue(router.query.collection);

  return (
    <>
      <Head>
        <title>{`${DEFAULT_TITLE}${collection ? ` ${collection}` : ''} | ${SITE_TITLE}`}</title>
      </Head>
      <App initialPage="business" isDarkMode={isDarkMode} onToggleTheme={onToggleTheme} />
    </>
  );
}