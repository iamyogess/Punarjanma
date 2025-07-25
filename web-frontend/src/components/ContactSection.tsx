"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { motion, Variants } from "framer-motion";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: custom * 0.2, duration: 0.6, ease: "easeInOut" },
  }),
};

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [responseMsg, setResponseMsg] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setResponseMsg("");

    const existing =
      typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem("contacts") || "[]")
        : [];

    const newData = {
      ...formData,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem("contacts", JSON.stringify([...existing, newData]));

    setResponseMsg("Message saved locally!");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <main className="max-w-3xl mx-auto px-4 py-16 space-y-12">
      <motion.section
        custom={0}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeUp}
      >
        <h1 className="text-4xl font-bold tracking-tight mb-2">Contact Us</h1>
        <p className="text-muted-foreground text-lg">
          Have a question, feedback, or partnership inquiry? Fill out the form
          below and we’ll store it securely in your browser.
        </p>
      </motion.section>

      <motion.form
        onSubmit={handleSubmit}
        custom={1}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeUp}
        className="space-y-6"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium">
              Name
            </label>
            <Input
              id="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your full name"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="subject" className="block text-sm font-medium">
            Subject
          </label>
          <Input
            id="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="Subject of your message"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="message" className="block text-sm font-medium">
            Message
          </label>
          <Textarea
            id="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Write your message here..."
            rows={6}
            required
          />
        </div>

        <Button type="submit" className="mt-4">
          Save Message
        </Button>

        {responseMsg && (
          <p className="text-sm mt-2 text-muted-foreground">{responseMsg}</p>
        )}
      </motion.form>
    </main>
  );
}
