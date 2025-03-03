"use client";

import { Button } from "@/components/ui/button";
import { motion, useScroll } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";

export function NavigationBar() {
  const [hasScrolled, setHasScrolled] = useState(false);
  const router = useRouter();
  // Update scroll state
  useEffect(() => {
    const updateScrollState = () => {
      setHasScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", updateScrollState);
    return () => window.removeEventListener("scroll", updateScrollState);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
      hasScrolled ? "bg-black/20 backdrop-blur-md" : ""
    }`}>
      <motion.div 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mx-auto px-4 sm:px-12 md:px-20"
      >
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <motion.span 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
            className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 cursor-pointer"
            onClick={() => router.push('/')}
          >
            CodEX
          </motion.span>

          {/* Navigation Links */}
          <div className="flex items-center gap-4">
            {/* GitHub Link */}
            <motion.div
              
            >
              <Link 
                href="https://github.com/AnanduApillAi/codex"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button 
                  size="sm"
                  variant={"outline"}
                  className="text-neutral-300 rounded-full px-4 flex items-center gap-2"
                >
                  <GitHubLogoIcon className="w-5 h-5" />
                  <span className="hidden sm:inline">View on GitHub</span>
                </Button>
              </Link>
            </motion.div>

            {/* Dashboard Link */}
            <motion.div
              
            >
              <Link href="/dashboard">
                <Button 
                  className="relative overflow-hidden rounded-full px-6 py-2 group border border-neutral-700/50"
                >
                  <span className="relative text-neutral-300 group-hover:text-white transition-colors">
                    Dashboard
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10 group-hover:opacity-100 opacity-0 transition-opacity" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Gradient Border */}
      <div className={`h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-800 to-transparent transition-opacity duration-300 ${
        hasScrolled ? "opacity-100" : "opacity-0"
      }`} />
    </nav>
  );
} 