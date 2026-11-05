"use client";

import { useState, type CSSProperties } from "react";

// Fig: Trisenpai batch one. Dates and topics come from the course outline
// on trisenpai.vercel.app. Sessions ran Monday, Wednesday and Friday evenings.

type Kind = "lesson" | "exam" | "review";
type Session = { n: number; day: string; title: string; kind: Kind; topics: string[]; time?: string };

const SESSIONS: Session[] = [
  { n: 1, day: "21 Jul", title: "Intro to C", kind: "lesson", topics: ["Standard library", "Program structure", "Comments", "Escape sequences", "Variables and data types", "Type casting", "Input and output formatting", "ASCII values"] },
  { n: 2, day: "23 Jul", title: "Operators", kind: "lesson", topics: ["Operators and operands", "Assignment", "Arithmetic", "Relational", "Logical", "Bitwise", "Shorthand", "Pointer operators", "Precedence and associativity"] },
  { n: 3, day: "25 Jul", title: "Selection", kind: "lesson", topics: ["if-else", "Nested if", "switch-case", "Ternary operator"] },
  { n: 4, day: "28 Jul", title: "Repetition", kind: "lesson", topics: ["for", "while", "do-while", "Nested loops", "break and continue", "Pattern printing", "Test cases"] },
  { n: 5, day: "30 Jul", title: "Strings", kind: "lesson", topics: ["string.h", "String validation", "Length", "Copying", "Comparing, with and without case"] },
  { n: 6, day: "1 Aug", title: "Pointers and arrays", kind: "lesson", topics: ["Pointer concept", "1D, 2D and 3D arrays", "Strings as arrays", "Pattern printing with arrays"] },
  { n: 7, day: "4 Aug", title: "Midterm simulation", kind: "exam", time: "18.30 to 21.00", topics: ["Past midterm problems, under exam conditions"] },
  { n: 8, day: "6 Aug", title: "Midterm review", kind: "review", topics: ["Going through the problems", "Common mistakes"] },
  { n: 9, day: "8 Aug", title: "Functions", kind: "lesson", topics: ["Definition and structure", "Prototypes", "Local and global identifiers", "Pass by value", "Pass by reference"] },
  { n: 10, day: "11 Aug", title: "Recursion", kind: "lesson", topics: ["Recursive functions", "Iterative vs recursive"] },
  { n: 11, day: "13 Aug", title: "Structs", kind: "lesson", topics: ["Struct definition", "Nested structs", "typedef"] },
  { n: 12, day: "15 Aug", title: "Files", kind: "lesson", topics: ["Opening and closing files", "File input and output"] },
  { n: 13, day: "18 Aug", title: "Sorting I", kind: "lesson", topics: ["Bubble sort", "Selection sort", "Insertion sort"] },
  { n: 14, day: "20 Aug", title: "Sorting II", kind: "lesson", topics: ["Quick sort", "Merge sort"] },
  { n: 15, day: "22 Aug", title: "Searching", kind: "lesson", topics: ["Linear search", "Binary search", "Interpolation search"] },
  { n: 16, day: "25 Aug", title: "Final simulation", kind: "exam", time: "18.30 to 21.00", topics: ["Past final exam problems, under exam conditions"] },
  { n: 17, day: "27 Aug", title: "Final review", kind: "review", topics: ["Going through the problems", "Common mistakes"] },
];

// Six weeks, Mon / Wed / Fri. Week six has no Friday session.
const WEEKS: (number | null)[][] = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
  [10, 11, 12],
  [13, 14, 15],
  [16, 17, null],
];

export function CourseMap() {
  const [sel, setSel] = useState(1);
  const s = SESSIONS[sel - 1];

  return (
    <div>
      <div className="cal" role="group" aria-label="Sessions by week">
        <span />
        <span className="cal-h">Mon</span>
        <span className="cal-h">Wed</span>
        <span className="cal-h">Fri</span>
        {WEEKS.map((week, w) => (
          <Week key={w} index={w} week={week} sel={sel} onPick={setSel} />
        ))}
      </div>

      <div className="sess-detail" aria-live="polite">
        <h4>
          Session {s.n}: {s.title}
        </h4>
        <p className="mono">
          {s.day} 2025, {s.time ?? "19.00 to 21.00"}
          {s.kind === "exam" ? " · exam simulation" : s.kind === "review" ? " · answers and mistakes" : ""}
        </p>
        <ul>
          {s.topics.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </div>

      <div className="kpis">
        <div>
          <b>17</b>
          <span>live sessions</span>
        </div>
        <div>
          <b>15</b>
          <span>slide decks</span>
        </div>
        <div>
          <b>15</b>
          <span>recorded lessons</span>
        </div>
        <div>
          <b>~20</b>
          <span>paying students</span>
        </div>
      </div>
    </div>
  );
}

function Week({
  index,
  week,
  sel,
  onPick,
}: {
  index: number;
  week: (number | null)[];
  sel: number;
  onPick: (n: number) => void;
}) {
  return (
    <>
      <span className="cal-w">W{index + 1}</span>
      {week.map((n, i) => {
        if (n === null) return <span key={i} />;
        const s = SESSIONS[n - 1];
        return (
          <button
            key={n}
            type="button"
            className={`sess ${s.kind === "lesson" ? "" : s.kind}`}
            style={{ "--i": n } as CSSProperties}
            aria-pressed={sel === n}
            onClick={() => onPick(n)}
            onMouseEnter={() => onPick(n)}
          >
            <span className="n">
              {s.n} · {s.day}
            </span>
            <span className="t">{s.title}</span>
          </button>
        );
      })}
    </>
  );
}
