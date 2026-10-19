"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, Search } from "lucide-react";
import { NAV_LINKS } from "@/data/navigation";
import { MobileMenu } from "./MobileMenu";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { trackEvent, EVENTS } from "@/lib/analytics";

const SearchDialog = dynamic(
  () => import("@/components/ui/SearchDialog").then((mod) => mod.SearchDialog),
  { ssr: false }
);

interface NavbarProps {
  contentRevision: string;
}

export function Navbar(props: NavbarProps) {
  const pathname = usePathname();
  const previous = useRef(pathname);
  useEffect(() => {
    if (previous.current === pathname) return;
    previous.current = pathname;
    const frame = requestAnimationFrame(() => { if (!window.location.hash) document.getElementById("main-content")?.focus({ preventScroll: true }); });
    return () => cancelAnimationFrame(frame);
  }, [pathname]);
  return pathname === "/luna" || pathname.startsWith("/luna/") ? null : <ProfessionalNavbar key={pathname} {...props} />;
}

function ProfessionalNavbar({ contentRevision }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchMounted, setSearchMounted] = useState(false);
  const pathname = usePathname();
  const solidHeader = ["/experience", "/contact"].some(path => pathname === path || pathname.startsWith(`${path}/`));

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchMounted(true);
        setSearchOpen((o) => !o);
      }
      if (e.key === "Escape") setSearchOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (pathname === "/luna" || pathname.startsWith("/luna/")) {
    return null;
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 border-b border-transparent transition-all duration-500 ${pathname === "/" && !isScrolled ? "dark" : ""} ${
          isScrolled ? (solidHeader ? "bg-surface border-line" : "glass-2") : "bg-transparent"
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

          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-2 py-2 rounded-control text-sm font-medium transition-colors ${
                  pathname === link.href || pathname.startsWith(link.href + "/")
                    ? "text-primary-600 bg-primary-500/10 dark:text-primary-400"
                    : "text-fg-mid hover:text-fg hover:bg-surface-raised"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={() => { setSearchMounted(true); setSearchOpen(true); }}
              className="ml-2 flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-control border border-line bg-surface-raised/50 text-sm text-fg-mid hover:text-fg hover:border-primary-500/30 transition-colors"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
              <kbd className="inline-flex items-center justify-center px-1.5 py-0.5 rounded font-mono text-[10px] text-fg-lo border border-line bg-surface">
                Ctrl / ⌘ K
              </kbd>
            </button>
            <ThemeToggle />
          </div>

          <div className="flex items-center gap-1 lg:hidden">
            <button
              onClick={() => { setSearchMounted(true); setSearchOpen(true); }}
              className="inline-flex min-h-11 min-w-11 items-center justify-center p-2 rounded-control text-fg-mid hover:text-fg transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
            <ThemeToggle />
            <button
              onClick={() => { setIsMobileOpen(true); trackEvent(EVENTS.MOBILE_MENU_TOGGLED, { opened: true }); }}
              className="inline-flex min-h-11 min-w-11 items-center justify-center p-2 rounded-control text-fg-mid hover:text-fg transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </nav>
      </header>

      {searchMounted && (
        <SearchDialog
          open={searchOpen}
          onClose={() => setSearchOpen(false)}
          contentRevision={contentRevision}
        />
      )}

      <MobileMenu
        open={isMobileOpen}
        pathname={pathname}
        onClose={() => { setIsMobileOpen(false); trackEvent(EVENTS.MOBILE_MENU_TOGGLED, { opened: false }); }}
      />
    </>
  );
}
