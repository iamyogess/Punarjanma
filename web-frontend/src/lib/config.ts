export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
  ESEWA_CONFIG: {
    MERCHANT_ID: process.env.NEXT_PUBLIC_ESEWA_MERCHANT_ID || "EPAYTEST",
    SUCCESS_URL: process.env.NEXT_PUBLIC_APP_URL + "/payment/success" || "http://localhost:3000/payment/success",
    FAILURE_URL: process.env.NEXT_PUBLIC_APP_URL + "/payment/failure" || "http://localhost:3000/payment/failure",
    RETURN_URL: process.env.NEXT_PUBLIC_APP_URL + "/payment/return" || "http://localhost:3000/payment/return",
  },
}

export const COURSE_TIERS = {
  FREE: "free",
  PREMIUM: "premium",
} as const

export type CourseTier = (typeof COURSE_TIERS)[keyof typeof COURSE_TIERS]
