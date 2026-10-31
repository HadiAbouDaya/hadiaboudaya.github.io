import { DEFAULT_OPEN_GRAPH, DEFAULT_TWITTER } from "@/lib/metadata";
import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { breadcrumbJsonLd, serializeJsonLd } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy policy for hadi.aboudaya.com. How personal data is collected, used, and protected.",
  alternates: { canonical: "/privacy/" },
  twitter: DEFAULT_TWITTER,
  openGraph: { ...DEFAULT_OPEN_GRAPH, url: "/privacy/" },
};

export default function PrivacyPage() {
  return (
    <div className="section-padding pt-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(
            breadcrumbJsonLd([{ name: "Privacy Policy", href: "/privacy" }])
          ),
        }}
      />
      <div className="container-main max-w-3xl">
        <SectionHeading title="Privacy Policy" />

        <div className="prose prose-slate dark:prose-invert lg:prose-lg prose-headings:text-fg">
          <p className="text-sm text-fg-lo">
            Last updated: October 19, 2026
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
            When analytics is configured, this site sends selected usage events
            to PostHog: professional page paths, navigation and filter actions,
            search result counts, and article reading milestones. Events may
            include browser and device information and a temporary, in-memory
            identifier. They are used to understand and improve the site.
          </p>
          <p>
            Automatic interaction capture, session recording, heatmaps, and
            user profiles are disabled. Contact form values and raw search
            queries are excluded from analytics. Page URL query strings and
            fragments are omitted. The personal page is excluded, including
            when reached through client navigation. The analytics SDK is not
            initialized on a direct visit to that page.
          </p>
          <p>
            Analytics requests still reach a third-party service, which receives
            network information needed to handle them. This is not a promise
            of complete anonymity. The site asks PostHog not to use IP addresses
            for geolocation and respects the browser&apos;s Do Not Track setting.
            See{" "}
            <a href="https://posthog.com/privacy" target="_blank" rel="noopener noreferrer">
              PostHog&apos;s privacy policy
            </a>{" "}
            for its processing practices.
          </p>

          <h3>Local Storage</h3>
          <p>
            Your theme preference (light or dark mode) is stored in your
            browser&apos;s localStorage to remember the appearance you choose.
            When analytics is configured, a theme-toggle event may also include
            the selected theme.
          </p>

          <h3>Cookies</h3>
          <p>
            This site configures analytics with memory-only storage and disables
            analytics persistence, so the analytics integration does not set
            tracking cookies or retain its identifier in localStorage or
            sessionStorage. It does not include advertising networks. External
            services you choose to visit have their own storage and privacy
            practices.
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
            their data retention policy. Usage events are processed by PostHog
            under the site&apos;s project settings. A temporary identifier in
            browser memory does not establish a server-side retention period;
            contact the address below with a retention or deletion request.
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
