import axios from "axios";
import { normalizeMobileNumber } from "../helper/normalizeMobileNumber";

const authClient = axios.create({
  baseURL: "/api/auth",
  timeout: 15000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

const isSuccessfulOtpResponse = (data, statusCode) => {
  if (data?.status === "otp_sent" || data?.status === "success") {
    return true;
  }

  if (data?.success === true || data?.ok === true || data?.otpSent === true) {
    return true;
  }

  return statusCode >= 200 && statusCode < 300 && !data?.error;
};

export const sendOtp = async (mobile) => {
  const normalizedMobile = normalizeMobileNumber(mobile);
  const response = await authClient.post("/send-otp", {
    mobile: normalizedMobile,
  });

  return {
    ...response.data,
    mobile: normalizedMobile,
    otpSent: isSuccessfulOtpResponse(response.data, response.status),
  };
};

export const verifyOtp = async ({ mobile, otp }) => {
  const response = await authClient.post("/verify-otp", {
    mobile: normalizeMobileNumber(mobile),
    otp: String(otp || "").trim(),
  });

  return response.data;
};
