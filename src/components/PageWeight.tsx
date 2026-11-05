"use client";

import { useEffect, useState } from "react";

// Reports what this page actually cost to load, measured in the visitor's
// own browser with the Resource Timing API.
export function PageWeight() {
  const [text, setText] = useState<string | null>(null);

  useEffect(() => {
    const measure = () => {
      const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
      const res = performance.getEntriesByType("resource") as PerformanceResourceTiming[];
      let bytes = nav ? nav.transferSize || nav.encodedBodySize : 0;
      for (const r of res) bytes += r.transferSize || r.encodedBodySize || 0;
      const ms = nav ? Math.round(nav.loadEventEnd || nav.domContentLoadedEventEnd) : 0;
      if (!bytes || !ms) return;
      const kb = Math.max(1, Math.round(bytes / 1024));
      setText(`This page: ${kb} KB, loaded in ${(ms / 1000).toFixed(2)} s`);
    };
    if (document.readyState === "complete") setTimeout(measure, 0);
    else window.addEventListener("load", () => setTimeout(measure, 0), { once: true });
  }, []);

  return <span aria-live="polite">{text}</span>;
}
