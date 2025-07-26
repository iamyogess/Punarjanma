"use client"
import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Crown, CheckCircle, Star, Sparkles, Gift, Shield, Download, Award, HeadphonesIcon, Clock } from "lucide-react"
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
    {
      icon: Crown,
      title: "Premium Content Access",
      description: `Unlock ${premiumLessonsCount} exclusive premium lessons`,
      color: "text-yellow-600",
    },
    {
      icon: Download,
      title: "Downloadable Resources",
      description: "Access materials offline anytime",
      color: "text-blue-600",
    },
    {
      icon: Award,
      title: "Certificate of Completion",
      description: "Professional certificate for your portfolio",
      color: "text-purple-600",
    },
    {
      icon: HeadphonesIcon,
      title: "Priority Support",
      description: "Get help faster with premium support",
      color: "text-green-600",
    },
    {
      icon: Clock,
      title: "Lifetime Access",
      description: "Learn at your own pace, forever",
      color: "text-indigo-600",
    },
    {
      icon: Shield,
      title: "Quality Guarantee",
      description: "High-quality content with regular updates",
      color: "text-red-600",
    },
  ]

  return (
    <div className="relative">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 rounded-2xl opacity-60"></div>

      <Card className="relative border-2 border-yellow-200 shadow-lg overflow-hidden">
        {/* Premium Badge */}
        <div className="absolute top-4 right-4">
          <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 text-sm font-semibold">
            <Crown className="h-3 w-3 mr-1" />
            PREMIUM
          </Badge>
        </div>

        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                Upgrade to Premium
              </CardTitle>
              <p className="text-gray-600 mt-1">Unlock the full potential of this course</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Price Highlight */}
          <div className="text-center p-6 bg-white rounded-xl border border-yellow-200 shadow-sm">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Gift className="h-5 w-5 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-700">Special Offer</span>
            </div>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-sm text-gray-500">NPR</span>
              <span className="text-4xl font-bold text-gray-900">{course.premiumPrice.toLocaleString()}</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">One-time payment • Lifetime access</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Benefits Grid */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2 text-lg">
                <Star className="h-5 w-5 text-yellow-500" />
                What&apos;s Included:
              </h3>

              <div className="grid gap-3">
                {benefits.map((benefit, index) => {
                  const IconComponent = benefit.icon
                  return (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-100 hover:border-yellow-200 transition-colors"
                    >
                      <div className={`p-1.5 rounded-full bg-gray-50 ${benefit.color}`}>
                        <IconComponent className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm">{benefit.title}</p>
                        <p className="text-xs text-gray-600 mt-0.5">{benefit.description}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Payment Form */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 text-lg">Ready to upgrade?</h3>

              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <EsewaPaymentForm course={course} onPaymentInitiated={onPaymentInitiated} />
              </div>

              {/* Trust Indicators */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Shield className="h-4 w-4 text-green-500" />
                  <span>Secure payment with eSewa</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>30-day money-back guarantee</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span>Instant access after payment</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="text-center p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
            <p className="text-sm text-gray-700">
              <strong>Limited Time:</strong> Join thousands of students who have already upgraded!
            </p>
            <div className="flex items-center justify-center gap-4 mt-2 text-xs text-gray-600">
              <span className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-green-500" />
                No hidden fees
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-green-500" />
                Cancel anytime
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-green-500" />
                Mobile friendly
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default PremiumUpgradeSection
