import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { StatsBanner } from "@/components/landing/StatsBanner";
import { KeyFeatures } from "@/components/landing/KeyFeatures";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { RestaurantBenefits } from "@/components/landing/RestaurantBenefits";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { CTASection } from "@/components/landing/CTASection";
import { LandingFooter } from "@/components/landing/LandingFooter";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 flex flex-col font-sans antialiased selection:bg-orange-500 selection:text-white">
      {/* 1. Sticky Modern Navigation */}
      <LandingNavbar />

      <main className="flex-1">
        {/* 2. Hero Section with Interactive Phone & Scannable QR Mockup */}
        <HeroSection />

        {/* 3. Operational Impact & Stats Banner */}
        <StatsBanner />

        {/* 4. Core Platform Capabilities & Key Features */}
        <KeyFeatures />

        {/* 5. 3-Step Seamless Operating Workflow */}
        <HowItWorks />

        {/* 6. Measurable Restaurant Benefits & Paper vs Digital Comparison */}
        <RestaurantBenefits />

        {/* 7. Verified Restaurant Owner Testimonials */}
        <TestimonialsSection />

        {/* 10. Transparent Pricing Plans with Monthly/Annual Toggle & FAQ */}
        <PricingSection />

        {/* 11. High-Impact Free Trial CTA */}
        <CTASection />
      </main>

      {/* 12. Modern Comprehensive Footer */}
      <LandingFooter />
    </div>
  );
}
