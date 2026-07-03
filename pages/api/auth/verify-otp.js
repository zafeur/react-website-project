import axios from "axios";
import { getServerApiBaseUrl } from "../../../src/helper/apiBaseUrl";
import { normalizeMobileNumber } from "../../../src/helper/normalizeMobileNumber";

const CONNECTION_ERROR_MESSAGE = "??? ?? ?????? ?? ????";

const getErrorPayload = (error, fallbackMessage) => {
  if (error.code === "ECONNABORTED" || !error.response) {
    return {
      status: 504,
      body: { message: CONNECTION_ERROR_MESSAGE, code: "BACKEND_TIMEOUT" },
    };
  }

  const data = error.response.data;
  return {
    status: error.response.status || 502,
    body: {
      message: data?.message || fallbackMessage,
      details: data,
    },
  };
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const response = await axios.post(
      `${getServerApiBaseUrl()}/register-mobile`,
      {
        mobile: normalizeMobileNumber(req.body?.mobile),
        otp: String(req.body?.otp || "").trim(),
      },
      {
        timeout: 12000,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    return res.status(response.status).json(response.data);
  } catch (error) {
    const { status, body } = getErrorPayload(error, "OTP verification failed");
    return res.status(status).json(body);
  }
}
