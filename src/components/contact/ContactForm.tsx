"use client";

import { useEffect, useRef, useState, FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Send, CheckCircle, AlertCircle } from "lucide-react";
import { trackEvent, EVENTS } from "@/lib/analytics";
import { SOCIAL_LINKS } from "@/data/social";

const FORMSPREE_URL = "https://formspree.io/f/myknzbav";

export function ContactForm() {
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [deliveryUnconfirmed, setDeliveryUnconfirmed] = useState(false);
  const requestRef = useRef<AbortController | null>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);
  const restoreFormFocus = useRef(false);

  useEffect(() => () => { requestRef.current?.abort(); }, []);
  useEffect(() => {
    if (status === "success") successRef.current?.focus();
    if (status === "error") errorRef.current?.focus();
    if (status === "idle" && restoreFormFocus.current) {
      restoreFormFocus.current = false;
      nameRef.current?.focus();
    }
  }, [status]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (requestRef.current) return;
    const form = e.currentTarget;
    for (const name of ["name", "message"]) {
      const field = form.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement;
      field.setCustomValidity(field.value.trim() ? "" : `Please enter ${name === "name" ? "your name" : "a message"}.`);
    }
    if (!form.reportValidity()) return;

    const request = new AbortController();
    requestRef.current = request;
    setStatus("sending");
    setDeliveryUnconfirmed(false);

    const formData = new FormData(form);
    // A stalled connection must not leave the form permanently disabled. Never retry automatically.
    const timeout = window.setTimeout(() => request.abort("timeout"), 20_000);

    try {
      const res = await fetch(FORMSPREE_URL, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
        signal: request.signal,
      });
      if (request.signal.aborted) return;
      const success = res.ok;
      setStatus(success ? "success" : "error");
      trackEvent(EVENTS.CONTACT_FORM_SUBMITTED, { success });
    } catch {
      // Navigation aborts are cleanup, not a failed submission in the next page.
      if (request.signal.aborted && request.signal.reason !== "timeout") return;
      setDeliveryUnconfirmed(true);
      setStatus("error");
      trackEvent(EVENTS.CONTACT_FORM_SUBMITTED, { success: false });
    } finally {
      window.clearTimeout(timeout);
      if (requestRef.current === request) requestRef.current = null;
    }
  }

  if (status === "success") {
    return (
      <div role="status" className="flex flex-col items-center justify-center py-12 text-center">
        <CheckCircle className="w-12 h-12 text-emerald-500 mb-4" />
        <h3 ref={successRef} tabIndex={-1} className="text-title text-fg">Message Sent!</h3>
        <p className="text-fg-mid mt-2">
          Thanks for reaching out. I&apos;ll get back to you soon.
        </p>
        <button
          onClick={() => { restoreFormFocus.current = true; setStatus("idle"); }}
          className="mt-4 text-sm text-primary-700 hover:text-primary-800 dark:text-primary-300 dark:hover:text-primary-200 font-medium"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form action={FORMSPREE_URL} method="post" onSubmit={handleSubmit} aria-busy={status === "sending"} className="space-y-6">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-fg-mid mb-1.5"
        >
          Name
        </label>
        <input
          type="text"
          ref={nameRef}
          id="name"
          name="name"
          autoComplete="name"
          disabled={status === "sending"}
          required
          onChange={(event) => event.currentTarget.setCustomValidity("")}
          className="w-full px-4 py-3 rounded-control border border-line bg-surface-raised text-fg placeholder-fg-lo focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/30 transition-colors duration-300"
          placeholder="Your name"
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-fg-mid mb-1.5"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          autoComplete="email"
          disabled={status === "sending"}
          required
          className="w-full px-4 py-3 rounded-control border border-line bg-surface-raised text-fg placeholder-fg-lo focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/30 transition-colors duration-300"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-fg-mid mb-1.5"
        >
          Message
        </label>
        <textarea
          id="message"
          name="message"
          disabled={status === "sending"}
          required
          rows={5}
          onChange={(event) => event.currentTarget.setCustomValidity("")}
          className="w-full px-4 py-3 rounded-control border border-line bg-surface-raised text-fg placeholder-fg-lo focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/30 transition-colors duration-300 resize-y min-h-40"
          placeholder="What would you like to improve, and what is getting in the way?"
        />
      </div>

      {status === "error" && (
        <div ref={errorRef} tabIndex={-1} role="alert" className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
          <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
          <p>
            {deliveryUnconfirmed ? "Delivery could not be confirmed. " : "Something went wrong. Please try again or "}
            <a href={`mailto:${SOCIAL_LINKS.email}`} className="underline underline-offset-2">{deliveryUnconfirmed ? "Email me directly" : "email me directly"}</a>.
          </p>
        </div>
      )}

      <Button
        type="submit"
        variant="primary"
        disabled={status === "sending"}
        className="w-full"
      >
        <Send className="w-4 h-4" />
        {status === "sending" ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}
