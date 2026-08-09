import { getAuthToken, getAuthUserType } from "./authCookie";

export const runRequestAuthMiddleware = (config) => {
  const token = getAuthToken();
  const userType = getAuthUserType();
  const requiresAuth = Boolean(config.requiresAuth);
  const requiredUserType = config.requiredUserType || "user";

  if (requiresAuth && !token) {
    return Promise.reject(new Error("Authentication is required for this request."));
  }

  if (requiresAuth && userType && userType !== requiredUserType) {
    return Promise.reject(new Error("This user is not allowed to perform this request."));
  }

  const isFormData = typeof FormData !== "undefined" && config.data instanceof FormData;

  config.headers = {
    Accept: "application/json",
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...config.headers,
  };

  if (isFormData) {
    delete config.headers["Content-Type"];
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
};
