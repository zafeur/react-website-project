import axios from "axios";
import { toFormData } from "../helper/formData";

const authClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || process.env.VITE_API_BASE_URL,

  headers: {
    Accept: "application/json",
  },
});

export const sendOtp = async (mobile) => {
  const response = await authClient.post("/discount/send-otp", toFormData({ mobile }));

  return response.data;
};

export const verifyOtp = async ({ mobile, otp }) => {
  const response = await authClient.post("/register-mobile", toFormData({ mobile, otp }));

  return response.data;
};
