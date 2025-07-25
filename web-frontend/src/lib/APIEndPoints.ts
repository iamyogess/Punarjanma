export const API_ENDPOINTS = {
  LOGIN: "/auth/login",
} as const;

export type ApiEndpointKeys = keyof typeof API_ENDPOINTS;
