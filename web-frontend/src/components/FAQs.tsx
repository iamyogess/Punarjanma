"use client";
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import WidthWrapper from "@/components/WidthWrapper";

const faqList = [
  {
    id: "faq-1",
    question: "How do I get started with the learning platform?",
    answer:
      "Simply create an account, browse the courses or tools, and start learning immediately. No subscription required for most features.",
  },
  {
    id: "faq-2",
    question: "Are the AI tools free to use?",
    answer:
      "Yes, most AI tools are free to use. Some advanced features may require a one-time payment or Pro access.",
  },
  {
    id: "faq-3",
    question: "Can I track my learning progress?",
    answer:
      "Yes, you can track your progress from your dashboard, including completed lessons and tools used.",
  },
  {
    id: "faq-4",
    question: "How can I contact support?",
    answer:
      "You can reach out via the support chat on the bottom right, or email us at support@yourplatform.com.",
  },
];

const FAQs = () => {
  return (
    <div id="faq">
      <WidthWrapper>
        {/* Header */}
        <div className="flex flex-col justify-center items-center space-y-2">
          <h1 className="text-primary text-2xl lg:text-4xl font-semibold">
            Frequently Asked Questions
          </h1>
          <p className="text-gray-600">
            Here are the most frequently asked questions!
          </p>
        </div>

        {/* FAQs */}
        <div className="max-w-3xl mx-auto my-12">
          <Accordion type="single" collapsible className="w-full">
            {faqList.map((faq, index) => (
              <AccordionItem
                key={faq.id}
                value={`item-${index}`}
                className="p-3"
              >
                <AccordionTrigger className="text-base md:text-lg font-medium">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-base text-gray-700">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </WidthWrapper>
    </div>
  );
};

export default FAQs;
