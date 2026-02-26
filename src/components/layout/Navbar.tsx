"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Download } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { NAV_LINKS } from "@/data/navigation";
import { MobileMenu } from "./MobileMenu";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "glass shadow-sm" : "bg-transparent"
        }`}
      >
        <nav className="container-main flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="text-xl font-bold text-primary-600 hover:text-primary-700 transition-colors"
          >
            HA
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === link.href || pathname.startsWith(link.href + "/")
                    ? "text-primary-600 bg-primary-50"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <a
              href="/Media/resume/Hadi_Abou_Daya_CV.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Download CV
            </a>
          </div>

          <button
            onClick={() => setIsMobileOpen(true)}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {isMobileOpen && (
          <MobileMenu
            pathname={pathname}
            onClose={() => setIsMobileOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
