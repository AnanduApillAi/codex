"use client";

import { HeroSection } from "@/components/landingPage/HeroSection";
import { FeaturesSection } from "@/components/landingPage/FeaturesSection";
import { BenefitsSection } from "@/components/landingPage/BenefitsSection";
import { CTASection } from "@/components/landingPage/CTASection";
import { NavigationBar } from "@/components/landingPage/NavigationBar";


export default function Home() {
  return (
    <div className="min-h-screen bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
      {/* Responsive container with proper padding */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation */}
        <NavigationBar />

        {/* Main content wrapper with responsive spacing */}
        <main className="relative z-10 space-y-12 md:space-y-16 lg:space-y-24">
          {/* Hero Section */}
          <div className="pt-20 sm:pt-24 md:pt-32">
            <HeroSection />
          </div>

          {/* Features Section */}
            <FeaturesSection />

          {/* Benefits Section */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-pink-500/5 to-black/0 blur-3xl -z-10" />
            <BenefitsSection/>
          </div>

          {/* CTA Section */}
          <div className="relative pb-12">
            <div className="absolute inset-0 bg-gradient-to-t from-purple-500/10 to-transparent blur-3xl -z-10" />
            <CTASection />
          </div>
        </main>
      </div>

      {/* Background decorative elements */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-grid-white/[0.02]" />
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-b from-purple-500/30 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-t from-pink-500/30 blur-3xl" />
      </div>
    </div>
  );
}
