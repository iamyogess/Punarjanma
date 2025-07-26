"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, Loader2, XCircle, ArrowLeft } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

interface PaymentData {
  transaction_code: string
  status: string
  total_amount: string
  transaction_uuid: string
  product_code: string
  signed_field_names: string
  signature: string
}

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { refreshUser } = useAuth()
  const [verificationState, setVerificationState] = useState<{
    status: "verifying" | "success" | "failed"
    message: string
    courseId?: string
    paymentData?: PaymentData
  }>({
    status: "verifying",
    message: "Verifying your payment...",
  })

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Get the data parameter from URL
        const dataParam = searchParams.get("data")
        console.log("Raw data parameter:", dataParam)

        if (!dataParam) {
          console.error("No data parameter found in URL")
          setVerificationState({
            status: "failed",
            message: "Invalid payment response. Missing data parameter. Please contact support if money was deducted.",
          })
          return
        }

        // Decode the base64 data
        let paymentData: PaymentData
        try {
          const decodedData = atob(dataParam)
          paymentData = JSON.parse(decodedData)
          console.log("Decoded payment data:", paymentData)
        } catch (decodeError) {
          console.error("Failed to decode payment data:", decodeError)
          setVerificationState({
            status: "failed",
            message: "Invalid payment data format. Please contact support.",
          })
          return
        }

        // Validate payment data structure
        if (!paymentData.transaction_uuid || !paymentData.total_amount || !paymentData.transaction_code) {
          console.error("Missing required payment data fields:", paymentData)
          setVerificationState({
            status: "failed",
            message: "Incomplete payment data received. Please contact support if money was deducted.",
          })
          return
        }

        // Check if payment was successful from eSewa's perspective
        if (paymentData.status !== "COMPLETE") {
          console.error("Payment not completed by eSewa:", paymentData.status)
          setVerificationState({
            status: "failed",
            message: `Payment status from eSewa: ${paymentData.status}. Please contact support if money was deducted.`,
          })
          return
        }

        // Extract course ID from transaction UUID
        const transactionParts = paymentData.transaction_uuid.split("_")
        if (transactionParts.length < 3 || transactionParts[0] !== "course") {
          console.error("Invalid transaction UUID format:", paymentData.transaction_uuid)
          setVerificationState({
            status: "failed",
            message: "Invalid transaction format. Could not extract course ID. Please contact support.",
          })
          return
        }

        const courseId = transactionParts[1]
        console.log("Extracted course ID:", courseId)

        // Verify payment with backend
        console.log("Sending payment data to backend for verification...")
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/verify-esewa-v2`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            paymentData,
            courseId,
          }),
        })

        const result = await response.json()
        console.log("Backend verification result:", result)

        if (result.success) {
          setVerificationState({
            status: "success",
            message: "Payment verified successfully! You now have premium access.",
            courseId,
            paymentData,
          })
          // Refresh user data to update premium status
          await refreshUser()
        } else {
          setVerificationState({
            status: "failed",
            message: result.message || "Payment verification failed. Please contact support if money was deducted.",
          })
        }
      } catch (error) {
        console.error("An unexpected error occurred during payment verification:", error)
        setVerificationState({
          status: "failed",
          message: `An unexpected error occurred during verification: ${error instanceof Error ? error.message : String(error)}. Please contact support if money was deducted.`,
        })
      }
    }

    verifyPayment()
  }, [searchParams, refreshUser])

  const handleGoToCourse = () => {
    if (verificationState.courseId) {
      router.push(`/courses/${verificationState.courseId}`)
    }
  }

  const handleGoToCourses = () => {
    router.push("/courses")
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-2xl mx-auto px-4">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              {verificationState.status === "verifying" && (
                <div className="bg-blue-100 rounded-full p-6">
                  <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
                </div>
              )}
              {verificationState.status === "success" && (
                <div className="bg-green-100 rounded-full p-6">
                  <CheckCircle className="h-12 w-12 text-green-600" />
                </div>
              )}
              {verificationState.status === "failed" && (
                <div className="bg-red-100 rounded-full p-6">
                  <XCircle className="h-12 w-12 text-red-600" />
                </div>
              )}
            </div>
            <CardTitle className="text-2xl">
              {verificationState.status === "verifying" && "Verifying Payment"}
              {verificationState.status === "success" && "Payment Successful!"}
              {verificationState.status === "failed" && "Payment Verification Failed"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert
              className={
                verificationState.status === "success"
                  ? "border-green-200 bg-green-50"
                  : verificationState.status === "failed"
                    ? "border-red-200 bg-red-50"
                    : "border-blue-200 bg-blue-50"
              }
            >
              <AlertDescription className="text-center text-sm">{verificationState.message}</AlertDescription>
            </Alert>

            {verificationState.status === "verifying" && (
              <div className="text-center text-sm text-gray-600">
                <p>Please wait while we confirm your payment with eSewa...</p>
                <p className="mt-2">This may take a few moments.</p>
              </div>
            )}

            {verificationState.status === "success" && (
              <div className="space-y-4">
                <div className="text-center text-sm text-gray-600">
                  <p>🎉 Congratulations! Your payment has been processed successfully.</p>
                  <p className="mt-2">You now have premium access to the course content.</p>
                </div>

                {/* Payment Details */}
                {verificationState.paymentData && (
                  <div className="bg-gray-50 rounded-lg p-4 text-sm">
                    <h4 className="font-medium text-gray-900 mb-2">Payment Details:</h4>
                    <div className="space-y-1 text-gray-600">
                      <p>
                        <span className="font-medium">Transaction ID:</span>{" "}
                        {verificationState.paymentData.transaction_code}
                      </p>
                      <p>
                        <span className="font-medium">Amount:</span> NPR {verificationState.paymentData.total_amount}
                      </p>
                      <p>
                        <span className="font-medium">Status:</span> {verificationState.paymentData.status}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex gap-4 justify-center">
                  <Button onClick={handleGoToCourse} className="flex-1 max-w-xs">
                    Go to Course
                  </Button>
                  <Button variant="outline" onClick={handleGoToCourses} className="flex-1 max-w-xs bg-transparent">
                    Browse Courses
                  </Button>
                </div>
              </div>
            )}

            {verificationState.status === "failed" && (
              <div className="space-y-4">
                <div className="text-center text-sm text-gray-600">
                  <p>⚠️ We couldn&apos;t verify your payment at this time.</p>
                  <p className="mt-2">If money was deducted from your account, please contact our support team.</p>
                </div>
                <div className="flex gap-4 justify-center">
                  <Button variant="outline" onClick={handleGoToCourses}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Courses
                  </Button>
                </div>
              </div>
            )}

            {/* Debug info for development */}
            {process.env.NODE_ENV === "development" && (
              <details className="text-xs text-gray-500 border rounded p-2">
                <summary>Debug Info (Dev Only)</summary>
                <pre className="mt-2 whitespace-pre-wrap">
                  {JSON.stringify(
                    {
                      searchParams: Object.fromEntries(searchParams.entries()),
                      verificationState,
                    },
                    null,
                    2,
                  )}
                </pre>
              </details>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
