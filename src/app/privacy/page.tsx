import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { breadcrumbJsonLd } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy policy for hadi.aboudaya.com. How personal data is collected, used, and protected.",
  alternates: { canonical: "/privacy/" },
  openGraph: { url: "/privacy/" },
};

export default function PrivacyPage() {
  return (
    <div className="section-padding pt-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([{ name: "Privacy Policy", href: "/privacy" }])
          ),
        }}
      />
      <div className="container-main max-w-3xl">
        <SectionHeading title="Privacy Policy" />

        <div className="prose prose-slate dark:prose-invert lg:prose-lg prose-headings:text-slate-900 dark:prose-headings:text-white">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Last updated: April 2026
          </p>

          <p>
            This privacy policy explains how hadi.aboudaya.com collects, uses,
            and protects your personal information.
          </p>

          <h2>Data Collection</h2>

          <h3>Contact Form</h3>
          <p>
            When you submit the contact form, your name, email address, and
            message are collected and processed by{" "}
            <a href="https://formspree.io" target="_blank" rel="noopener noreferrer">
              Formspree
            </a>
            , a third-party form handling service. This data is used solely to
            respond to your inquiry. Formspree&apos;s privacy policy governs how
            they store and process this data.
          </p>

          <h3>Analytics</h3>
          <p>
            This site uses PostHog for anonymous usage analytics. PostHog
            collects aggregated data about page views, navigation patterns, and
            device types to help improve the site experience. No personally
            identifiable information is collected through analytics.
          </p>

          <h3>Local Storage</h3>
          <p>
            Your theme preference (light or dark mode) is stored in your
            browser&apos;s localStorage. This data never leaves your device.
          </p>

          <h3>Cookies</h3>
          <p>
            This site does not use tracking cookies. No advertising networks or
            third-party trackers are present.
          </p>

          <h2>Your Rights</h2>
          <p>
            Under the General Data Protection Regulation (GDPR), you have the
            right to:
          </p>
          <ul>
            <li>Access the personal data held about you</li>
            <li>Request correction or deletion of your data</li>
            <li>Object to processing of your data</li>
            <li>Request data portability</li>
          </ul>
          <p>
            To exercise any of these rights, contact{" "}
            <a href="mailto:hadi.aboudaya@hotmail.com">
              hadi.aboudaya@hotmail.com
            </a>
            .
          </p>

          <h2>Data Retention</h2>
          <p>
            Contact form submissions are retained by Formspree according to
            their data retention policy. Analytics data is aggregated and does
            not contain personally identifiable information.
          </p>

          <h2>Changes to This Policy</h2>
          <p>
            This policy may be updated periodically. The &ldquo;last
            updated&rdquo; date at the top reflects the most recent revision.
          </p>

          <h2>Contact</h2>
          <p>
            For privacy-related questions, reach out at{" "}
            <a href="mailto:hadi.aboudaya@hotmail.com">
              hadi.aboudaya@hotmail.com
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
