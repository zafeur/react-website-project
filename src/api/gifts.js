import httpClient from "../helper/httpClient";

export const getAllGifts = async () => {
  try {
    const response = await httpClient.get("/api/v1/gifts", {
      requiresAuth: false,
    });

    return response.data;
  } catch (error) {
    const status = error?.response?.status;

    if (status === 404) {
      const fallbackResponse = await httpClient.get("/gifts", {
        requiresAuth: false,
      });

      return fallbackResponse.data;
    }

    throw error;
  }
};
