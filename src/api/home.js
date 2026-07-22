import httpClient from "../helper/httpClient";

export const getHomePageData = async () => {
  const response = await httpClient.get("/home", {
    requiresAuth: false,
  });

  return response.data;
};

const DISCOUNT_ALL_URL = "https://api.didarads.com/api/v1/discount/all";

const getOfferValue = (offer, keys) => keys.map((key) => offer?.[key]).find(Boolean);

const buildDiscountPayload = (offer) => ({
  business_id: getOfferValue(offer, ["businessId", "business_id", "businessSlug", "business_slug"]),
  discount_id: getOfferValue(offer, ["id", "discount_id", "discountId"]),
  offer_id: getOfferValue(offer, ["offer_id", "offerId", "id"]),
  title: offer?.title,
  brand: offer?.brand,
});

export const requestDiscountCode = async (offer) => {
  const payload = buildDiscountPayload(offer);

  try {
    const response = await httpClient.post(DISCOUNT_ALL_URL, payload, {
      requiresAuth: true,
    });

    return response.data;
  } catch (postError) {
    const response = await httpClient.get(DISCOUNT_ALL_URL, {
      requiresAuth: true,
      params: payload,
    });

    return response.data;
  }
};