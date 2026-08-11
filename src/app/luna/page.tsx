import type { Metadata } from "next";
import { LunaExperience } from "@/components/luna/LunaExperience";
import "./luna.css";

export const metadata: Metadata = {
  title: "For Luna",
  description: "A private birthday page for Luna.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default function LunaPage() {
  return <LunaExperience />;
}
