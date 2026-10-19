"use client";

import Link from "next/link";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { NAV_LINKS } from "@/data/navigation";
import { Modal } from "@/components/ui/Modal";

export function MobileMenu({ pathname, open, onClose }: { pathname: string; open: boolean; onClose: () => void }) {
  const first = useRef<HTMLAnchorElement>(null);
  const navigating = useRef(false);
  const router = useRouter();
  function close() { navigating.current = false; onClose(); }
  return <Modal open={open} onClose={close} label="Site navigation" initialFocusRef={first} restoreFocus={() => !navigating.current}
    className="ml-auto mr-0 my-0 h-svh max-h-none w-[min(24rem,100%)] rounded-none bg-surface text-fg p-6 border-l border-line">
    <div className="flex justify-between items-center mb-8"><span className="font-semibold">Explore</span><button type="button" onClick={close} aria-label="Close menu" className="p-2"><X /></button></div>
    <nav aria-label="Mobile navigation" className="flex flex-col gap-2">{NAV_LINKS.map((link, index) => <Link ref={index === 0 ? first : undefined} key={link.href} href={`${link.href}/`} aria-current={pathname.replace(/\/$/, "") === link.href ? "page" : undefined}
      className="px-4 py-3 text-lg rounded-control hover:bg-surface-raised aria-[current=page]:bg-primary-500/10"
      onClick={event => { event.preventDefault(); navigating.current = true; onClose(); router.push(`${link.href}/`); }}>{link.label}</Link>)}</nav>
  </Modal>;
}
