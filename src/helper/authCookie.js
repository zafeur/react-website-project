export const TOKEN_COOKIE_NAME = "keymiyay_token";
export const USER_TYPE_COOKIE_NAME = "keymiyay_user_type";

const TOKEN_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

const canUseDocument = () => typeof document !== "undefined";

const getCookie = (name) => {
  if (!canUseDocument()) {
    return null;
  }

  const cookie = document.cookie
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(name + "="));

  return cookie ? decodeURIComponent(cookie.slice(name.length + 1)) : null;
};

const setCookie = (name, value) => {
  if (!canUseDocument() || !value) {
    return;
  }

  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie =
    name +
    "=" +
    encodeURIComponent(value) +
    "; Max-Age=" +
    TOKEN_MAX_AGE_SECONDS +
    "; Path=/; SameSite=Lax" +
    secure;
};

const clearCookie = (name) => {
  if (!canUseDocument()) {
    return;
  }

  document.cookie = name + "=; Max-Age=0; Path=/; SameSite=Lax";
};

export const getAuthToken = () => getCookie(TOKEN_COOKIE_NAME);

export const getAuthUserType = () => getCookie(USER_TYPE_COOKIE_NAME);

export const hasAuthToken = () => Boolean(getAuthToken());

export const setAuthToken = (token, userType) => {
  setCookie(TOKEN_COOKIE_NAME, token);

  if (userType) {
    setCookie(USER_TYPE_COOKIE_NAME, userType);
  }
};

export const clearAuthToken = () => {
  clearCookie(TOKEN_COOKIE_NAME);
  clearCookie(USER_TYPE_COOKIE_NAME);
};
