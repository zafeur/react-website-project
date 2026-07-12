import httpClient from "../helper/httpClient";

export const getHomePageData = async () => {
  const response = await httpClient.get("/home", {
    requiresAuth: false,
  });

  return response.data;
};

const DISCOUNT_ALL_URL = "https://api.didarads.com/api/v1/discount/all";

export const requestDiscountCode = async (offer) => {
  const response = await httpClient.get(DISCOUNT_ALL_URL, {
    requiresAuth: true,
    params: {
      discount_id: offer?.id || offer?.discount_id || offer?.discountId,
      offer_id: offer?.offer_id || offer?.offerId || offer?.id,
      title: offer?.title,
    },
  });

  return response.data;
};
