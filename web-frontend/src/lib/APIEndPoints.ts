export const API_ENDPOINTS = {
  REGISTER:"auth/register",
  LOGIN: "/auth/login",
} as const;

export type ApiEndpointKeys = keyof typeof API_ENDPOINTS;
