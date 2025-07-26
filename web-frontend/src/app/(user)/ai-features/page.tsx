"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Bot,
  FileText,
  Video,
  MessageSquareText,
  Sparkles,
  ArrowRight,
} from "lucide-react";

const aiFeatures = [
  {
    icon: <Bot className="w-10 h-10" />,
    title: "AI Chat Assistant",
    description:
      "Ask questions, clarify doubts, and learn instantly with our chatbot.",
    href: "/ai-tools/chatbot",
  },
  {
    icon: <Sparkles className="w-10 h-10" />,
    title: "Video Summarizer",
    description: "Get key points from long educational videos in seconds.",
    href: "/ai-tools/video-summary",
  },
  {
    icon: <FileText className="w-10 h-10" />,
    title: "PDF Summarization",
    description:
      "Upload any PDF and receive a concise summary or chat with it.",
    href: "/ai-tools/pdf-summary",
  },
  {
    icon: <Video className="w-10 h-10" />,
    title: "Auto Caption & Translate",
    description:
      "Translate and caption videos in real-time for global learners.",
    href: "/ai-tools/caption-translate",
  },
  {
    icon: <MessageSquareText className="w-10 h-10" />,
    title: "Speech to Notes",
    description: "Convert spoken content into written notes for easy recall.",
    href: "/ai-tools/speech-to-text",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const AiFeatures = () => {
  return (
    <section className="relative px-6 py-20 bg-background">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-16 text-gray-900">
          AI Tools to Boost Your Learning
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {aiFeatures.map((feature, index) => (
            <motion.div
              key={index}
              className="p-6 lg:p-8 rounded-xl border hover:shadow-sm transition-shadow duration-300"
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                delay: index * 0.1,
                duration: 0.5,
                ease: "easeOut",
              }}
            >
              {/* Icon with blur background */}
              <div className="relative w-12 h-12 mb-5 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-r from-secondaryColor to-primaryColor blur-lg opacity-30 rounded-lg"></div>
                <div className="relative z-10 text-primaryColor">
                  {feature.icon}
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 mb-4">{feature.description}</p>

              {/* Minimal Link Button */}
              <Link
                href={feature.href}
                className="inline-flex items-center text-sm text-primary hover:underline"
              >
                Try it <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AiFeatures;
