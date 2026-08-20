import httpClient from "../helper/httpClient";
import { toFormData } from "../helper/formData";

export const getCollectionDetails = async (collectionId) => {
  const response = await httpClient.get(`/collections/${collectionId}/details`, {
    requiresAuth: true,
    headers: { Accept: "application/json" },
  });

  if (typeof response.data === "string") {
    throw new Error("Collection details did not return JSON.");
  }

  return response.data;
};

export const toggleCollectionFollow = async (collectionId) => {
  const response = await httpClient.post(
    `/collections/${collectionId}/toggle-follow`,
    toFormData({ collection_id: collectionId }),
    { requiresAuth: true }
  );

  return response.data;
};
