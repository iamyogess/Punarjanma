"use client";
import React from "react";
import {
  BookOpen,
  Bot,
  Video,
  FileText,
  DollarSign,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";

const services = [
  {
    icon: <BookOpen className="w-10 h-10" />,
    title: "Structured Courses",
    description:
      "Carefully designed learning paths and modular courses tailored to help you progress efficiently.",
  },
  {
    icon: <Bot className="w-10 h-10" />,
    title: "AI Chatbot Support",
    description:
      "24/7 intelligent chatbot to clarify doubts, explain concepts, and provide guidance instantly.",
  },
  {
    icon: <Video className="w-10 h-10" />,
    title: "Video Translation",
    description:
      "Multilingual video content with real-time translation to make learning accessible to everyone.",
  },
  {
    icon: <Sparkles className="w-10 h-10" />,
    title: "Video Summarization",
    description:
      "AI-powered summaries that extract the key takeaways from long lectures and tutorials.",
  },
  {
    icon: <FileText className="w-10 h-10" />,
    title: "PDF Summary & Chat",
    description:
      "Summarize any PDF and interact with it using our AI to get instant explanations and highlights.",
  },
  {
    icon: <DollarSign className="w-10 h-10" />,
    title: "Affordable Pricing",
    description:
      "Top-tier education at a price that fits every budget—learn more, spend less.",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const floatCardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
};

const Features = () => {
  return (
    <section id="features" className="relative">
      <div className="max-w-screen-xl mx-auto px-6 py-16">
        {/* Floating Card */}
        <motion.div
          className="absolute left-1/2 transform -translate-x-1/2 -mt-24 p-6 bg-primary text-white rounded-xl w-full max-w-3xl shadow-glow-pro border"
          variants={floatCardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="flex flex-col md:flex-row justify-center items-center gap-4">
            <div>
              <h3 className="text-base lg:text-xl font-bold mb-2 text-center">
                Empower Your Learning Journey
              </h3>
              <h5 className="text-gray-300 text-sm lg:text-base text-center">
                Smart, accessible, and innovative tools for modern education.
              </h5>
            </div>
          </div>
        </motion.div>

        <p className="text-center text-gray-700 mb-16 max-w-2xl mx-auto mt-12 lg:mt-10 text-base lg:text-lg">
          Our AI-powered e-learning platform offers interactive tools and
          content that adapt to your needs—making learning faster, smarter, and
          more effective.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service, index) => (
            <motion.div
              key={index}
              className="px-8 py-10 lg:px-10 lg:py-14 rounded-xl hover:shadow transition-shadow border border-gray-200"
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
              <div className="relative w-12 h-12 flex items-center justify-center mb-6">
                {/* Blurred Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-secondary to-primary blur-lg opacity-30 rounded-lg"></div>

                {/* Icon Layer */}
                <div className="relative z-10 text-primary/80">
                  {service.icon}
                </div>
              </div>

              <h3 className="text-xl font-bold text-primary/80 mb-3">
                {service.title}
              </h3>
              <p className="text-gray-900">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
