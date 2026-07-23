import Head from 'next/head';
import { useRouter } from 'next/router';
import App from '../../src/App';
import { businessProfiles } from '../../src/data/siteData';

const DEFAULT_TITLE = '\u067e\u0631\u0648\u0641\u0627\u06cc\u0644 \u0645\u062c\u0645\u0648\u0639\u0647';
const SITE_TITLE = '\u06a9\u06cc \u0645\u06cc\u0627\u06cc';

const getBusinessValue = (business) => (Array.isArray(business) ? business[0] : business);

const findBusinessTitle = (business) => {
  const normalized = String(getBusinessValue(business) || '').toLowerCase();
  const profile = businessProfiles.find((item) => {
    const aliases = Array.isArray(item.aliases) ? item.aliases : [];
    const haystack = `${item.id || ''} ${item.slug || ''} ${item.title || ''} ${item.shortTitle || ''} ${aliases.join(' ')}`.toLowerCase();
    return haystack.includes(normalized) || normalized.includes(String(item.id || '').toLowerCase());
  });

  return profile?.title || DEFAULT_TITLE;
};

export default function BusinessProfile({ isDarkMode, onToggleTheme }) {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>{`${findBusinessTitle(router.query.business)} | ${SITE_TITLE}`}</title>
      </Head>
      <App initialPage="restaurant" isDarkMode={isDarkMode} onToggleTheme={onToggleTheme} />
    </>
  );
}