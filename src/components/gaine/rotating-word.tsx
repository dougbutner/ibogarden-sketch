"use client";

import { useEffect, useState } from "react";

export function RotatingWord({ words }: { words: readonly string[] }) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setVisible(false);
      window.setTimeout(() => {
        setIndex((current) => (current + 1) % words.length);
        setVisible(true);
      }, 280);
    }, 2600);

    return () => window.clearInterval(timer);
  }, [words.length]);

  return (
    <span
      aria-live="polite"
      className={`inline-block min-w-[6ch] text-gold transition-opacity duration-300 ease-out ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      {words[index]}
    </span>
  );
}
