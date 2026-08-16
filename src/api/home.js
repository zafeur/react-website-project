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

const buildDiscountPayload = (offer, context = {}) => {
  const collectionId = offer?.collection_id || offer?.collectionId || offer?.id || "";
  const discountId = offer?.discount_id || offer?.discountId || offer?.offer_id || offer?.offerId || offer?.id || "";
  const token = offer?.token || offer?.discount_token || offer?.discountToken || "";

  return {
    mobile: context.mobile || offer?.mobile || "",
    collection_id: collectionId,
    collectionId,
    discount_id: discountId,
    discountId,
    token,
    discount_token: token,
  };
};

export const requestDiscountCode = async (offer, context = {}) => {
  const payload = toFormData(buildDiscountPayload(offer, context));
  const response = await httpClient.post("/discount/generate", payload, {
    requiresAuth: true,
  });

  return response.data;
};
