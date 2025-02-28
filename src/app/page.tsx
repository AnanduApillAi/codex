"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Code2, Zap, Shield, Sparkles, Github, Search, Tags, PlayCircle, Database, Copy, Check } from "lucide-react";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { TracingBeam } from "@/components/ui/tracing-beam";
import { SparklesCore } from "@/components/ui/sparkles";
import { CardHoverEffect } from "@/components/ui/card-hover-effect";
import { useState } from "react";

const features = [
  {
    title: "Smart Code Storage",
    description: "Store and manage your code snippets with intelligent organization and versioning.",
    icon: Database,
  },
  {
    title: "Lightning Fast Search",
    description: "Find any snippet instantly with powerful search and filtering capabilities.",
    icon: Search,
  },
  {
    title: "Tag Organization",
    description: "Categorize and organize your snippets with customizable tags and collections.",
    icon: Tags,
  },
  {
    title: "Live Preview",
    description: "Test and preview your code snippets in real-time with an interactive playground.",
    icon: PlayCircle,
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

const codeExample = `// Example code snippet
function calculateFibonacci(n) {
  if (n <= 1) return n;
  
  let prev = 0;
  let current = 1;
  
  for (let i = 2; i <= n; i++) {
    const next = prev + current;
    prev = current;
    current = next;
  }
  
  return current;
}

// Usage
console.log(calculateFibonacci(10));`;

const tags = ["JavaScript", "Algorithm", "Math", "Function"];

export default function Home() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(codeExample);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-black/[0.96] antialiased bg-grid-white/[0.02]">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur-sm border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Codex
          </span>
          <div className="flex gap-4">
            <Button variant="ghost" className="text-neutral-300">Features</Button>
            <Button variant="ghost" className="text-neutral-300">Docs</Button>
            <Button variant="ghost" className="text-neutral-300">Pricing</Button>
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              Open App
            </Button>
          </div>
        </div>
      </nav>

      {/* Enhanced Hero Section */}
      <div className="min-h-screen relative flex flex-col lg:flex-row items-center justify-center overflow-hidden">
        {/* Left Content Side */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-1 p-8 lg:pl-20 relative z-10"
        >
          <div className="max-w-xl mx-auto lg:mx-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8 inline-block"
            >
              <span className="px-4 py-2 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-sm font-medium">
                Organize Your Code Better
              </span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl lg:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 leading-tight mb-6"
            >
              Your Personal
              <br />
              Code Vault
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-neutral-300 mb-8"
            >
              Never lose a snippet again. Store, edit, and manage your code efficiently with powerful organization tools.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                Start Saving Snippets <ArrowRight className="ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="border-neutral-700 text-neutral-300 hover:bg-neutral-800">
                <Github className="mr-2" /> View on GitHub
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-12 grid grid-cols-2 gap-4"
            >
              <div className="flex items-center gap-3 p-4 rounded-xl bg-neutral-900/50 backdrop-blur-sm border border-neutral-800">
                <div className="p-2 rounded-lg bg-purple-500/10">
                  <Shield className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <div className="font-semibold text-white">Secure Storage</div>
                  <div className="text-sm text-neutral-400">Local-first approach</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-neutral-900/50 backdrop-blur-sm border border-neutral-800">
                <div className="p-2 rounded-lg bg-pink-500/10">
                  <Zap className="w-6 h-6 text-pink-400" />
                </div>
                <div>
                  <div className="font-semibold text-white">Instant Access</div>
                  <div className="text-sm text-neutral-400">Lightning fast search</div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Right Preview Side */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-1 p-8 relative z-10 w-full lg:w-auto"
        >
          <div className="relative max-w-lg mx-auto">
            {/* Code Preview Card */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="rounded-xl bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 overflow-hidden"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="flex items-center gap-2">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 rounded-md bg-neutral-800 text-neutral-400 text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <button
                  onClick={handleCopy}
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                </button>
              </div>

              {/* Code Content */}
              <pre className="p-4 text-sm text-neutral-300 font-mono overflow-x-auto">
                <code>{codeExample}</code>
              </pre>
            </motion.div>

            {/* Floating Elements */}
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -top-6 -right-6 w-24 h-24 rounded-xl bg-purple-500/10 border border-purple-500/20 backdrop-blur-sm"
            />
            <motion.div
              animate={{
                y: [0, 10, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
              className="absolute -bottom-8 -left-8 w-20 h-20 rounded-lg bg-pink-500/10 border border-pink-500/20 backdrop-blur-sm"
            />
          </div>
        </motion.div>

        <BackgroundBeams />
      </div>

      {/* Features Section */}
      <section className="relative py-20" id="features">
        <TracingBeam>
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-4xl md:text-5xl font-bold text-center text-white mb-16">
              Everything You Need to Manage Code
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <CardHoverEffect key={index}>
                  <div className="p-8 rounded-xl bg-neutral-900/50 backdrop-blur-sm border border-neutral-800">
                    <feature.icon className="w-10 h-10 text-purple-500 mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-neutral-400">{feature.description}</p>
                  </div>
                </CardHoverEffect>
              ))}
            </div>
          </div>
        </TracingBeam>
      </section>

      {/* Benefits Section with Sparkles */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <SparklesCore
            id="tsparticlesfullpage"
            background="transparent"
            minSize={0.6}
            maxSize={1.4}
            particleDensity={100}
            className="w-full h-full"
            particleColor="#FFFFFF"
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-white mb-16">
            Why Choose Codex?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-6 rounded-xl bg-neutral-900/50 backdrop-blur-sm border border-neutral-800"
              >
                <h3 className="text-xl font-semibold text-white mb-2">{benefit.title}</h3>
                <p className="text-neutral-400">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
            Start Organizing Your Code Today
          </h2>
          <p className="text-xl text-neutral-300 mb-8 max-w-2xl mx-auto">
            Join thousands of developers who are already using Codex to keep their code snippets organized and accessible.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              Get Started Now <ArrowRight className="ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="border-neutral-700 text-neutral-300 hover:bg-neutral-800">
              View Documentation
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
