'use client';

import {
  HeroSection,
  ScreenshotsSection,
  HowItWorksSection,
  FeaturesSection,
  UseCasesSection,
  TestimonialsSection,
  PricingSection,
  FAQSection,
  BenefitsSection,
  CTASection,
  Footer,
} from '@/components/landing';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg">
      <HeroSection />
      <ScreenshotsSection />
      <HowItWorksSection />
      <FeaturesSection />
      <UseCasesSection />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />
      <BenefitsSection />
      <CTASection />
      <Footer />
    </div>
  );
}
