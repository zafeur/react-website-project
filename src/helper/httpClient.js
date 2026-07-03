import axios from "axios";
import { runRequestAuthMiddleware } from "./authMiddleware";

const httpClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || process.env.VITE_API_BASE_URL,
  timeout: 8000,
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

httpClient.interceptors.request.use(runRequestAuthMiddleware);

httpClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export default httpClient;
