"use client";

import { useEffect, useRef, type RefObject } from "react";

// Calls `onView` once, the first time the element is properly on screen.
// The figures use it to play a short demo by themselves. Skipped entirely
// when the visitor prefers reduced motion.
export function useFirstView(ref: RefObject<Element | null>, onView: () => void, delay = 450) {
  const latest = useRef(onView);
  latest.current = onView;

  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let timer = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        timer = window.setTimeout(() => latest.current(), delay);
      },
      { threshold: 0.35, rootMargin: "0px 0px -15% 0px" },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      clearTimeout(timer);
    };
  }, [ref, delay]);
}
