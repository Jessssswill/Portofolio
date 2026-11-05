import type { CSSProperties, ReactNode } from "react";
import { Rich } from "../Rich";

export function Figure({
  num,
  title,
  caption,
  children,
  className = "",
}: {
  num: number | string;
  title: string;
  caption?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <figure className={`fig ${className}`} data-reveal="" style={{ "--d": 120 } as CSSProperties}>
      <div className="fig-head">
        <span className="mono">Fig. {num}</span>
        <span className="fig-title">{title}</span>
      </div>
      <div className="fig-body">{children}</div>
      {caption && (
        <figcaption>
          <Rich text={caption} />
        </figcaption>
      )}
    </figure>
  );
}
