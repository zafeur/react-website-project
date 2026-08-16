import httpClient from "../helper/httpClient";
import { toFormData } from "../helper/formData";

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

const isNumericId = (value) => /^\d+$/.test(String(value || "").trim());

const getCollectionId = (offer) => {
  const explicitCollectionId = getOfferValue(offer, ["collectionId", "collection_id"]);
  if (explicitCollectionId) return explicitCollectionId;

  const id = getOfferValue(offer, ["id"]);
  return isNumericId(id) ? id : "";
};

const buildDiscountPayload = (offer, context = {}) => {
  const collectionId = getCollectionId(offer);

  return {
    mobile: context.mobile || offer?.mobile || "",
    ...(collectionId ? { collection_id: collectionId } : {}),
  };
};

export const requestDiscountCode = async (offer, context = {}) => {
  const payload = toFormData(buildDiscountPayload(offer, context));
  const response = await httpClient.post("/discount/generate", payload, {
    requiresAuth: true,
  });

  return response.data;
};
