import httpClient from "../helper/httpClient";

const firstArray = (...values) => {
  for (const value of values) {
    if (Array.isArray(value)) {
      return value;
    }
  }

  return [];
};

const firstValue = (source, keys) => {
  if (!source || typeof source !== "object") {
    return "";
  }

  for (const key of keys) {
    const value = source[key];
    if (value !== undefined && value !== null && value !== "") {
      return value;
    }
  }

  return "";
};

const firstObject = (...values) => {
  for (const value of values) {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      return value;
    }
  }

  return null;
};

export const updateUserProfile = async (profile) => {
  const birthDate = profile.birthDate || profile.birth_date || profile.date || "";

  const payload = {
    first_name: profile.firstName || "",
    last_name: profile.lastName || "",
    name: profile.firstName || "",
    family: profile.lastName || "",
    email: profile.email || "",
    date: birthDate,
    birth_date: birthDate,
    birth_date_calendar: profile.birthDateCalendar || profile.birth_date_calendar || profile.calendar_type || "",
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


export const normalizeUserProfile = (source = {}) => {
  const firstName = firstValue(source, ["firstName", "first_name", "name", "first", "given_name"]);
  const lastName = firstValue(source, ["lastName", "last_name", "family", "family_name", "surname", "last"]);
  const fullName = firstValue(source, ["fullName", "full_name", "display_name", "displayName", "username"]);

  return {
    ...source,
    firstName,
    lastName,
    fullName: fullName || [firstName, lastName].filter(Boolean).join(" "),
    email: firstValue(source, ["email", "email_address"]),
    birthDate: firstValue(source, ["birthDate", "birth_date", "date", "birthday", "date_of_birth"]),
    birthDateCalendar: firstValue(source, ["birthDateCalendar", "birth_date_calendar", "calendar_type"]),
    mobile: firstValue(source, ["mobile", "phone", "phone_number", "mobile_number", "cellphone"]),
    level: firstValue(source, ["level", "rank", "membership_level", "membershipLevel", "status"]),
    score: firstValue(source, ["score", "points", "credit", "wallet", "balance"]),
  };
};

export const extractUserProfileFromReport = (payload) => {
  const data = payload?.data || payload;
  const report = data?.report || data?.discount_report || data?.discountReport;
  const user = firstObject(
    payload?.user,
    payload?.profile,
    payload?.customer,
    payload?.member,
    payload?.data?.user,
    payload?.data?.profile,
    payload?.data?.customer,
    payload?.data?.member,
    report?.user,
    report?.profile,
    report?.customer,
    report?.member,
    data
  );

  if (!user) {
    return null;
  }

  const normalized = normalizeUserProfile(user);
  return Object.values(normalized).some((value) => value !== undefined && value !== null && value !== "") ? normalized : null;
};
