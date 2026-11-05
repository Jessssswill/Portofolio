"use client";

import { useEffect } from "react";

// Scroll reveals for anything marked with data-reveal (see "Motion" in
// globals.css). It runs after hydration, so the server HTML and React never
// disagree. Anything already on screen is marked as shown in the same task
// that switches motion on, so nothing above the fold ever flickers.
export function RevealObserver() {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          (e.target as HTMLElement).dataset.shown = "";
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.08 },
    );

    const track = (el: Element) => {
      if (!(el instanceof HTMLElement) || "shown" in el.dataset) return;
      const r = el.getBoundingClientRect();
      if (r.top < innerHeight * 0.94 && r.bottom > 0) el.dataset.shown = "";
      else io.observe(el);
    };
    const scan = (root: ParentNode) => root.querySelectorAll("[data-reveal]").forEach(track);

    scan(document);
    document.documentElement.dataset.motion = "";

    // Pages opened with client-side navigation add new elements later.
    const mo = new MutationObserver((records) => {
      for (const r of records) {
        r.addedNodes.forEach((n) => {
          if (!(n instanceof HTMLElement)) return;
          if (n.matches("[data-reveal]")) track(n);
          scan(n);
        });
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return null;
}
