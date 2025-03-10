"use client";

import { motion } from "framer-motion";
import { HeroHighlight, Highlight } from "@/components/ui/hero-highlight";

export function BenefitsSection() {
  return (
    <section className="py-8 lg:py-12 pt-24 sm:pt-0 relative overflow-hidden">
        <HeroHighlight>
          <motion.h1
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: [20, -5, 0],
            }}
            transition={{
              duration: 0.5,
              ease: [0.4, 0.0, 0.2, 1],
            }}
            className="text-2xl px-4 md:text-4xl lg:text-5xl font-bold text-neutral-700 dark:text-white w-full leading-relaxed lg:leading-snug text-center mx-auto "
          >
            A snippet forgotten is a snippet rewritten. The same struggle repeates{" "}
            <Highlight className="text-black dark:text-white">again, and again, and again...</Highlight>
          </motion.h1>
        </HeroHighlight>
      </section>
  );
} 