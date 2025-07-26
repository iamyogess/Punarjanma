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

interface PlanFeature {
  title: string;
  description: string;
}

interface PricingPlan {
  id: string;
  name: string;
  description: string;
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
    description: "Begin your learning journey for free",
    price: "Free",
    buttonText: "Start for free",
    isPopular: false,
    features: [
      {
        title: "5 courses",
        description: "access per month\nthen $2 per additional course",
      },
      {
        title: "Basic certificates",
        description: "Course completion certificates",
      },
      {
        title: "Community access",
        description: "Join study groups and forums",
      },
      {
        title: "Basic progress tracking",
        description: "Monitor your learning journey",
      },
      {
        title: "Email support",
        description: "Response within 48 hours",
      },
    ],
  },
   {
    id: "ai-assist",
    name: "AI Assist",
    description: "Enhance your learning with smart tools",
    price: "Free (Limited Time)",
    buttonText: "Try AI Tools",
    isPopular: false,
    features: [
      { title: "Everything in Starter", description: "Plus advanced AI-powered tools" },
      { title: "Smart PDF Summarization", description: "Get quick summaries of your documents" },
      { title: "Ask Questions to Your PDFs", description: "Instant answers from your materials" },
      { title: "Personalized Learning Assistant", description: "AI that helps you stay on track" },
      { title: "Context-aware Recommendations", description: "Learn what matters most to you" },
      { title: "Limited time free access", description: "Premium features available for free now" },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    description: "Accelerate your rehabilitation and career growth",
    price: "$29",
    priceDescription: "/month",
    buttonText: "Start learning",
    isPopular: true,
    features: [
      {
        title: "Unlimited courses",
        description: "access\nFull library of educational content",
      },
      {
        title: "Accredited certificates",
        description: "Industry-recognized credentials",
      },
      {
        title: "1-on-1 mentorship",
        description: "Weekly sessions with career counselors",
      },
      {
        title: "Job placement assistance",
        description: "Resume help and interview prep",
      },
      {
        title: "Priority support",
        description: "24/7 chat and phone support",
      },
      {
        title: "Family portal access",
        description: "Share progress with loved ones",
      },
    ],
  },
];

export default function PricingCards() {
  return (
    <div className="min-h-screen  ">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Learning Path
          </h1>
          <p className="text-gray-600 text-lg">
            Empowering education and rehabilitation through accessible learning
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {pricingPlans?.map((plan) => (
            <Card
              key={plan?.id}
              className="bg-white border-gray-200 shadow-lg relative"
            >
              {plan.isPopular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-white px-4 py-1">
                  MOST POPULAR
                </Badge>
              )}

              <CardHeader className={`pb-8 ${plan.isPopular ? "pt-8" : ""}`}>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  {plan.name}
                </CardTitle>
                <CardDescription className="text-gray-600">
                  {plan.description}
                </CardDescription>
                <Button className="w-full bg-primary hover:bg-teal-700 text-white font-semibold py-3 mt-4">
                  {plan.buttonText}
                </Button>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="text-gray-900">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  {plan.priceDescription && (
                    <span className="text-gray-600 text-lg">
                      {plan.priceDescription}
                    </span>
                  )}
                </div>

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
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 text-sm">
            All plans include offline access and mobile app support. Cancel
            anytime.
          </p>
        </div>
      </div>
    </div>
  );
}
