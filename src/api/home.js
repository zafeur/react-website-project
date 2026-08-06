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

const buildDiscountPayload = (offer, context = {}) => ({
  collection_id: getOfferValue(offer, ["collectionId", "collection_id", "id", "discount_id", "discountId"]),
  discount_id: getOfferValue(offer, ["id", "discount_id", "discountId"]),
  offer_id: getOfferValue(offer, ["offer_id", "offerId", "id"]),
  mobile: context.mobile || offer?.mobile || "",
  token: context.token || offer?.token || offer?.code_token || offer?.codeToken || "",
});

export const requestDiscountCode = async (offer, context = {}) => {
  const payload = buildDiscountPayload(offer, context);
  const response = await httpClient.post("/discount/generate", payload, {
    requiresAuth: true,
  });

  return response.data;
};
