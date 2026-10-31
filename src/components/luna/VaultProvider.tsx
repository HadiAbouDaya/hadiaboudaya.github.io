"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { ArrowRight, KeyRound, LockKeyhole } from "lucide-react";
import { decryptVaultObject, validateManifest, validateVaultConfig, type VaultAsset, type VaultConfig, type VaultManifest } from "@/lib/luna-vault";
import styles from "./vault.module.css";

type VaultContextValue = {
  manifest: VaultManifest | null; busy: boolean; error: string;
  unlock: (password: string) => Promise<void>; lock: () => void;
  decryptAsset: (asset: VaultAsset, signal?: AbortSignal) => Promise<Blob>;
};
const VaultContext = createContext<VaultContextValue | null>(null);
const cancelled = () => new DOMException("Album locked or request cancelled", "AbortError");

export function VaultProvider({ children }: { children: ReactNode }) {
  const [manifest, setManifest] = useState<VaultManifest | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const secrets = useRef<{ key: CryptoKey; config: VaultConfig } | null>(null);
  const generation = useRef(0);
  const requests = useRef(new Set<AbortController>());
  const unlockWorker = useRef<{ worker: Worker; reject: (error: Error) => void } | null>(null);
  const concurrency = useRef({ active: 0, waiting: [] as (() => void)[] });
  const formRef = useRef<HTMLFormElement>(null);

  const lock = useCallback(() => {
    generation.current += 1;
    secrets.current = null;
    for (const request of requests.current) request.abort();
    requests.current.clear();
    unlockWorker.current?.worker.terminate();
    unlockWorker.current?.reject(cancelled());
    unlockWorker.current = null;
    setManifest(null);
    setBusy(false);
    setError("");
    setShowPassword(false);
    formRef.current?.reset();
  }, []);

  useEffect(() => {
    const activeRequests = requests.current;
    const restore = (event: PageTransitionEvent) => { if (event.persisted) lock(); };
    window.addEventListener("pagehide", lock);
    window.addEventListener("pageshow", restore);
    return () => {
      window.removeEventListener("pagehide", lock);
      window.removeEventListener("pageshow", restore);
      generation.current += 1;
      secrets.current = null;
      for (const request of activeRequests) request.abort();
      activeRequests.clear();
      unlockWorker.current?.worker.terminate();
      unlockWorker.current?.reject(cancelled());
    };
  }, [lock]);

  const decryptAsset = useCallback(async (asset: VaultAsset, signal?: AbortSignal) => {
    const session = secrets.current, current = generation.current;
    if (!session || signal?.aborted) throw cancelled();
    const state = concurrency.current;
    if (state.active >= 4) await new Promise<void>((resolve) => state.waiting.push(resolve));
    state.active += 1;
    const controller = new AbortController();
    const abort = () => controller.abort();
    signal?.addEventListener("abort", abort, { once: true });
    requests.current.add(controller);
    try {
      if (signal?.aborted || current !== generation.current) throw cancelled();
      const response = await fetch(`/luna/vault/${session.config.release}/${asset.id}.bin`, { signal: controller.signal, credentials: "omit", cache: asset.mime === "application/json" ? "no-store" : "default" });
      if (!response.ok) throw new Error("Album file unavailable. Check your connection and try again.");
      const bytes = await response.arrayBuffer();
      if (controller.signal.aborted || current !== generation.current) throw cancelled();
      const plain = await decryptVaultObject(session.key, session.config.release, asset, bytes);
      if (controller.signal.aborted || current !== generation.current) throw cancelled();
      return new Blob([plain], { type: asset.mime });
    } finally {
      requests.current.delete(controller);
      signal?.removeEventListener("abort", abort);
      state.active -= 1;
      state.waiting.shift()?.();
    }
  }, []);

  const unlock = useCallback(async (password: string) => {
    lock();
    const current = generation.current;
    setBusy(true);
    const controller = new AbortController();
    requests.current.add(controller);
    try {
      if (!window.isSecureContext || !crypto.subtle) throw new Error("This browser needs a secure connection to open the album.");
      const response = await fetch("/luna/vault/config.json", { cache: "no-store", credentials: "omit", signal: controller.signal });
      if (!response.ok) throw new Error("The album could not load. Check your connection and try again.");
      const config: unknown = await response.json();
      validateVaultConfig(config);
      if (current !== generation.current) throw cancelled();
      const key = await new Promise<CryptoKey>((resolve, reject) => {
        const worker = new Worker("/luna/unlock-worker.js");
        unlockWorker.current = { worker, reject };
        worker.onmessage = (event: MessageEvent<{ key?: CryptoKey; error?: string }>) => {
          worker.terminate();
          unlockWorker.current = null;
          if (event.data.key) resolve(event.data.key);
          else reject(new Error("That passphrase did not open the album. Check it and try again."));
        };
        worker.onerror = () => {
          worker.terminate();
          unlockWorker.current = null;
          reject(new Error("The album could not unlock in this browser. Refresh and try again."));
        };
        worker.postMessage({ password, config });
      });
      password = "";
      if (current !== generation.current) throw cancelled();
      secrets.current = { key, config };
      const catalog = await decryptAsset(config.manifest, controller.signal);
      const value: unknown = JSON.parse(await catalog.text());
      validateManifest(value);
      if (current !== generation.current) throw cancelled();
      setManifest(value);
      setError("");
      window.requestAnimationFrame(() => document.getElementById("private-content")?.focus({ preventScroll: true }));
    } catch (reason) {
      if (current !== generation.current) return;
      secrets.current = null;
      setError(reason instanceof Error && reason.name !== "OperationError" ? reason.message : "The album could not open. Check the passphrase and your connection, then try again.");
    } finally {
      requests.current.delete(controller);
      if (current === generation.current) setBusy(false);
    }
  }, [decryptAsset, lock]);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const input = event.currentTarget.elements.namedItem("passphrase") as HTMLInputElement;
    const password = input.value;
    input.value = "";
    void unlock(password);
  };

  return (
    <VaultContext.Provider value={{ manifest, busy, error, unlock, lock, decryptAsset }}>
      {manifest ? children : (
        <main id="private-content" tabIndex={-1} className={styles.entrance}>
          <div className={styles.orbit} aria-hidden="true"><i /><i /><i /><span>☾</span></div>
          <div className={styles.note}>
            <span className={styles.smallMoon} aria-hidden="true">☾</span>
            <h1>A little world,<br />kept between us.</h1>
            <p>Some moments are just ours.</p>
            <form ref={formRef} onSubmit={submit} method="post" action="#" className={styles.form} aria-busy={busy}>
              <label htmlFor="passphrase">Our passphrase</label>
              <div className={styles.inputRow}>
                <KeyRound size={17} aria-hidden="true" />
                <input id="passphrase" name="passphrase" type={showPassword ? "text" : "password"} autoComplete="current-password" autoCapitalize="none" autoCorrect="off" spellCheck={false} required disabled={busy} aria-describedby={error ? "unlock-error" : "unlock-hint"} />
                <button type="button" onClick={() => setShowPassword(value => !value)} disabled={busy} aria-label={showPassword ? "Hide passphrase" : "Show passphrase"}>{showPassword ? "Hide" : "Show"}</button>
              </div>
              <button className={styles.open} type="submit" disabled={busy}>{busy ? "Opening our world…" : "Come inside"}<ArrowRight size={18} aria-hidden="true" /></button>
              {error && <p id="unlock-error" className={styles.error} role="alert">{error}</p>}
              <p id="unlock-hint" className={styles.hint}><LockKeyhole size={13} aria-hidden="true" /> Everything personal stays encrypted until you unlock.</p>
            </form>
            <noscript><p>Enable JavaScript to decrypt this space in your browser.</p></noscript>
          </div>
          <span className={styles.bottomNote}>For the moments we keep.</span>
        </main>
      )}
    </VaultContext.Provider>
  );
}

export function useVault(): VaultContextValue {
  const context = useContext(VaultContext);
  if (!context) throw new Error("VaultProvider is required");
  return context;
}
