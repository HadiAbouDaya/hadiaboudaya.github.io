"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

interface TypingEffectProps {
  texts: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
}

export function TypingEffect({
  texts,
  typingSpeed = 80,
  deletingSpeed = 40,
  pauseDuration = 2000,
}: TypingEffectProps) {
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const currentText = texts[textIndex];

    if (!isDeleting && charIndex === currentText.length) {
      const timeout = setTimeout(() => setIsDeleting(true), pauseDuration);
      return () => clearTimeout(timeout);
    }

    if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setTextIndex((i) => (i + 1) % texts.length);
      return;
    }

    const speed = isDeleting ? deletingSpeed : typingSpeed;
    const timeout = setTimeout(() => {
      setCharIndex((c) => c + (isDeleting ? -1 : 1));
    }, speed);

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, textIndex, texts, typingSpeed, deletingSpeed, pauseDuration, prefersReducedMotion]);

  if (prefersReducedMotion) {
    return <span>{texts[0]}</span>;
  }

  return (
    <span>
      {texts[textIndex].slice(0, charIndex)}
      <span className="animate-pulse">|</span>
    </span>
  );
}
