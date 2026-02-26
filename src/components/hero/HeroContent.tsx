"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Download, ArrowRight } from "lucide-react";

export function HeroContent() {
  return (
    <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white tracking-tight"
        style={{ textShadow: "0 2px 20px rgba(0,0,0,0.3)" }}
      >
        Hadi Abou Daya
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="mt-4 text-xl sm:text-2xl text-accent-400 font-medium"
      >
        AI/ML Engineer &amp; Consultant
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="mt-4 text-lg text-slate-300 max-w-xl mx-auto"
      >
        Building intelligent systems from edge to cloud
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
      >
        <Button href="/about" className="bg-white/10 border-2 border-white/30 text-white hover:bg-white/20 hover:border-white/50">
          <ArrowRight className="w-4 h-4" />
          About Me
        </Button>
        <Button
          href="/Media/resume/Hadi_Abou_Daya_CV.pdf"
          external
          variant="primary"
        >
          <Download className="w-4 h-4" />
          Download CV
        </Button>
      </motion.div>
    </div>
  );
}
