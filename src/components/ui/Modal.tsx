"use client";

import { useEffect, useLayoutEffect, useRef, type ReactNode, type RefObject, type KeyboardEventHandler } from "react";
import { cn } from "@/lib/utils";

export type ModalCloseReason = "escape" | "backdrop" | "close";
export interface ModalProps {
  open: boolean;
  onClose: (reason: ModalCloseReason) => void;
  children: ReactNode;
  label?: string;
  labelledBy?: string;
  describedBy?: string;
  initialFocusRef?: RefObject<HTMLElement | null>;
  returnFocusRef?: RefObject<HTMLElement | null>;
  /** Navigation callers disable explicit restoration and focus the destination in onAfterClose. */
  restoreFocus?: boolean | (() => boolean);
  onAfterClose?: () => void;
  closeOnBackdrop?: boolean;
  className?: string;
  onKeyDown?: KeyboardEventHandler<HTMLDialogElement>;
}

// Native top-layer isolation plus a shared, nest-safe scroll lock.
let lockCount = 0;
let previousOverflow = "";
function lockScroll() {
  if (lockCount++ === 0) {
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
  }
  return () => {
    if (--lockCount === 0) document.body.style.overflow = previousOverflow;
  };
}

/** Keep mounted through exit animation; set open=false only when the exit finishes.
 * Native dialog owns focus containment/inertness. onClose is a request, never a state mutation.
 */
export function Modal({ open, onClose, children, label, labelledBy, describedBy,
  initialFocusRef, returnFocusRef, restoreFocus = true, onAfterClose,
  closeOnBackdrop = true, className, onKeyDown }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const callbacks = useRef({ onClose, onAfterClose, restoreFocus, returnFocusRef, initialFocusRef });
  const backdropDown = useRef(false);
  function isBackdrop(event: { target: EventTarget; currentTarget: HTMLDialogElement; clientX: number; clientY: number }) {
    if (event.target !== event.currentTarget) return false;
    const rect = event.currentTarget.getBoundingClientRect();
    return event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
  }
  useLayoutEffect(() => {
    callbacks.current = { onClose, onAfterClose, restoreFocus, returnFocusRef, initialFocusRef };
  });

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!open || !dialog) return;
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const unlock = lockScroll();
    dialog.showModal();
    const focusTarget = callbacks.current.initialFocusRef?.current;
    if (focusTarget && dialog.contains(focusTarget)) focusTarget.focus({ preventScroll: true });
    else if (!dialog.contains(document.activeElement)) dialog.focus({ preventScroll: true });
    return () => {
      if (dialog.open) dialog.close();
      unlock();
      const options = callbacks.current;
      const target = options.returnFocusRef?.current ?? opener;
      const shouldRestore = typeof options.restoreFocus === "function" ? options.restoreFocus() : options.restoreFocus;
      if (shouldRestore && target?.isConnected && !target.closest("[inert]")) {
        target.focus({ preventScroll: true });
      }
      options.onAfterClose?.();
    };
  }, [open]);

  return (
    <dialog ref={dialogRef} tabIndex={-1} aria-label={label} aria-labelledby={labelledBy}
      aria-describedby={describedBy} className={cn("ui-modal", className)}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (event.defaultPrevented) return;
        if (event.key !== "Tab") return;
        const dialog = event.currentTarget;
        const items = Array.from(dialog.querySelectorAll<HTMLElement>(
          "a[href], area[href], button, input, select, textarea, [tabindex], [contenteditable='true']"
        )).filter(item => item.tabIndex >= 0 && !item.matches(":disabled") && !item.closest("[inert]") && item.getClientRects().length > 0);
        const first = items[0];
        const last = items[items.length - 1];
        if (!first) { event.preventDefault(); dialog.focus(); }
        else if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog)) {
          event.preventDefault(); last.focus();
        } else if (!event.shiftKey && (document.activeElement === last || document.activeElement === dialog)) {
          event.preventDefault(); first.focus();
        }
      }}
      onCancel={(event) => { event.preventDefault(); onClose("escape"); }}
      onClose={() => {
        // Controlled close() also emits this event. Only report an unexpected native close.
        if (open && !dialogRef.current?.open) callbacks.current.onClose("close");
      }}
      onPointerDown={(event) => { backdropDown.current = isBackdrop(event); }}
      onClick={(event) => {
        if (closeOnBackdrop && backdropDown.current && isBackdrop(event)) onClose("backdrop");
        backdropDown.current = false;
      }}>
      {children}
    </dialog>
  );
}
