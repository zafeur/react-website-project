import httpClient from "../helper/httpClient";

export const submitMembershipRequest = async (payload) => {
  const response = await httpClient.post("/membership-requests", payload, {
    requiresAuth: false,
  });

  return response.data;
};
