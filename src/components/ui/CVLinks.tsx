import { Download } from "lucide-react";
import { CV_FILES } from "@/data/profile";

export function CVLinks({ className = "" }: { className?: string }) {
  return <div className={`flex flex-wrap items-center gap-x-5 gap-y-2 text-sm ${className}`} aria-label="Download CV">
    {CV_FILES.map(file => <a key={file.language} href={file.href} hrefLang={file.language} type="application/pdf" download className="inline-flex items-center gap-1.5 underline underline-offset-4 decoration-current/40 hover:decoration-current">
      <Download className="h-3.5 w-3.5" aria-hidden="true" />{file.label}<span className="sr-only"> (PDF)</span>
    </a>)}
  </div>;
}
