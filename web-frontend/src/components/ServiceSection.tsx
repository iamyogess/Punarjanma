// app/services/page.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, Variants } from "framer-motion";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: custom * 0.2, duration: 0.6, ease: "easeInOut" },
  }),
};

export default function ServicesPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-12 space-y-12">
      <motion.section
        custom={0}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeUp}
      >
        <h1 className="text-4xl font-bold tracking-tight">Our Services</h1>
        <p className="mt-4 text-muted-foreground text-lg">
          We offer a range of educational services tailored to empower both
          incarcerated individuals and independent learners.
        </p>
      </motion.section>

      <motion.section
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {[...Array(2)].map((_, i) => (
          <motion.div key={i} custom={i + 1} variants={fadeUp}>
            {i === 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">
                    Prisoner Learning Solutions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-muted-foreground">
                  <ul className="list-disc list-inside space-y-1">
                    <li>Offline-ready education modules</li>
                    <li>Secure content access with role-based permissions</li>
                    <li>Mentorship and guided learning paths</li>
                    <li>Limited UI for restricted environments</li>
                    <li>Admin dashboard for instructors and institutions</li>
                  </ul>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">
                    Self-Learning Platform
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-muted-foreground">
                  <ul className="list-disc list-inside space-y-1">
                    <li>Skill-based interactive courses</li>
                    <li>Progress tracking and certification</li>
                    <li>AI-powered course recommendations</li>
                    <li>Q&A forums and peer discussions</li>
                    <li>Gamified learning and reward system</li>
                  </ul>
                </CardContent>
              </Card>
            )}
          </motion.div>
        ))}
      </motion.section>

      <motion.section
        custom={3}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeUp}
      >
        <h2 className="text-2xl font-semibold mb-4">
          Customizable Services for Institutions
        </h2>
        <p className="text-muted-foreground mb-4">
          Educational institutions, NGOs, and government bodies can collaborate
          with us to customize the platform to their needs.
        </p>
        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
          <li>Custom course creation and curriculum integration</li>
          <li>Secure user onboarding and management</li>
          <li>Analytics dashboard for student progress</li>
          <li>Multi-language support and accessibility</li>
        </ul>
      </motion.section>
    </main>
  );
}
