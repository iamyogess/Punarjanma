export const API_ENDPOINTS = {
  REGISTER:"auth/register",
  LOGIN: "/auth/login",
  OTP:"/api/otp"
} as const;

export type ApiEndpointKeys = keyof typeof API_ENDPOINTS;
