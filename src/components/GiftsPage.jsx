import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Gift, Search, Sparkles, Store } from 'lucide-react';
import { getAllGifts } from '../api/gifts';
import { toPersianDigits } from '../helper/persianDigits';
import { clearAuthToken, hasAuthToken } from '../helper/authCookie';
import { AUTH_SESSION_EXPIRED_EVENT } from '../helper/authSession';
import Header from './Header';
import MobileBottomNav from './MobileBottomNav';

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.VITE_API_BASE_URL || '';
const PROFILE_STORAGE_KEY = 'keymiyay-user-profile';

const isPrimitiveValue = (value) => ['string', 'number', 'boolean'].includes(typeof value);

const firstValue = (source, keys) => {
  if (!source || typeof source !== 'object') return '';

  for (const key of keys) {
    const value = source[key];
    if (value !== undefined && value !== null && value !== '') {
      return value;
    }
  }

  return '';
};

const firstArray = (...values) => {
  for (const value of values) {
    if (Array.isArray(value)) return value;
  }

  return [];
};

const cleanText = (value = '') => String(value)
  .replace(/\r?\n/g, ' ')
  .replace(/\\+"/g, '')
  .replace(/["'`“”]+/g, '')
  .replace(/:\s*"?\[\]"?/g, '')
  .replace(/"?\[\]"?/g, '')
  .replace(/^[:\s"']+|[:\s"']+$/g, '')
  .replace(/\s+/g, ' ')
  .trim();

const normalizeComparable = (value = '') => cleanText(value).toLowerCase().replace(/[\s\u200c_-]+/g, '');

const normalizeMediaUrl = (value = '') => {
  const raw = Array.isArray(value) ? value[0] : value;
  const text = String(raw || '').trim().replace(/^\"|\"$/g, '');
  if (!text || text === '[]') return '';
  if (/^(https?:|data:|blob:)/.test(text)) return text;
  if (text.startsWith('/')) return text;

  if (apiBaseUrl) {
    try {
      return new URL(text, apiBaseUrl).toString();
    } catch {
      return `/${text}`;
    }
  }

  return 'https://api.keymiay.com/images/' + encodeURIComponent(text).replace(/%2F/g, '/');
};

const parseMaybeJson = (value) => {
  if (Array.isArray(value)) return value;
  if (!value || typeof value !== 'string') return [];

  let current = value.trim();

  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      const parsed = JSON.parse(current);
      if (Array.isArray(parsed)) return parsed;
      if (parsed && typeof parsed === 'object') return [parsed];
      if (typeof parsed === 'string' && parsed !== current) {
        current = parsed.trim();
        continue;
      }
    } catch {
      return [];
    }
  }

  return [];
};

const getGiftTitleFromDescription = (description = '') => {
  const text = cleanText(description);
  if (!text) return '';

  return text
    .replace(/^با خرید از مجموعه های دیگر از ما\s*/u, '')
    .replace(/\s*هدیه بگیرید.*$/u, '')
    .replace(/\s*(?:۰|0)?9[\d۰-۹\s-]{8,}.*$/u, '')
    .trim();
};

const getPayloadCollections = (payload) => {
  const data = payload?.data || payload;

  return firstArray(
    data,
    data?.data,
    data?.gifts,
    data?.collections,
    data?.businesses,
    data?.items,
    data?.result,
    payload?.gifts,
    payload?.collections,
    payload?.businesses,
    payload?.items,
    payload?.result
  );
};

const getCollectionGifts = (collection) => {
  const directGifts = firstArray(
    collection?.active_gifts,
    collection?.activeGifts,
    collection?.gift_items,
    collection?.giftItems,
    collection?.items,
    collection?.children
  );
  const parsedGifts = parseMaybeJson(collection?.gifts);
  const gifts = directGifts.length ? directGifts : parsedGifts;

  if (gifts.length) {
    return gifts.map((gift, index) => {
      if (isPrimitiveValue(gift)) {
        return {
          id: `${collection?.id || collection?.name || 'gift'}-${index}`,
          title: cleanText(gift),
          description: '',
        };
      }

      const title = cleanText(firstValue(gift, ['title', 'name', 'gift_name', 'giftName', 'gift_title', 'giftTitle', 'label']));
      const description = cleanText(firstValue(gift, ['description', 'gift_description', 'giftDescription', 'text', 'body']));

      return {
        id: firstValue(gift, ['id', 'gift_id', 'giftId']) || `${collection?.id || collection?.name || 'gift'}-${index}`,
        title: title || getGiftTitleFromDescription(description) || description || 'هدیه فعال',
        description,
      };
    }).filter((gift) => gift.title);
  }

  const descriptionGift = getGiftTitleFromDescription(collection?.description);

  return descriptionGift ? [{
    id: `${collection?.id || collection?.name || 'collection'}-description`,
    title: descriptionGift,
    description: cleanText(collection?.description),
  }] : [];
};

const normalizeCollection = (collection, index) => {
  if (isPrimitiveValue(collection)) {
    const title = cleanText(collection);
    return {
      id: `${title}-${index}`,
      title,
      description: '',
      image: '',
      href: '',
      isActive: true,
      gifts: [{ id: `${title}-${index}-gift`, title, description: '' }],
    };
  }

  const title = cleanText(firstValue(collection, ['name', 'title', 'collection_name', 'collectionName', 'business_name', 'businessName', 'brand_name', 'brandName']));
  const id = firstValue(collection, ['id', 'collection_id', 'collectionId', 'business_id', 'businessId', 'prefix', 'slug']) || `${title}-${index}`;
  const image = normalizeMediaUrl(firstValue(collection, ['images', 'image', 'logo', 'logo_url', 'profile_image', 'profileImage', 'banner_image', 'bannerImage']));
  const isActiveGift = firstValue(collection, ['gift_active', 'giftActive', 'active_gift', 'activeGift']);

  return {
    id,
    title: title || 'مجموعه کی میای',
    description: cleanText(firstValue(collection, ['description', 'about', 'bio'])),
    image,
    href: id ? `/collections/${id}` : '',
    isActive: isActiveGift === '' ? true : isActiveGift === true || isActiveGift === 1 || isActiveGift === '1',
    gifts: getCollectionGifts(collection),
  };
};

const normalizeGiftCatalog = (payload) => getPayloadCollections(payload)
  .map(normalizeCollection)
  .filter((collection) => collection.gifts.length);

function GiftsPage({ isDarkMode = false, onToggleTheme }) {
  const [collections, setCollections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const loggedIn = hasAuthToken();
    setIsLoggedIn(loggedIn);

    if (!loggedIn || typeof window === 'undefined') return;

    try {
      const savedProfile = window.localStorage.getItem(PROFILE_STORAGE_KEY);
      if (savedProfile) {
        setUserProfile(JSON.parse(savedProfile));
      }
    } catch {
      window.localStorage.removeItem(PROFILE_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    const handleSessionExpired = () => {
      setIsLoggedIn(false);
      setIsUserMenuOpen(false);
      setUserProfile(null);
    };

    window.addEventListener(AUTH_SESSION_EXPIRED_EVENT, handleSessionExpired);

    return () => {
      window.removeEventListener(AUTH_SESSION_EXPIRED_EVENT, handleSessionExpired);
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadGifts = async () => {
      try {
        setIsLoading(true);
        setError('');
        const data = await getAllGifts();
        if (isMounted) {
          setCollections(normalizeGiftCatalog(data));
        }
      } catch {
        if (isMounted) {
          setCollections([]);
          setError('دریافت لیست هدایا انجام نشد.');
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadGifts();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredCollections = useMemo(() => {
    const normalizedQuery = normalizeComparable(query);
    if (!normalizedQuery) return collections;

    return collections.filter((collection) => {
      const collectionText = normalizeComparable(`${collection.title} ${collection.description}`);
      const giftsText = normalizeComparable(collection.gifts.map((gift) => `${gift.title} ${gift.description}`).join(' '));
      return collectionText.includes(normalizedQuery) || giftsText.includes(normalizedQuery);
    });
  }, [collections, query]);

  const giftCount = collections.reduce((total, collection) => total + collection.gifts.length, 0);

  const handleMobileNav = (id) => {
    if (id === 'home') {
      window.location.href = '/';
      return;
    }

    if (id === 'shop') {
      window.location.href = '/#brands';
      return;
    }

    if (id === 'faq') {
      window.location.href = '/faq';
      return;
    }

    if (id === 'account') {
      window.location.href = '/dashboard';
    }
  };

  const goDashboard = () => {
    window.location.href = '/dashboard';
  };

  const handleLogout = () => {
    clearAuthToken();
    setIsLoggedIn(false);
    setIsUserMenuOpen(false);
    setUserProfile(null);

    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(PROFILE_STORAGE_KEY);
      window.location.href = '/';
    }
  };

  return (
    <main className={`page-shell gifts-shell ${isDarkMode ? 'theme-dark' : ''}`} dir="rtl">
      <section className="frame gifts-frame">
        <Header
          isLoggedIn={isLoggedIn}
          isUserMenuOpen={isUserMenuOpen}
          isDarkMode={isDarkMode}
          onToggleTheme={onToggleTheme}
          onToggleUserMenu={() => setIsUserMenuOpen((current) => !current)}
          onDashboard={goDashboard}
          onLogout={handleLogout}
          onLogin={goDashboard}
          userProfile={userProfile}
        />

        <section className="gifts-catalog-head">
          <Link className="gifts-back-link" href="/">
            <ArrowRight />
            بازگشت
          </Link>
          <div className="gifts-title-block">
            <span>هدیه‌های مجموعه‌ها</span>
            <h1>همه هدیه‌های کی میای</h1>
            <p>مجموعه‌ها را ببینید و هدیه‌هایی که برای خرید از کسب‌وکارهای عضو کی میای فعال هستند را بررسی کنید.</p>
          </div>
          <div className="gifts-search-card">
            <div className="gifts-search-field">
              <Search />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="جستجوی مجموعه یا هدیه"
              />
            </div>
            <div className="gifts-stats">
              <span><Store /> {toPersianDigits(collections.length)} مجموعه</span>
              <span><Gift /> {toPersianDigits(giftCount)} هدیه</span>
            </div>
          </div>
        </section>

        {isLoading ? (
          <section className="gifts-state">
            <Sparkles />
            <h2>در حال دریافت هدیه‌ها</h2>
            <p>لطفاً چند لحظه صبر کنید.</p>
          </section>
        ) : error ? (
          <section className="gifts-state">
            <Gift />
            <h2>{error}</h2>
            <p>بعداً دوباره امتحان کنید.</p>
          </section>
        ) : filteredCollections.length ? (
          <section className="gifts-catalog-grid" aria-label="لیست هدایا">
            {filteredCollections.map((collection) => (
              <article className="gift-business-card" key={collection.id}>
                <div className="gift-business-media">
                  {collection.image ? (
                    <img src={collection.image} alt={collection.title} />
                  ) : (
                    <span><Store /></span>
                  )}
                </div>
                <div className="gift-business-body">
                  <div className="gift-business-head">
                    <div>
                      <span>{collection.isActive ? 'فعال' : 'غیرفعال'}</span>
                      <h2>{collection.title}</h2>
                    </div>
                    <strong>{toPersianDigits(collection.gifts.length)} هدیه</strong>
                  </div>
                  <ul className="gift-business-list">
                    {collection.gifts.map((gift) => (
                      <li key={gift.id}>
                        <Gift />
                        <span>{gift.title}</span>
                      </li>
                    ))}
                  </ul>
                  {collection.href ? (
                    <Link className="gift-business-link" href={collection.href}>مشاهده مجموعه</Link>
                  ) : null}
                </div>
              </article>
            ))}
          </section>
        ) : (
          <section className="gifts-state">
            <Search />
            <h2>هدیه‌ای پیدا نشد</h2>
            <p>عبارت دیگری را جستجو کنید.</p>
          </section>
        )}
      </section>

      <MobileBottomNav currentPage="gifts" isLoggedIn={false} onNavigate={handleMobileNav} />
    </main>
  );
}

export default GiftsPage;
