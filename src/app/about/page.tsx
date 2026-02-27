import type { Metadata } from "next";
import { BioSection } from "@/components/about/BioSection";
import { KeyFacts } from "@/components/about/KeyFacts";
import { JourneySection } from "@/components/about/JourneySection";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Hadi Abou Daya, AI/ML engineer, consultant, and lifelong learner based in Paris.",
};

export default function AboutPage() {
  return (
    <div className="section-padding pt-24">
      <div className="container-main">
        <BioSection />
        <KeyFacts />
        <JourneySection />
      </div>
    </div>
  );
}
