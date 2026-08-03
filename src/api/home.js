import httpClient from "../helper/httpClient";

export const getHomePageData = async () => {
  const response = await httpClient.get("/home", {
    requiresAuth: false,
  });

  return response.data;
};

export const getDiscountCards = async () => {
  const response = await httpClient.get("/discount/all", {
    requiresAuth: false,
  });

  return response.data;
};

const getOfferValue = (offer, keys) => keys.map((key) => offer?.[key]).find(Boolean);

const buildDiscountPayload = (offer) => ({
  collection_id: getOfferValue(offer, ["collectionId", "collection_id", "id", "discount_id", "discountId"]),
  discount_id: getOfferValue(offer, ["id", "discount_id", "discountId"]),
  offer_id: getOfferValue(offer, ["offer_id", "offerId", "id"]),
  token: offer?.token,
  mobile: offer?.mobile,
});

export const requestDiscountCode = async (offer) => {
  const payload = buildDiscountPayload(offer);
  const response = await httpClient.post("/discount/generate", payload, {
    requiresAuth: true,
  });

  return response.data;
};
