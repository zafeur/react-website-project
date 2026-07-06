import axios from "axios";

const authClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || process.env.VITE_API_BASE_URL,
 
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export const sendOtp = async (mobile) => {
  const response = await authClient.post("/discount/send-otp", { mobile });

  return response.data;
};

export const verifyOtp = async ({ mobile, otp }) => {
  const response = await authClient.post("/register-mobile", { mobile, otp });

  return response.data;
};
