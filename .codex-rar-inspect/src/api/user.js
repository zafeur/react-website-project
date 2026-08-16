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
  const avatarFile = profile.avatarFile || profile.profileImageFile || profile.imageFile || null;
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

  const body = avatarFile ? new FormData() : payload;

  if (avatarFile) {
    Object.entries(payload).forEach(([key, value]) => {
      body.append(key, value);
    });
    body.append("profile_image", avatarFile);
  }

  const response = await httpClient.post("/user/update-profile", body, {
    requiresAuth: true,
    headers: avatarFile ? { "Content-Type": "multipart/form-data" } : undefined,
  });

  return response.data;
};

export const getDiscountReport = async () => {
  const response = await httpClient.get("/discount/report", {
    requiresAuth: true,
  });

  return response.data;
};

export const extractActiveGiftsFromReport = (payload) => {
  const data = payload?.data || payload;
  const report = data?.report || data?.discount_report || data?.discountReport;
  const user = data?.user || report?.user || payload?.user;
  const preferredCodes = firstArray(
    user?.discount_codes,
    user?.discountCodes,
    report?.user?.discount_codes,
    report?.user?.discountCodes,
    payload?.user?.discount_codes,
    payload?.user?.discountCodes,
    payload?.data?.user?.discount_codes,
    payload?.data?.user?.discountCodes
  );

  const activeUnusedCodes = preferredCodes.filter((item) => {
    const isActive = item?.active === 1 || item?.active === true || item?.active === "1";
    const isUsed = item?.is_used === 1 || item?.is_used === true || item?.is_used === "1" || Boolean(item?.used_at);
    return isActive && !isUsed;
  });

  if (activeUnusedCodes.length) {
    return activeUnusedCodes;
  }

  return firstArray(
    payload?.active_gifts,
    payload?.activeGifts,
    payload?.codes,
    payload?.discounts,
    payload?.discount_codes,
    payload?.discountCodes,
    payload?.data?.active_gifts,
    payload?.data?.activeGifts,
    payload?.data?.codes,
    payload?.data?.discounts,
    payload?.data?.discount_codes,
    payload?.data?.discountCodes,
    report?.active_gifts,
    report?.activeGifts,
    report?.codes,
    report?.discounts,
    report?.discount_codes,
    report?.discountCodes,
    payload?.gifts,
    payload?.data?.gifts,
    report?.gifts,
    Array.isArray(data) ? data : undefined
  );
};

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
    avatar: firstValue(source, ["avatar", "avatar_url", "avatarUrl", "profile_image", "profileImage", "profile_photo", "profilePhoto", "image", "photo"]),
    avatarPreview: firstValue(source, ["avatarPreview", "avatar_preview"]),
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
