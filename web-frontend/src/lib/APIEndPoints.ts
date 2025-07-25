export const API_ENDPOINTS = {
  REGISTER: "/register",
  LOGIN: "/login",
  EMAIL_VERIFICATION: "/verify-email",
  RESEND_EMAIL_VERIFICATION: "/resend-verification-code",
  USER_PROFILE: "/me",
  CHANGE_PASSWORD: "/change-password",
  DELETE_USER: "/delete",
  GET_ALL_USER: "/",
} as const;

export type ApiEndpointKeys = keyof typeof API_ENDPOINTS;
