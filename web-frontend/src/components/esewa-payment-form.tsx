"use client"

import type React from "react"
import { useState } from "react"
import CryptoJS from "crypto-js"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Crown, Lock } from "lucide-react"

const MERCHANT_CODE = "EPAYTEST"
const SECRET_KEY = "8gBm/:&EnhH.1/q"

interface Course {
  _id: string
  title: string
  premiumPrice: number
  description?: string
}

interface EsewaPaymentFormProps {
  course: Course
  onPaymentInitiated?: () => void
  disabled?: boolean
  className?: string
}

const generateEsewaSignature = (totalAmount: number, transactionUuid: string, productCode: string): string => {
  const message = `total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=${productCode}`
  const hash = CryptoJS.HmacSHA256(message, SECRET_KEY)
  return CryptoJS.enc.Base64.stringify(hash)
}

const EsewaPaymentForm: React.FC<EsewaPaymentFormProps> = ({
  course,
  onPaymentInitiated,
  disabled = false,
  className = "",
}) => {
  const [loading, setLoading] = useState(false)

  const handlePayment = () => {
    if (typeof window === "undefined") return

    const amount = course.premiumPrice
    const transactionUuid = `course_${course._id}_${Date.now()}`
    const taxAmount = 0
    const productServiceCharge = 0
    const productDeliveryCharge = 0
    const totalAmount = amount + taxAmount + productServiceCharge + productDeliveryCharge

    const signature = generateEsewaSignature(totalAmount, transactionUuid, MERCHANT_CODE)

    const successUrl = `${window.location.origin}/payment/success`
    const failureUrl = `${window.location.origin}/payment/failure`

    const params = {
      amount,
      tax_amount: taxAmount,
      product_service_charge: productServiceCharge,
      product_delivery_charge: productDeliveryCharge,
      total_amount: totalAmount,
      transaction_uuid: transactionUuid,
      product_code: MERCHANT_CODE,
      success_url: successUrl,
      failure_url: failureUrl,
      signed_field_names: "total_amount,transaction_uuid,product_code",
      signature,
    }

    // Create and submit form
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

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!course.premiumPrice || course.premiumPrice <= 0) {
      alert("Invalid course price. Please contact support.")
      return
    }

    setLoading(true)
    onPaymentInitiated?.()
    handlePayment()
  }

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="h-5 w-5 text-yellow-500" />
          Unlock Premium Access
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-900">{course.title}</h3>
            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">Premium</Badge>
          </div>
          <p className="text-sm text-gray-600 mb-3">Get unlimited access to all premium lessons and content</p>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-gray-900">NPR {course.premiumPrice.toLocaleString()}</span>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Lock className="h-4 w-4" />
              One-time payment
            </div>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <Button
            type="submit"
            className="w-full bg-[#60BB46] hover:bg-[#60BB46]/90 text-white font-semibold py-3"
            disabled={loading || disabled}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Redirecting to eSewa...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Pay NPR {course.premiumPrice.toLocaleString()} with eSewa
              </div>
            )}
          </Button>
        </form>

        <div className="text-xs text-gray-500 text-center">
          <p>🔒 Secure payment powered by eSewa</p>
          <p>You will be redirected to eSewa to complete your payment</p>
        </div>
      </CardContent>
    </Card>
  )
}

export default EsewaPaymentForm
