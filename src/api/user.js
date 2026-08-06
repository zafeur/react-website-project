import httpClient from "../helper/httpClient";

const firstArray = (...values) => {
  for (const value of values) {
    if (Array.isArray(value)) {
      return value;
    }
  }

  return [];
};

export const updateUserProfile = async (profile) => {
  const payload = {
    first_name: profile.firstName || "",
    last_name: profile.lastName || "",
    name: profile.firstName || "",
    family: profile.lastName || "",
    email: profile.email || "",
    birth_date: profile.birthDate || "",
    mobile: profile.mobile || "",
  };

  const response = await httpClient.post("/user/update-profile", payload, {
    requiresAuth: true,
  });

  return response.data;
};

export const getDiscountReport = async () => {
  const response = await httpClient.get("/discount/report", {
    requiresAuth: true,
  });

  return response.data;
};

export const extractActiveGiftsFromReport = (payload) =>
  firstArray(
    payload?.active_gifts,
    payload?.activeGifts,
    payload?.gifts,
    payload?.codes,
    payload?.discounts,
    payload?.data?.active_gifts,
    payload?.data?.activeGifts,
    payload?.data?.gifts,
    payload?.data?.codes,
    payload?.data?.discounts,
    payload?.data
  );
