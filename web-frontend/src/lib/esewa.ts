import CryptoJS from "crypto-js"
export class EsewaPayment {
  static initiatePayment({
    courseId,
    amount,
    productId,
    productName,
  }: {
    courseId: string
    amount: number
    productId: string
    productName: string
  }) {
    if (typeof window === "undefined") return

    const transactionUuid = `course_${courseId}_${Date.now()}`
    const MERCHANT_CODE = "EPAYTEST"
    const SECRET_KEY = "8gBm/:&EnhH.1/q"

    // Generate signature
    const message = `total_amount=${amount},transaction_uuid=${transactionUuid},product_code=${MERCHANT_CODE}`
    const hash = CryptoJS.HmacSHA256(message, SECRET_KEY)
    const signature = CryptoJS.enc.Base64.stringify(hash)

    const successUrl = `${window.location.origin}/subscription/success`
    const failureUrl = `${window.location.origin}/subscription/failure`

    const params = {
      amount,
      tax_amount: 0,
      product_service_charge: 0,
      product_delivery_charge: 0,
      total_amount: amount,
      transaction_uuid: transactionUuid,
      product_code: MERCHANT_CODE,
      success_url: successUrl,
      failure_url: failureUrl,
      signed_field_names: "total_amount,transaction_uuid,product_code",
      signature,
    }

    const form = document.createElement("form")
    form.method = "POST"
    form.action = "https://rc-epay.esewa.com.np/api/epay/main/v2/form"

    Object.entries(params).forEach(([key, value]) => {
      const input = document.createElement("input")
      input.type = "hidden"
      input.name = key
      input.value = value.toString()
      form.appendChild(input)
    })

    document.body.appendChild(form)
    form.submit()
  }

  static async verifyPayment(oid: string, amt: string, refId: string): Promise<boolean> {
    try {
      const response = await fetch("/api/payments/verify-esewa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ oid, amt, refId }),
      })

      const data = await response.json()
      return data.success
    } catch (error) {
      console.error("Payment verification error:", error)
      return false
    }
  }
}
