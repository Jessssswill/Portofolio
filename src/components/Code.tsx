import type { ReactNode } from "react";

// Build-time syntax colouring for the few snippets on the site. Small on
// purpose: comments, strings, keywords, types and numbers. No client JS.

const KEYWORDS = new Set([
  "const", "let", "await", "async", "if", "else", "return", "throw", "new", "export", "abstract",
  "class", "extends", "protected", "private", "public", "readonly", "function", "import", "from",
  "true", "false", "null", "this", "void", "model", "default",
]);
const TYPES = new Set(["String", "Boolean", "Float", "DateTime", "Int", "GameState", "Move", "TurnResult", "EndCondition", "GameEventEmitter", "ConflictException"]);

const PATTERN = /(\/\/[^\n]*)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|(@\w+(?:\([^)]*\))?)|(\b\d+(?:\.\d+)?\b)|(\b[A-Za-z_]\w*\b)/g;

function highlight(code: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let key = 0;
  for (const m of code.matchAll(PATTERN)) {
    const i = m.index ?? 0;
    if (i > last) out.push(code.slice(last, i));
    const [tok, comment, str, deco, num, word] = m;
    let cls: string | null = null;
    if (comment) cls = "tok-c";
    else if (str) cls = "tok-s";
    else if (deco) cls = "tok-t";
    else if (num) cls = "tok-n";
    else if (word && KEYWORDS.has(word)) cls = "tok-k";
    else if (word && TYPES.has(word)) cls = "tok-t";
    out.push(cls ? <span key={key++} className={cls}>{tok}</span> : tok);
    last = i + tok.length;
  }
  if (last < code.length) out.push(code.slice(last));
  return out;
}

export function Code({ code, file, lang }: { code: string; file?: string; lang: string }) {
  return (
    <div className="codeblock wide" data-reveal="">
      {file && <div className="file">{file}</div>}
      <pre>
        <code data-lang={lang}>{highlight(code)}</code>
      </pre>
    </div>
  );
}
