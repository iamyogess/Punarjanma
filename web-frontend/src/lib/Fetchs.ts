import { API } from "./API";
import { API_ENDPOINTS } from "./APIEndPoints";

export const registerUser = async (payload: RegisterPayloadType) => {
  const { data } = await API.post(API_ENDPOINTS.REGISTER, payload, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return data;
};

//email verification
export const emailVerification = async (
  payload: EmailVarificationPayloadType
) => {
  const { data } = await API.post(API_ENDPOINTS.EMAIL_VERIFICATION, payload, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return data;
};
//Resend email verification
export const resendEmailVerification = async (
  payload: ResendEmailVarificationPayloadType
) => {
  const { data } = await API.post(
    API_ENDPOINTS.RESEND_EMAIL_VERIFICATION,
    payload,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return data;
};

export const loginUser = async (payload: LoginPayloadType) => {
  const { data } = await API.post(API_ENDPOINTS.LOGIN, payload, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return data;
};
