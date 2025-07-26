"use client"

import type React from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Crown, CheckCircle, Star } from "lucide-react"
import EsewaPaymentForm from "./esewa-payment-form"

interface Course {
  _id: string
  title: string
  premiumPrice: number
  description?: string
}

interface PremiumUpgradeSectionProps {
  course: Course
  premiumLessonsCount: number
  userIsEnrolled: boolean
  userHasPremium: boolean
  onPaymentInitiated?: () => void
}

const PremiumUpgradeSection: React.FC<PremiumUpgradeSectionProps> = ({
  course,
  premiumLessonsCount,
  userIsEnrolled,
  userHasPremium,
  onPaymentInitiated,
}) => {
  if (!userIsEnrolled || userHasPremium || premiumLessonsCount === 0) {
    return null
  }

  const benefits = [
    "Access to all premium lessons",
    "High-quality video content",
    "Downloadable resources",
    "Certificate of completion",
    "Priority support",
    "Lifetime access",
  ]

  return (
    <div className="space-y-6">
      {/* Premium Alert */}
      <Alert className="border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50">
        <Crown className="h-4 w-4 text-yellow-600" />
        <AlertDescription>
          <div className="space-y-2">
            <p className="font-medium text-yellow-800">🚀 Unlock {premiumLessonsCount} Premium Lessons</p>
            <p className="text-yellow-700 text-sm">
              Get full access to advanced content and exclusive materials for just NPR{" "}
              {course.premiumPrice.toLocaleString()}
            </p>
          </div>
        </AlertDescription>
      </Alert>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Benefits */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            What you&apos;ll get:
          </h3>
          <ul className="space-y-2">
            {benefits.map((benefit, index) => (
              <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                {benefit}
              </li>
            ))}
          </ul>
        </div>

        {/* Payment Form */}
        <div>
          <EsewaPaymentForm course={course} onPaymentInitiated={onPaymentInitiated} />
        </div>
      </div>
    </div>
  )
}

export default PremiumUpgradeSection
