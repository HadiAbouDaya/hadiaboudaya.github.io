"use client";

import Link from "next/link";
import Image from "next/image";
import { m } from "framer-motion";
import { X } from "lucide-react";
import { NAV_LINKS } from "@/data/navigation";
import { SPRING } from "@/lib/motion";

interface MobileMenuProps {
  pathname: string;
  onClose: () => void;
}

export function MobileMenu({ pathname, onClose }: MobileMenuProps) {
  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] bg-black/40 dark:bg-black/60 backdrop-blur-sm md:hidden"
      onClick={onClose}
    >
      <m.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={SPRING.snappy}
        className="absolute right-0 top-0 bottom-0 w-72 bg-surface shadow-overlay"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-line">
          <Image
              src="/Media/branding/logo.webp"
              alt="Hadi Abou Daya logo"
              width={32}
              height={32}
              className="rounded-full"
            />
          <button
            onClick={onClose}
            className="p-2 rounded-control text-fg-mid hover:text-fg transition-colors"
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
              className={`px-4 py-3 rounded-control text-sm font-medium transition-colors ${
                pathname === link.href || pathname.startsWith(link.href + "/")
                  ? "text-primary-600 bg-primary-500/10 dark:text-primary-400"
                  : "text-fg-mid hover:text-fg hover:bg-surface-raised"
              }`}
            >
              {link.label}
            </Link>
          ))}

        </nav>
      </m.div>
    </m.div>
  );
}
