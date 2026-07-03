export const getApiBaseUrl = () =>
  process.env.NEXT_PUBLIC_API_BASE_URL || process.env.VITE_API_BASE_URL || "";

export const getServerApiBaseUrl = () =>
  process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || process.env.VITE_API_BASE_URL || "";
