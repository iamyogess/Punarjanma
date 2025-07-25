import { API_CONFIG } from "./config"
import type { PaymentData } from "@/types/course"

export class EsewaPayment {
  static generateSignature(message: string): string {
    // In production, this should be done on the server side
    // This is a simplified version for demo purposes
    return btoa(message)
  }

  static initiatePayment(paymentData: PaymentData) {
    const { courseId, amount, productName } = paymentData

    const params = {
      amt: amount,
      pcd: courseId,
      psc: 0,
      txAmt: 0,
      tAmt: amount,
      pid: `course_${courseId}_${Date.now()}`,
      scd: API_CONFIG.ESEWA_CONFIG.MERCHANT_ID,
      su: API_CONFIG.ESEWA_CONFIG.SUCCESS_URL,
      fu: API_CONFIG.ESEWA_CONFIG.FAILURE_URL,
    }

    // For development, log the payment parameters
    console.log("Initiating eSewa payment with params:", params)

    // Create form and submit to eSewa (Test Environment)
    const form = document.createElement("form")
    form.method = "POST"
    form.action = "https://uat.esewa.com.np/epay/main" // Test environment URL

    Object.entries(params).forEach(([key, value]) => {
      const input = document.createElement("input")
      input.type = "hidden"
      input.name = key
      input.value = value.toString()
      form.appendChild(input)
    })

    document.body.appendChild(form)
    form.submit()
    document.body.removeChild(form)
  }

  static async verifyPayment(oid: string, amt: string, refId: string): Promise<boolean> {
    try {
      console.log("Verifying payment:", { oid, amt, refId })

      const response = await fetch(`${API_CONFIG.BASE_URL}/payments/verify-esewa`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ oid, amt, refId }),
      })

      const data = await response.json()
      console.log("Payment verification response:", data)
      return data.success
    } catch (error) {
      console.error("Payment verification failed:", error)
      return false
    }
  }
}
