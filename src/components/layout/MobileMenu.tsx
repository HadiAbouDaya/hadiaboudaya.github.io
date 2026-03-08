"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { NAV_LINKS } from "@/data/navigation";

interface MobileMenuProps {
  pathname: string;
  onClose: () => void;
}

export function MobileMenu({ pathname, onClose }: MobileMenuProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] bg-black/40 dark:bg-black/60 backdrop-blur-sm md:hidden"
      onClick={onClose}
    >
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="absolute right-0 top-0 bottom-0 w-72 bg-white dark:bg-slate-900 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
          <span className="text-lg font-bold text-primary-600 dark:text-primary-400">HA</span>
          <button
            onClick={onClose}
            className="p-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex flex-col p-4 gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                pathname === link.href || pathname.startsWith(link.href + "/")
                  ? "text-primary-600 bg-primary-50 dark:text-primary-400 dark:bg-primary-900/30"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800"
              }`}
            >
              {link.label}
            </Link>
          ))}

        </nav>
      </motion.div>
    </motion.div>
  );
}
