import httpClient from "../helper/httpClient";

export const getHomePageData = async () => {
  const response = await httpClient.get("/home", {
    requiresAuth: false,
    timeout: 2500,
  });

  return response.data;
};
