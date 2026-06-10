"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, Search } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { NAV_LINKS } from "@/data/navigation";
import { MobileMenu } from "./MobileMenu";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { trackEvent, EVENTS } from "@/lib/analytics";
import type { BlogSearchPost } from "@/types";

const SearchDialog = dynamic(
  () => import("@/components/ui/SearchDialog").then((mod) => mod.SearchDialog),
  { ssr: false }
);

interface NavbarProps {
  blogPosts: BlogSearchPost[];
}

export function Navbar({ blogPosts }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isMac, setIsMac] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const platform = navigator.platform || navigator.userAgent;
    setIsMac(/mac|iphone|ipad|ipod/i.test(platform));
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((o) => !o);
      }
      if (e.key === "Escape") setSearchOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 border-b border-transparent transition-all duration-500 ${
          isScrolled ? "glass-2" : "bg-transparent"
        }`}
      >
        <nav className="container-main flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="hover:opacity-80 transition-opacity"
          >
            <Image
              src="/Media/branding/logo.webp"
              alt="Hadi Abou Daya logo"
              width={40}
              height={40}
              className="rounded-full"
              priority
            />
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-control text-sm font-medium transition-colors ${
                  pathname === link.href || pathname.startsWith(link.href + "/")
                    ? "text-primary-600 bg-primary-500/10 dark:text-primary-400"
                    : "text-fg-mid hover:text-fg hover:bg-surface-raised"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={() => setSearchOpen(true)}
              className="ml-2 flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-control border border-line bg-surface-raised/50 text-sm text-fg-mid hover:text-fg hover:border-primary-500/30 transition-colors"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
              <kbd className="inline-flex items-center justify-center px-1.5 py-0.5 rounded font-mono text-[10px] text-fg-lo border border-line bg-surface">
                {isMac ? "⌘K" : "Ctrl K"}
              </kbd>
            </button>
            <ThemeToggle />
          </div>

          <div className="flex items-center gap-1 md:hidden">
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 rounded-control text-fg-mid hover:text-fg transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
            <ThemeToggle />
            <button
              onClick={() => { setIsMobileOpen(true); trackEvent(EVENTS.MOBILE_MENU_TOGGLED, { opened: true }); }}
              className="p-2 rounded-control text-fg-mid hover:text-fg transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </nav>
      </header>

      {searchOpen && (
        <SearchDialog
          open={searchOpen}
          onClose={() => setSearchOpen(false)}
          blogPosts={blogPosts}
        />
      )}

      <AnimatePresence>
        {isMobileOpen && (
          <MobileMenu
            pathname={pathname}
            onClose={() => { setIsMobileOpen(false); trackEvent(EVENTS.MOBILE_MENU_TOGGLED, { opened: false }); }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
