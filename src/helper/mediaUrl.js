const APP_LOCAL_PATH_PATTERN = /^\/(?:home|brand|_next|icons?|manifest\.json|sw\.js)\b/i;
const API_PATH_SUFFIX_PATTERN = /\/api(?:\/v\d+)?\/?$/i;

export const getApiBaseUrl = () =>
  process.env.NEXT_PUBLIC_API_BASE_URL || process.env.VITE_API_BASE_URL || '';

export const getMediaBaseUrl = () => {
  const baseUrl = String(getApiBaseUrl() || '').trim();

  if (!baseUrl) {
    return '';
  }

  try {
    const url = new URL(baseUrl);
    url.pathname = url.pathname.replace(API_PATH_SUFFIX_PATTERN, '/');
    url.search = '';
    url.hash = '';
    return url.toString();
  } catch {
    return baseUrl.replace(API_PATH_SUFFIX_PATTERN, '/');
  }
};

export const normalizeMediaUrl = (value = '', fallback = '') => {
  const raw = Array.isArray(value) ? value[0] : value;
  const text = String(raw || '').trim().replace(/^\"|\"$/g, '');

  if (!text || text === '[]') {
    return fallback;
  }

  if (/^(https?:|data:|blob:)/.test(text)) {
    return text.replace(/\s/g, '%20');
  }

  if (APP_LOCAL_PATH_PATTERN.test(text)) {
    return text;
  }

  const mediaBaseUrl = getMediaBaseUrl();
  const encodedPath = text.replace(/\s/g, '%20').replace(/^\/+/, '');

  if (mediaBaseUrl) {
    try {
      return new URL(encodedPath, mediaBaseUrl).toString();
    } catch {
      return fallback || `/${encodedPath}`;
    }
  }

  return fallback || `/${encodedPath}`;
};
