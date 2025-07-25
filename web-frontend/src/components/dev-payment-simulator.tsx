"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { CreditCard, AlertTriangle } from "lucide-react"

interface DevPaymentSimulatorProps {
  courseId: string
  courseName: string
  amount: number
  onPaymentSuccess: () => void
}

export function DevPaymentSimulator({ courseId, courseName, amount, onPaymentSuccess }: DevPaymentSimulatorProps) {
  const [isSimulating, setIsSimulating] = useState(false)

  const simulatePayment = async () => {
    setIsSimulating(true)

    // Simulate payment processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Simulate successful payment
    const mockPaymentData = {
      oid: `course_${courseId}_${Date.now()}`,
      amt: amount.toString(),
      refId: `DEV_${Math.random().toString(36).substr(2, 9)}`,
    }

    // Redirect to success page with mock data
    const successUrl = new URL("/payment/success", window.location.origin)
    Object.entries(mockPaymentData).forEach(([key, value]) => {
      successUrl.searchParams.set(key, value)
    })

    window.location.href = successUrl.toString()
  }

  if (process.env.NODE_ENV === "production") {
    return null // Don't show in production
  }

  return (
    <Card className="border-orange-200 bg-orange-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-800">
          <AlertTriangle className="h-5 w-5" />
          Development Payment Simulator
          <Badge variant="outline" className="text-xs">
            DEV ONLY
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-orange-700">
          <p>
            <strong>Course:</strong> {courseName}
          </p>
          <p>
            <strong>Amount:</strong> NPR {amount}
          </p>
          <p>
            <strong>Course ID:</strong> {courseId}
          </p>
        </div>

        <div className="space-y-2">
          <Label className="text-orange-800">Test Payment Simulation</Label>
          <p className="text-xs text-orange-600">This will simulate a successful payment without going through eSewa</p>
        </div>

        <Button onClick={simulatePayment} disabled={isSimulating} className="w-full bg-orange-600 hover:bg-orange-700">
          <CreditCard className="h-4 w-4 mr-2" />
          {isSimulating ? "Processing..." : "Simulate Payment Success"}
        </Button>

        <p className="text-xs text-orange-500 text-center">This button only appears in development mode</p>
      </CardContent>
    </Card>
  )
}
