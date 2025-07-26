import { API_CONFIG, ENV } from "./config"
import type { PaymentData } from "./config"

export class EsewaPayment {
  static initiatePayment(paymentData: PaymentData) {
    const { courseId, amount, productName } = paymentData

    // Create a unique product ID with timestamp
    const pid = `course_${courseId}_${Date.now()}`

    // eSewa payment parameters
    const params = {
      amt: amount.toString(),
      txAmt: "0", // Tax amount
      psc: "0", // Service charge
      pdc: "0", // Delivery charge
      tAmt: amount.toString(), // Total amount
      pid: pid, // Unique product/order ID
      scd: API_CONFIG.ESEWA_CONFIG.MERCHANT_ID, // Merchant code
      su: API_CONFIG.ESEWA_CONFIG.SUCCESS_URL, // Success URL
      fu: API_CONFIG.ESEWA_CONFIG.FAILURE_URL, // Failure URL
    }

    console.log("Initiating eSewa payment with parameters:", params)

    // Validate required parameters
    if (!params.amt || !params.pid || !params.su || !params.fu) {
      console.error("Missing required eSewa parameters:", params)
      alert("Payment configuration error. Please try again.")
      return
    }

    try {
      // Create form dynamically
      const form = document.createElement("form")
      form.method = "POST"
      form.action = API_CONFIG.ESEWA_CONFIG.PAYMENT_URL
      form.target = "_self"

      // Add all parameters as hidden inputs
      Object.entries(params).forEach(([key, value]) => {
        const input = document.createElement("input")
        input.type = "hidden"
        input.name = key
        input.value = value.toString()
        form.appendChild(input)
      })

      // Add form to document and submit
      document.body.appendChild(form)
      console.log("Submitting payment form to eSewa...")
      form.submit()

      // Clean up form after submission
      setTimeout(() => {
        if (document.body.contains(form)) {
          document.body.removeChild(form)
        }
      }, 1000)
    } catch (error) {
      console.error("Error initiating eSewa payment:", error)
      alert("Failed to initiate payment. Please try again.")
    }
  }

  static async verifyPayment(oid: string, amt: string, refId: string): Promise<boolean> {
    try {
      console.log("Verifying payment:", { oid, amt, refId })

      const response = await fetch(`${API_CONFIG.BASE_URL}/payments/verify-esewa`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ oid, amt, refId }),
      })

      if (!response.ok) {
        console.error("HTTP error during verification:", response.status, response.statusText)
        const errorText = await response.text()
        console.error("Error response:", errorText)
        return false
      }

      const data = await response.json()
      console.log("Payment verification response:", data)
      return data.success || false
    } catch (error) {
      console.error("Payment verification failed:", error)
      return false
    }
  }

  // Helper method to parse URL parameters
  static getUrlParams(): Record<string, string> {
    if (typeof window === "undefined") return {}

    const params = new URLSearchParams(window.location.search)
    const result: Record<string, string> = {}
    for (const [key, value] of params.entries()) {
      result[key] = value
    }
    return result
  }

  // Helper method to get configuration info for debugging
  static getConfig() {
    return {
      apiBaseUrl: API_CONFIG.BASE_URL,
      esewaConfig: API_CONFIG.ESEWA_CONFIG,
      environment: {
        backendUri: ENV.BACKEND_URI,
        frontendUri: ENV.Frontend_URI,
        version: ENV.VERSION,
        isDevelopment: ENV.IS_DEVELOPMENT,
        isProduction: ENV.IS_PRODUCTION,
      },
    }
  }
}
