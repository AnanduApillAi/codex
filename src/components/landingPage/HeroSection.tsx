"use client";

import { motion } from "framer-motion";
import { ArrowRight, Shield, Zap, } from "lucide-react";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { ShinyButton } from "../magicui/shiny-button";


export function HeroSection() {
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

  return (
    <section className="min-h-screen pt-12 md:pt-24 lg:pt-16 px-4 sm:px-6 md:px-10">
        <div className="relative flex flex-col lg:flex-row items-center justify-center gap-24  lg:gap-12">
          {/* Left Content Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-1 w-full lg:max-w-xl relative z-10"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-6 md:mb-10"
            >
              <span className="inline-block px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs md:text-sm font-medium">
                Organize Your Code Better
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 leading-tight mb-6 md:mb-8"
            >
              Your Personal
              <br />
              Code Vault
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-base md:text-lg text-neutral-300 mb-8 md:mb-10"
            >
              Never lose a snippet again. Store, edit, and manage your code efficiently with powerful organization tools.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 mb-10 md:mb-16"
            >
              <ShinyButton className="w-full sm:w-auto text-sm md:text-base ">
                Start Saving Snippets <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5" />
              </ShinyButton>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6"
            >
              <div className="flex items-center gap-3 md:gap-4 p-4 md:p-5 rounded-xl bg-neutral-900/50 backdrop-blur-sm border border-neutral-800">
                <div className="p-1.5 md:p-2 rounded-lg bg-purple-500/10">
                  <Shield className="w-5 h-5 md:w-6 md:h-6 text-purple-400" />
                </div>
                <div>
                  <div className="font-semibold text-white text-sm md:text-base">Secure Storage</div>
                  <div className="text-xs md:text-sm text-neutral-400">Local-first approach</div>
                </div>
              </div>
              <div className="flex items-center gap-3 md:gap-4 p-4 md:p-5 rounded-xl bg-neutral-900/50 backdrop-blur-sm border border-neutral-800">
                <div className="p-1.5 md:p-2 rounded-lg bg-pink-500/10">
                  <Zap className="w-5 h-5 md:w-6 md:h-6 text-pink-400" />
                </div>
                <div>
                  <div className="font-semibold text-white text-sm md:text-base">Instant Access</div>
                  <div className="text-xs md:text-sm text-neutral-400">Lightning fast search</div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Preview Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-1 w-full lg:w-auto max-w-2xl px-0 sm:px-4"
          >
            <div className="relative max-w-lg mx-auto z-50">
              {/* Code Preview Card */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="rounded-xl bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 overflow-hidden"
              >
                {/* Card Header */}
                <div className="flex items-center justify-between px-3 md:px-4 py-2 md:py-3 border-b border-neutral-800">
                  <div className="flex items-center gap-1.5 md:gap-2">
                    <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-red-500" />
                    <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-yellow-500" />
                    <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-green-500" />
                  </div>
                  <div className="flex items-center gap-1.5 md:gap-2 overflow-x-auto">
                    {tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-1.5 md:px-2 py-0.5 md:py-1 rounded-md bg-neutral-800 text-neutral-400 text-[10px] md:text-xs whitespace-nowrap"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Code Content */}
                <pre className="p-3 md:p-4 text-xs md:text-sm text-neutral-300 font-mono overflow-x-auto">
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
        </div>
        <BackgroundBeams />
      </section>
  );
} 