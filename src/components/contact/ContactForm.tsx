"use client";

import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Send, CheckCircle, AlertCircle } from "lucide-react";
import { trackEvent, EVENTS } from "@/lib/analytics";

const FORMSPREE_URL = "https://formspree.io/f/myknzbav";

export function ContactForm() {
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch(FORMSPREE_URL, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });
      const success = res.ok;
      setStatus(success ? "success" : "error");
      trackEvent(EVENTS.CONTACT_FORM_SUBMITTED, { success });
    } catch {
      setStatus("error");
      trackEvent(EVENTS.CONTACT_FORM_SUBMITTED, { success: false });
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <CheckCircle className="w-12 h-12 text-emerald-500 mb-4" />
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Message Sent!</h3>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          Thanks for reaching out. I&apos;ll get back to you soon.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-4 text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
        >
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow"
          placeholder="Your name"
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
        >
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow resize-none"
          placeholder="Tell me about your project..."
        />
      </div>

      {status === "error" && (
        <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
          <AlertCircle className="w-4 h-4" />
          Something went wrong. Please try again or email me directly.
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
