import { clearAuthToken, hasAuthToken } from "./authCookie";

export const AUTH_SESSION_EXPIRED_EVENT = "keymiyay:session-expired";

const PROFILE_STORAGE_KEY = "keymiyay-user-profile";
const PAGE_STORAGE_KEY = "keymiyay-current-page";

export const SESSION_EXPIRED_MESSAGE = "نشست شما منقضی شده است. لطفاً دوباره وارد حساب شوید.";

export const isAuthExpiredStatus = (status) => status === 401 || status === 403;

export const isUnauthenticatedMessage = (message) =>
  /^unauthenticated\.?$/i.test(String(message || "").trim());

export const isAuthExpiredPayload = (payload) =>
  isUnauthenticatedMessage(payload?.message || payload?.error);

export const isAuthExpiredError = (error) =>
  isAuthExpiredStatus(error?.response?.status) || isAuthExpiredPayload(error?.response?.data);

export const resetAuthSessionExpiryNotice = () => {
  if (typeof window === "undefined") return;

  window.__keymiyaySessionExpiredNotified = false;
};

export const expireAuthSession = (reason = "expired") => {
  const hadToken = hasAuthToken();

  clearAuthToken();

  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.removeItem(PROFILE_STORAGE_KEY);
    window.localStorage.removeItem(PAGE_STORAGE_KEY);
  } catch {
    // Storage cleanup is best-effort; cookie removal above is the important part.
  }

  if (!hadToken || window.__keymiyaySessionExpiredNotified) {
    return;
  }

  window.__keymiyaySessionExpiredNotified = true;
  window.dispatchEvent(new CustomEvent(AUTH_SESSION_EXPIRED_EVENT, {
    detail: {
      reason,
      message: SESSION_EXPIRED_MESSAGE,
    },
  }));
};
