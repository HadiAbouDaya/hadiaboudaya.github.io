import type { CaseStudy } from "@/types";
import { formatMonth } from "./dates";

export function productAcquisitionSummary(story: CaseStudy): string {
  const outcome = story.acquisition;
  return outcome ? `Product acquired by ${outcome.buyer} in ${formatMonth(outcome.date, { month: "long" })}. ${outcome.continuation}` : "";
}
