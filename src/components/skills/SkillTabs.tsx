"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { skills } from "@/data/skills";
import type { Skill } from "@/types";
import { cn } from "@/lib/utils";

const CATEGORIES = ["AI/ML", "Cloud & MLOps", "Software Engineering"] as const;

export function SkillTabs() {
  const [active, setActive] = useState<(typeof CATEGORIES)[number]>("AI/ML");

  const filtered = skills.filter((s) => s.category === active);

  return (
    <div>
      {/* Tab buttons */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={cn(
              "px-5 py-2.5 rounded-full text-sm font-medium transition-all",
              active === cat
                ? "bg-primary-600 text-white shadow-md"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Skill grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
        >
          {filtered.map((skill, i) => (
            <SkillTile key={skill.name} skill={skill} index={i} />
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function SkillTile({ skill, index }: { skill: Skill; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      className="group flex items-center gap-3 p-4 rounded-xl bg-white border border-slate-200 hover:border-primary-300 hover:shadow-md transition-all cursor-default"
    >
      <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600 font-bold text-sm group-hover:bg-primary-100 transition-colors">
        {skill.name.slice(0, 2).toUpperCase()}
      </div>
      <span className="text-sm font-medium text-slate-700">{skill.name}</span>
    </motion.div>
  );
}
