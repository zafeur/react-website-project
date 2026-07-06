import httpClient from "../helper/httpClient";

export const getHomePageData = async () => {
  const response = await httpClient.get("/home", {
    requiresAuth: false,
  });

  return response.data;
};

export const requestDiscountCode = async (offer) => {
  const response = await httpClient.post(
    "/discount/request",
    {
      discount_id: offer?.id || offer?.discount_id || offer?.discountId,
      offer_id: offer?.offer_id || offer?.offerId || offer?.id,
      title: offer?.title,
    },
    {
      requiresAuth: true,
    }
  );

  return response.data;
};
