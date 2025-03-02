"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Code2, Zap, Shield, Sparkles, Github, Search, Tags, PlayCircle, Database, Copy, Check } from "lucide-react";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { TracingBeam } from "@/components/ui/tracing-beam";
import { SparklesCore } from "@/components/ui/sparkles";
import { CardHoverEffect } from "@/components/ui/card-hover-effect";
import { useState } from "react";
import { PinContainer } from "@/components/ui/3d-pin";
import { HeroHighlight, Highlight } from "@/components/ui/hero-highlight";
import { FlipWords } from "@/components/ui/flip-words";
import { ShinyButton } from "@/components/magicui/shiny-button";
import { ReachOutDock } from "@/components/landingPage/Dock";
import { HeroSection } from "@/components/landingPage/HeroSection";
import { FeaturesSection } from "@/components/landingPage/FeaturesSection";
import { BenefitsSection } from "@/components/landingPage/BenefitsSection";
import { CTASection } from "@/components/landingPage/CTASection";
import { NavigationBar } from "@/components/landingPage/NavigationBar";

const features = [
  {
    title: "Smart Code Storage",
    description: "Store and manage your code snippets with intelligent organization and versioning.",
    icon: Database,
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    title: "Lightning Fast Search",
    description: "Find any snippet instantly with powerful search and filtering capabilities.",
    icon: Search,
    gradient: "from-purple-500 to-pink-500",
  },
  {
    title: "Tag Organization",
    description: "Categorize and organize your snippets with customizable tags and collections.",
    icon: Tags,
    gradient: "from-orange-500 to-red-500",
  },
  {
    title: "Live Preview",
    description: "Test and preview your code snippets in real-time with an interactive playground.",
    icon: PlayCircle,
    gradient: "from-green-500 to-emerald-500",
  },
];

const benefits = [
  {
    title: "Never Lose Code Again",
    description: "Keep all your valuable code snippets organized and easily accessible.",
  },
  {
    title: "Boost Productivity",
    description: "Save time by quickly finding and reusing your most-used code snippets.",
  },
  {
    title: "Work Offline",
    description: "Access your snippets anytime with secure local storage using IndexedDB.",
  },
  {
    title: "Streamlined Workflow",
    description: "Integrate snippets seamlessly into your development process.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
      {/* Responsive container with proper padding */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation */}
        <NavigationBar />

        {/* Main content wrapper with responsive spacing */}
        <main className="relative z-10 space-y-24 md:space-y-32 lg:space-y-40">
          {/* Hero Section */}
          <div className="pt-20 sm:pt-24 md:pt-32">
            <HeroSection />
          </div>

          {/* Features Section */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-purple-500/5 to-black/0 blur-3xl -z-10" />
            <FeaturesSection features={features} />
          </div>

          {/* Benefits Section */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-pink-500/5 to-black/0 blur-3xl -z-10" />
            <BenefitsSection benefits={benefits} />
          </div>

          {/* CTA Section */}
          <div className="relative pb-20 sm:pb-24 md:pb-32">
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
