import axios from "axios";
import { runRequestAuthMiddleware } from "./authMiddleware";
import { expireAuthSession, isAuthExpiredPayload, isAuthExpiredStatus } from "./authSession";

const httpClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || process.env.VITE_API_BASE_URL,

  headers: {
    Accept: "application/json",
  },
});

httpClient.interceptors.request.use(runRequestAuthMiddleware);

const retryWithoutAuthOnce = (config) => {
  if (config.requiresAuth || config.__retriedAfterAuthExpire) {
    return null;
  }

  const retryConfig = {
    ...config,
    __retriedAfterAuthExpire: true,
    headers: {
      ...config.headers,
    },
  };

  delete retryConfig.headers.Authorization;
  delete retryConfig.headers.authorization;

  return httpClient.request(retryConfig);
};

httpClient.interceptors.response.use(
  (response) => {
    const config = response?.config || {};
    const hadAuthHeader = Boolean(config.headers?.Authorization || config.headers?.authorization);

    if (isAuthExpiredPayload(response?.data) && (config.requiresAuth || hadAuthHeader)) {
      expireAuthSession("expired");

      const retryRequest = retryWithoutAuthOnce(config);
      if (retryRequest) {
        return retryRequest;
      }

      const authError = new Error("Unauthenticated.");
      authError.response = response;
      authError.config = config;
      return Promise.reject(authError);
    }

    return response;
  },
  (error) => {
    const status = error?.response?.status;
    const config = error?.config || {};
    const hadAuthHeader = Boolean(config.headers?.Authorization || config.headers?.authorization);

    if ((isAuthExpiredStatus(status) || isAuthExpiredPayload(error?.response?.data)) && (config.requiresAuth || hadAuthHeader)) {
      expireAuthSession(status === 403 ? "forbidden" : "expired");

      const retryRequest = retryWithoutAuthOnce(config);
      if (retryRequest) {
        return retryRequest;
      }
    }

    return Promise.reject(error);
  }
);

export default httpClient;
