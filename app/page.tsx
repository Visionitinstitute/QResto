import { createClient } from "@/lib/supabase/server";
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

export const dynamic = "force-dynamic";

interface HotelData {
  id: string;
  name: string;
  slug: string;
  address: string | null;
  phone: string | null;
  logo_url: string | null;
}

export default async function Home() {
  let hotels: HotelData[] = [];

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("hotels")
      .select("id, name, slug, address, phone, logo_url")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (data && data.length > 0) {
      hotels = data;
    }
  } catch (error) {
    console.error("Failed to load hotels:", error);
  }

  if (hotels.length === 0) {
    hotels = [
      {
        id: "venue-1",
        name: "Royal Spice Restaurant & Cafe",
        slug: "royal-spice",
        address: "102 MG Road, Connaught Place, New Delhi",
        phone: "+91 98765 43210",
        logo_url: null,
      },
    ];
  }

  return (
    <div className="min-h-screen bg-white text-zinc-900 flex flex-col font-sans antialiased selection:bg-orange-500 selection:text-white">
      {/* 1. Sticky Modern Navigation */}
      <LandingNavbar />

      <main className="flex-1">
        {/* 2. Hero Section with Interactive Phone & Scannable QR Mockup */}
        <HeroSection hotels={hotels} />

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
