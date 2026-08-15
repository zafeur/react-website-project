import httpClient from "../helper/httpClient";

export const submitMembershipRequest = async (payload) => {
  const response = await httpClient.post("/formrequest", payload, {
    requiresAuth: false,
  });

  return response.data;
};
