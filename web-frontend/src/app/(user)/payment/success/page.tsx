"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Loader2 } from "lucide-react"
import { EsewaPayment } from "@/lib/esewa"
import { useAuth } from "@/contexts/auth-context"
import WidthWrapper from "@/components/WidthWrapper"

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { refreshUser } = useAuth()
  const [verifying, setVerifying] = useState(true)
  const [verified, setVerified] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const verifyPayment = async () => {
      const oid = searchParams.get("oid")
      const amt = searchParams.get("amt")
      const refId = searchParams.get("refId")

      if (!oid || !amt || !refId) {
        setError("Invalid payment parameters")
        setVerifying(false)
        return
      }

      try {
        const isVerified = await EsewaPayment.verifyPayment(oid, amt, refId)
        if (isVerified) {
          setVerified(true)
          await refreshUser()
        } else {
          setError("Payment verification failed")
        }
      } catch (error) {
        setError("Payment verification error")
      } finally {
        setVerifying(false)
      }
    }

    verifyPayment()
  }, [searchParams, refreshUser])

  if (verifying) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="text-center p-8">
          <CardContent>
            <Loader2 className="h-16 w-16 text-blue-600 mx-auto mb-4 animate-spin" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Verifying Payment</h2>
            <p className="text-gray-600">Please wait while we verify your payment...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <WidthWrapper>
        <Card className="max-w-md mx-auto text-center">
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2">
              {verified ? (
                <>
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  Payment Successful
                </>
              ) : (
                <>
                  <div className="h-6 w-6 rounded-full bg-red-100 flex items-center justify-center">
                    <span className="text-red-600 text-sm">✕</span>
                  </div>
                  Payment Failed
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {verified ? (
              <>
                <p className="text-gray-600">
                  Your payment has been successfully processed. You now have premium access to the course!
                </p>
                <Button onClick={() => router.push("/courses")} className="w-full">
                  Continue Learning
                </Button>
              </>
            ) : (
              <>
                <p className="text-gray-600">
                  {error || "There was an issue processing your payment. Please try again."}
                </p>
                <Button onClick={() => router.push("/courses")} variant="outline" className="w-full">
                  Back to Courses
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </WidthWrapper>
    </div>
  )
}
