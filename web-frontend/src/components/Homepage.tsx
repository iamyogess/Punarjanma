import React from "react";
import HeroSection from "./HeroSection";
import PricingCards from "./pricingCard/pricing-card";
import Features from "./Features";
import FAQs from "./FAQs";

const Homepage = () => {
  return (
    <>
      <HeroSection />
      <Features />
      <PricingCards />
      <FAQs />
    </>
  );
};

export default Homepage;
