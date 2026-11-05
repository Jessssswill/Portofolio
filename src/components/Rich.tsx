import { Fragment, type ReactNode } from "react";

// Tiny inline formatter for content strings:
// `code`, **bold**, *italic*, [label](https://url)
const TOKEN = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g;

export function Rich({ text }: { text: string }) {
  const parts = text.split(TOKEN).filter(Boolean);
  return (
    <>
      {parts.map((part, i) => (
        <Fragment key={i}>{render(part)}</Fragment>
      ))}
    </>
  );
}

function render(part: string): ReactNode {
  if (part.startsWith("`") && part.endsWith("`")) return <code>{part.slice(1, -1)}</code>;
  if (part.startsWith("**") && part.endsWith("**")) return <strong>{part.slice(2, -2)}</strong>;
  if (part.startsWith("*") && part.endsWith("*") && part.length > 2) return <em className="it">{part.slice(1, -1)}</em>;
  const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
  if (link) {
    const external = /^https?:/.test(link[2]);
    return (
      <a href={link[2]} {...(external ? { target: "_blank", rel: "noreferrer" } : {})}>
        {link[1]}
      </a>
    );
  }
  return part;
}
