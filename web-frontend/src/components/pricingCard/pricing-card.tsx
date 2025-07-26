import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import WidthWrapper from "../WidthWrapper";

interface PlanFeature {
  title: string;
  description: string;
}

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  href: string;
  price: string;
  priceDescription?: string;
  buttonText: string;
  isPopular?: boolean;
  features: PlanFeature[];
}

const pricingPlans: PricingPlan[] = [
  {
    id: "starter",
    name: "Starter",
    description: "Start learning with essential features",
    price: "Free",
    buttonText: "Start for Free",
    href: "/register",
    isPopular: false,
    features: [
      {
        title: "Access to 5 courses/month",
        description: "Enjoy up to 5 courses monthly, then $2 per extra course",
      },
      {
        title: "Basic certificates",
        description: "Get a certificate after completing each course",
      },
      {
        title: "Community access",
        description: "Join forums and study groups to connect with others",
      },
      {
        title: "Progress tracking",
        description: "Keep track of your course progress",
      },
      {
        title: "Email support",
        description: "Response within 48 hours during weekdays",
      },
    ],
  },
  {
    id: "ai-assist",
    name: "AI Assist",
    description: "Unlock smart learning tools powered by AI",
    price: "Free (Limited Time)",
    buttonText: "Try AI Features",
    href: "/ai-features",

    isPopular: false,
    features: [
      {
        title: "All Starter features",
        description: "Includes everything in the Starter plan",
      },
      {
        title: "Smart PDF Summarization",
        description: "Quickly understand documents with AI-generated summaries",
      },
      {
        title: "Ask Questions to Your PDFs",
        description: "Instant answers from your study materials",
      },
      {
        title: "AI Learning Assistant",
        description: "Stay on track with personalized AI support",
      },
      {
        title: "Smart Recommendations",
        description: "Get suggestions tailored to your goals and activity",
      },
      {
        title: "Free during launch period",
        description: "Premium AI tools available at no cost for now",
      },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    description: "Unlock your full learning potential with premium access",
    price: "Rs. 299",
    priceDescription: "/month",
    buttonText: "Upgrade to Pro",
    href: "/",
    isPopular: true,
    features: [
      {
        title: "Unlimited course access",
        description: "Explore our entire course library without limits",
      },
      {
        title: "Accredited certificates",
        description: "Earn industry-recognized certifications",
      },
      {
        title: "1-on-1 mentorship",
        description: "Weekly career coaching with expert mentors",
      },
      {
        title: "Job placement support",
        description: "Resume reviews, interview prep, and job referrals",
      },
      {
        title: "Priority support",
        description: "24/7 chat and call assistance",
      },
      {
        title: "Family portal",
        description: "Share your learning journey with your family",
      },
    ],
  },
];

export default function PricingCards() {
  return (
    <div className="mb-32" id="pricing">
      <WidthWrapper>
        <div className="text-center mb-32">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Learning Path
          </h1>
          <p className="text-gray-600 text-lg">
            Empowering education and rehabilitation through accessible learning
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {pricingPlans?.map((plan, index) => (
            <Card
              key={plan.id}
              className={`bg-white border-gray-200 relative flex flex-col justify-between shadow-none ${
                plan.isPopular ? "pt-6" : ""
              } ${
                index % 2 === 0
                  ? ""
                  : "-mt-20  shadow-[8px_10px_36px_-9px_#16a34a] border-none"
              }`}
            >
              {plan.isPopular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-white px-4 py-1">
                  MOST POPULAR
                </Badge>
              )}

              <CardHeader className={`pb-4`}>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  {plan.name}
                </CardTitle>
                <CardDescription className="text-gray-600">
                  {plan.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col justify-between space-y-6">
                {/* Price Section */}
                <div className="text-gray-900">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  {plan.priceDescription && (
                    <span className="text-gray-600 text-lg">
                      {plan.priceDescription}
                    </span>
                  )}
                </div>

                {/* Features */}
                <div className="space-y-4">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-teal-500 mt-0.5 flex-shrink-0" />
                      <div className="text-gray-900">
                        <span className="font-semibold">{feature.title}</span>
                        {feature.description && (
                          <div className="text-sm text-gray-600 whitespace-pre-line">
                            {feature.description}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Button */}
                <Button className="w-full text-white font-semibold py-3">
                  {plan.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </WidthWrapper>
    </div>
  );
}
