"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, Loader2, XCircle, ArrowLeft } from "lucide-react"
import { EsewaPayment } from "@/lib/esewa"
import { useAuth } from "@/contexts/auth-context"

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { refreshUser } = useAuth()

  const [verificationState, setVerificationState] = useState<{
    status: "verifying" | "success" | "failed"
    message: string
    courseId?: string
  }>({
    status: "verifying",
    message: "Verifying your payment...",
  })

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Get parameters from URL
        const oid = searchParams.get("oid")
        const amt = searchParams.get("amt")
        const refId = searchParams.get("refId")

        console.log("Payment success parameters:", { oid, amt, refId })

        // Validate required parameters
        if (!oid || !amt || !refId) {
          console.error("Missing payment parameters:", { oid, amt, refId })
          setVerificationState({
            status: "failed",
            message: "Invalid payment parameters. Please contact support if money was deducted.",
          })
          return
        }

        // Extract course ID from order ID
        const courseId = oid.split("_")[1]

        if (!courseId) {
          console.error("Could not extract course ID from:", oid)
          setVerificationState({
            status: "failed",
            message: "Invalid order format. Please contact support.",
          })
          return
        }

        // Verify payment with backend
        const isVerified = await EsewaPayment.verifyPayment(oid, amt, refId)

        if (isVerified) {
          setVerificationState({
            status: "success",
            message: "Payment verified successfully! You now have premium access.",
            courseId,
          })

          // Refresh user data to update premium status
          await refreshUser()
        } else {
          setVerificationState({
            status: "failed",
            message: "Payment verification failed. Please contact support if money was deducted.",
          })
        }
      } catch (error) {
        console.error("Payment verification error:", error)
        setVerificationState({
          status: "failed",
          message: "An error occurred during verification. Please contact support if money was deducted.",
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
