import { Fragment, type CSSProperties, type ReactNode } from "react";

// Splits the headline into words so they can rise in one after another on
// first load. The phrase in `mark` gets a highlighter stroke drawn behind it.
export function Headline({ text, mark }: { text: string; mark?: string }) {
  let i = 0;
  const words = (s: string): ReactNode[] =>
    s
      .split(/(\s+)/)
      .filter(Boolean)
      .map((w) =>
        /^\s+$/.test(w) ? (
          <Fragment key={`s${i}`}> </Fragment>
        ) : (
          <span key={`w${i}`} className="w" style={{ "--i": i++ } as CSSProperties}>
            <span>{w}</span>
          </span>
        ),
      );

  const at = mark ? text.indexOf(mark) : -1;
  if (!mark || at < 0) return <>{words(text)}</>;

  return (
    <>
      {words(text.slice(0, at))}
      <span className="mark" style={{ "--i": text.slice(0, at).split(/\s+/).filter(Boolean).length } as CSSProperties}>
        <svg className="mark-line" viewBox="0 0 200 20" preserveAspectRatio="none" aria-hidden="true">
          <path d="M5 13.5C46 10.5 88 14.8 128 11.6S180 9.8 195 11" pathLength={1} />
        </svg>
        {words(mark)}
      </span>
      {words(text.slice(at + mark.length))}
    </>
  );
}
