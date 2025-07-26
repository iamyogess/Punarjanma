export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",

  ESEWA_CONFIG: {
    MERCHANT_ID: process.env.NEXT_PUBLIC_ESEWA_MERCHANT_ID || "EPAYTEST",
    CLIENT_ID: process.env.NEXT_PUBLIC_ESEWA_CLIENT_ID || "",
    CLIENT_SECRET: process.env.NEXT_PUBLIC_ESEWA_CLIENT_SECRET || "",

    // eSewa URLs for test environment
    PAYMENT_URL: "https://uat.esewa.com.np/epay/main",
    VERIFICATION_URL: "https://uat.esewa.com.np/epay/transrec",

    // Dynamic URLs that work in both development and production
    get SUCCESS_URL() {
      if (typeof window !== "undefined") {
        return `${window.location.origin}/payment/success`
      }
      return `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/payment/success`
    },

    get FAILURE_URL() {
      if (typeof window !== "undefined") {
        return `${window.location.origin}/payment/failure`
      }
      return `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/payment/failure`
    },
  },
}

export const COURSE_TIERS = {
  FREE: "free",
  PREMIUM: "premium",
} as const

export type CourseTier = (typeof COURSE_TIERS)[keyof typeof COURSE_TIERS]

export class ENV {
  static get BACKEND_URI(): string {
    return process.env.NEXT_PUBLIC_SERVER || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
  }

  static get Frontend_URI(): string {
    return process.env.NEXT_PUBLIC_CLIENT || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  }

  static get VERSION(): string {
    return process.env.NEXT_PUBLIC_VERSION || "1.0.0"
  }

  static get API_BASE_URL(): string {
    return `${this.BACKEND_URI}/api`
  }

  static get IS_DEVELOPMENT(): boolean {
    return process.env.NODE_ENV === "development"
  }

  static get IS_PRODUCTION(): boolean {
    return process.env.NODE_ENV === "production"
  }
}

export interface PaymentData {
  courseId: string
  amount: number
  productId: string
  productName: string
}

export const validateConfig = () => {
  const requiredEnvVars = ["NEXT_PUBLIC_ESEWA_MERCHANT_ID", "NEXT_PUBLIC_API_URL"]

  const missing = requiredEnvVars.filter((varName) => !process.env[varName])

  if (missing.length > 0) {
    console.warn("Missing environment variables:", missing)
  }

  return {
    isValid: missing.length === 0,
    missing,
  }
}
