"use client";

import { motion, Variants } from "framer-motion";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: custom * 0.2, duration: 0.6, ease: "easeInOut" },
  }),
};

export default function AboutSection() {
  const sections = [
    {
      title: "About Our Platform",
      content: (
        <p className="text-muted-foreground text-lg">
          Empowering Education Beyond Boundaries
        </p>
      ),
    },
    {
      title: "Why We Built This",
      content: (
        <>
          <p className="text-muted-foreground">
            Education can transform lives—but access is often unequal. We
            believe everyone deserves a second chance and the opportunity to
            grow, no matter their background or circumstance.
          </p>
          <ul className="mt-4 list-disc list-inside space-y-1 text-muted-foreground">
            <li>Rehabilitation through education for prisoners</li>
            <li>Flexible self-learning tools for individuals worldwide</li>
          </ul>
        </>
      ),
    },
    {
      title: "Features for Prisoner Learning",
      content: (
        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
          <li>Offline-ready modules</li>
          <li>Controlled access and usage monitoring</li>
          <li>Mentorship and assessment features</li>
          <li>Secure and minimal UI for limited access devices</li>
        </ul>
      ),
    },
    {
      title: "Features for Self-Learners",
      content: (
        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
          <li>Skill-based course tracking</li>
          <li>Progress analytics and certifications</li>
          <li>Peer discussion and Q&A system</li>
          <li>AI-powered content recommendations (upcoming)</li>
        </ul>
      ),
    },
    {
      title: "Our Vision",
      content: (
        <>
          <p className="text-muted-foreground mb-2">
            We envision a platform where:
          </p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li>A prisoner can become a programmer.</li>
            <li>A self-learner can become a software engineer.</li>
            <li>A curious mind can never be held back.</li>
          </ul>
          <p className="mt-4 font-semibold">
            Education should be a right, not a privilege.
          </p>
        </>
      ),
    },
  ];

  return (
    <main className="max-w-4xl mx-auto px-4 py-12 space-y-10">
      {sections.map((section, i) => (
        <motion.section
          key={i}
          custom={i}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
        >
          <h2 className="text-2xl font-semibold mb-2">{section.title}</h2>
          {section.content}
        </motion.section>
      ))}
    </main>
  );
}
