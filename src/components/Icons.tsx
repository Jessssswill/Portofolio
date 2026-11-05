// Hand-drawn icons, stroke uses currentColor.

export function ArrowUpRight({ className = "arrow" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M3.5 8.5 8.5 3.5M4.5 3.5h4v4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="square" />
    </svg>
  );
}

export function ArrowRight({ className = "arrow arrow-r" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M2 6h7.5M6.5 3l3 3-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="square" />
    </svg>
  );
}

export function ArrowLeft({ className = "arrow" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M10 6H2.5M5.5 3l-3 3 3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="square" />
    </svg>
  );
}

// Order-2 Hilbert curve, the site's mark.
export function HilbertMark() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M2 14H6V10H2V2H6V6H10V2H14V10H10V14H14"
        pathLength={1}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
    </svg>
  );
}
