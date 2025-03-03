"use client";

import { motion } from "framer-motion";
import { PinContainer } from "@/components/ui/3d-pin";
import { FlipWords } from "@/components/ui/flip-words";

export function FeaturesSection() {
  return (
    <section className="relative px-4 sm:px-6 md:px-10 pt-24 sm:pt-0" id="features">
        <div className="text-start mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 mb-4"
          >
            Powerful Features
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-neutral-300"
          >
            Everything you need to manage your code snippets <FlipWords  words={["efficiently", "effectively", "seamlessly", "smoothly"]} />
          </motion.p>
        </div>

        <div className="flex gap-y-16 gap-x-0 sm:justify-between justify-center flex-wrap">
          <PinContainer title="Code Organization" href="/dashboard" >
            <div className="flex basis-full flex-col p-4 tracking-tight text-slate-100/50 sm:basis-1/2 w-full sm:w-[20rem] h-[20rem]">
              <h3 className="max-w-xs !pb-2 !m-0 font-bold text-base text-slate-100">
                Smart Storage System
              </h3>
              <div className="text-base !m-0 !p-0 font-normal">
                <span className="text-slate-500">
                  Efficiently organize and manage your code snippets with intelligent categorization and instant search.
                </span>
              </div>
              <div className="flex flex-1 w-full rounded-lg mt-4 bg-gradient-to-br from-purple-500 via-pink-500 to-red-500" />
            </div>
          </PinContainer>

          <PinContainer title="Local First" href="/dashboard">
            <div className="flex basis-full flex-col p-4 tracking-tight text-slate-100/50 sm:basis-1/2 w-full sm:w-[20rem] h-[20rem]">
              <h3 className="max-w-xs !pb-2 !m-0 font-bold text-base text-slate-100">
                Secure Storage
              </h3>
              <div className="text-base !m-0 !p-0 font-normal">
                <span className="text-slate-500">
                  Your code stays private with our local-first approach using IndexedDB for secure offline access.
                </span>
              </div>
              <div className="flex flex-1 w-full rounded-lg mt-4 bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500" />
            </div>
          </PinContainer>

          <PinContainer title="Live Preview" href="/dashboard/playground">
            <div className="flex basis-full flex-col p-4 tracking-tight text-slate-100/50 sm:basis-1/2 w-full sm:w-[20rem] h-[20rem]">
              <h3 className="max-w-xs !pb-2 !m-0 font-bold text-base text-slate-100">
                Interactive Testing
              </h3>
              <div className="text-base !m-0 !p-0 font-normal">
                <span className="text-slate-500">
                  Test and preview your code snippets in real-time with our built-in interactive playground.
                </span>
              </div>
              <div className="flex flex-1 w-full rounded-lg mt-4 bg-gradient-to-br from-emerald-500 via-green-500 to-lime-500" />
            </div>
          </PinContainer>
        </div>
      </section>
  );
} 