"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { XCircle, ArrowLeft, RotateCcw } from "lucide-react"

export default function PaymentFailurePage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const pid = searchParams.get("pid")
  const courseId = pid ? pid.split("_")[1] : null

  const handleRetryPayment = () => {
    if (courseId) {
      router.push(`/courses/${courseId}`)
    } else {
      router.push("/courses")
    }
  }

  const handleBackToCourses = () => {
    router.push("/courses")
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-2xl mx-auto px-4">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <div className="bg-red-100 rounded-full p-6">
                <XCircle className="h-12 w-12 text-red-600" />
              </div>
            </div>

            <CardTitle className="text-2xl text-red-600">Payment Failed</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <Alert className="border-red-200 bg-red-50">
              <XCircle className="h-4 w-4 text-red-600" />
              <AlertDescription>
                <div className="space-y-2">
                  <p className="font-medium text-red-800">Your payment could not be processed.</p>
                  <p className="text-red-700 text-sm">This could happen due to various reasons such as:</p>
                  <ul className="text-red-700 text-sm space-y-1 ml-4">
                    <li>• Payment was cancelled</li>
                    <li>• Insufficient balance in your eSewa account</li>
                    <li>• Network connectivity issues</li>
                    <li>• Technical error during payment processing</li>
                  </ul>
                </div>
              </AlertDescription>
            </Alert>

            <div className="text-center space-y-4">
              <div className="text-sm text-gray-600">
                <p>Don&apos;t worry! No money has been deducted from your account.</p>
                <p className="mt-2">You can try the payment again or contact support if you continue to face issues.</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={handleRetryPayment} className="flex items-center gap-2">
                  <RotateCcw className="h-4 w-4" />
                  Try Payment Again
                </Button>

                <Button
                  variant="outline"
                  onClick={handleBackToCourses}
                  className="flex items-center gap-2 bg-transparent"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Courses
                </Button>
              </div>
            </div>

            {/* Payment Tips */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">💡 Payment Tips:</h4>
              <ul className="text-blue-800 text-sm space-y-1">
                <li>• Ensure you have sufficient balance in your eSewa account</li>
                <li>• Check your internet connection before making payment</li>
                <li>• Don&apos;t close the browser tab during payment process</li>
                <li>• Use the latest version of your browser</li>
              </ul>
            </div>

            {/* Debug info for development */}
            {process.env.NODE_ENV === "development" && (
              <details className="text-xs text-gray-500 border rounded p-2">
                <summary>Debug Info (Dev Only)</summary>
                <pre className="mt-2 whitespace-pre-wrap">
                  {JSON.stringify(
                    {
                      searchParams: Object.fromEntries(searchParams.entries()),
                      extractedCourseId: courseId,
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
