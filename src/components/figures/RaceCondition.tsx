"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useFirstView } from "@/lib/useFirstView";

// Fig: OKACHU. Two phones claim the same voucher at the same moment.
// "naive" is the read-then-write version, "atomic" is what shipped:
// prisma.voucher.updateMany({ where: { code, isUsed: false }, ... })

type Mode = "naive" | "atomic";
type Phone = { state: "idle" | "sent" | "won" | "denied"; sticker?: number };
type Row = { isUsed: boolean; characterId: number | null; claimedAt: string | null; flash?: keyof Omit<Row, "flash"> };
type Line = { who: "A" | "B"; sql: ReactNode; tone?: "good" | "bad" };
type Frame = { a: Phone; b: Phone; row: Row; line?: Line; verdict?: string };

const CODE = "OKC-48K2";
const FREE: Row = { isUsed: false, characterId: null, claimedAt: null };
const IDLE: Phone = { state: "idle" };
const SENT: Phone = { state: "sent" };

const SELECT = (
  <>
    SELECT isUsed FROM Voucher WHERE code = &apos;{CODE}&apos; <em>: false</em>
  </>
);

const FRAMES: Record<Mode, Frame[]> = {
  naive: [
    { a: SENT, b: SENT, row: FREE, line: { who: "A", sql: <>POST /claim {"{"} code: &apos;{CODE}&apos; {"}"}</> } },
    { a: SENT, b: SENT, row: FREE, line: { who: "B", sql: <>POST /claim {"{"} code: &apos;{CODE}&apos; {"}"}</> } },
    { a: SENT, b: SENT, row: FREE, line: { who: "A", sql: SELECT } },
    { a: SENT, b: SENT, row: FREE, line: { who: "B", sql: SELECT, tone: "bad" } },
    {
      a: { state: "won", sticker: 12 },
      b: SENT,
      row: { isUsed: true, characterId: 12, claimedAt: "10:02:31", flash: "isUsed" },
      line: {
        who: "A",
        sql: (
          <>
            UPDATE Voucher SET isUsed = true, characterId = 12 <em>: 1 row</em>
          </>
        ),
      },
    },
    {
      a: { state: "won", sticker: 12 },
      b: { state: "won", sticker: 7 },
      row: { isUsed: true, characterId: 7, claimedAt: "10:02:31", flash: "characterId" },
      line: {
        who: "B",
        sql: (
          <>
            UPDATE Voucher SET isUsed = true, characterId = 7 <em>: 1 row, overwrites A</em>
          </>
        ),
        tone: "bad",
      },
      verdict: "Two stickers for one code. Both requests read isUsed = false before either one wrote.",
    },
  ],
  atomic: [
    { a: SENT, b: SENT, row: FREE, line: { who: "A", sql: <>POST /claim {"{"} code: &apos;{CODE}&apos; {"}"}</> } },
    { a: SENT, b: SENT, row: FREE, line: { who: "B", sql: <>POST /claim {"{"} code: &apos;{CODE}&apos; {"}"}</> } },
    {
      a: { state: "won", sticker: 12 },
      b: SENT,
      row: { isUsed: true, characterId: 12, claimedAt: "10:02:31", flash: "isUsed" },
      line: {
        who: "A",
        sql: (
          <>
            UPDATE Voucher SET isUsed = true WHERE code = &apos;{CODE}&apos; AND isUsed = false <em>: 1 row</em>
          </>
        ),
        tone: "good",
      },
    },
    {
      a: { state: "won", sticker: 12 },
      b: SENT,
      row: { isUsed: true, characterId: 12, claimedAt: "10:02:31" },
      line: {
        who: "B",
        sql: (
          <>
            UPDATE Voucher SET isUsed = true WHERE code = &apos;{CODE}&apos; AND isUsed = false <em>: 0 rows</em>
          </>
        ),
        tone: "good",
      },
    },
    {
      a: { state: "won", sticker: 12 },
      b: { state: "denied" },
      row: { isUsed: true, characterId: 12, claimedAt: "10:02:31" },
      line: {
        who: "B",
        sql: (
          <>
            409 Conflict <em>: Voucher already claimed or invalid</em>
          </>
        ),
        tone: "good",
      },
      verdict: "One code, one sticker. The second update matched zero rows, so the API refused it.",
    },
  ],
};

const STEP_MS = 650;

function PhoneView({ name, p }: { name: string; p: Phone }) {
  return (
    <div className="phone" aria-label={`Phone ${name}`}>
      <div className="phone-top">
        <span>Phone {name}</span>
        <span>okachu</span>
      </div>
      <div className="phone-input">{CODE}</div>
      <div className={`phone-btn ${p.state !== "idle" ? "pressed" : ""}`}>Tukar Kode</div>
      <div className="phone-out">
        {p.state === "idle" && <span>Waiting for a tap</span>}
        {p.state === "sent" && <span>Claiming…</span>}
        {p.state === "won" && (
          <span style={{ display: "grid", justifyItems: "center", gap: 6 }}>
            <span className="sticker">#{p.sticker}</span>
            <span>Sticker #{p.sticker}</span>
          </span>
        )}
        {p.state === "denied" && <span className="denied">Already claimed</span>}
      </div>
    </div>
  );
}

export function RaceCondition() {
  const [mode, setMode] = useState<Mode>("naive");
  const [step, setStep] = useState(-1);
  const [running, setRunning] = useState(false);
  const timers = useRef<number[]>([]);
  const rootRef = useRef<HTMLDivElement>(null);
  const touched = useRef(false);

  const stop = () => {
    timers.current.forEach((t) => clearTimeout(t));
    timers.current = [];
  };
  useEffect(() => stop, []);

  const frames = FRAMES[mode];
  const frame: Frame = step >= 0 ? frames[Math.min(step, frames.length - 1)] : { a: IDLE, b: IDLE, row: FREE };

  const run = (auto = false) => {
    if (!auto) touched.current = true;
    stop();
    setRunning(true);
    setStep(0);
    const fast = matchMedia("(prefers-reduced-motion: reduce)").matches;
    for (let i = 1; i < frames.length; i++) {
      timers.current.push(window.setTimeout(() => setStep(i), fast ? 0 : i * STEP_MS));
    }
    timers.current.push(window.setTimeout(() => setRunning(false), fast ? 0 : (frames.length - 1) * STEP_MS + 50));
  };

  const pick = (m: Mode) => {
    touched.current = true;
    stop();
    setRunning(false);
    setMode(m);
    setStep(-1);
  };

  // First time it is on screen, run the broken version once by itself.
  useFirstView(rootRef, () => {
    if (!touched.current && step < 0) run(true);
  });

  const shown = step >= 0 ? frames.slice(0, step + 1).filter((f) => f.line) : [];
  const row = frame.row;
  const val = (v: unknown) => (v === null ? "null" : String(v));

  return (
    <div ref={rootRef}>
      <div className="controls">
        <span className="ctl">
          <span className="label">Claim logic</span>
          <span className="seg" role="group" aria-label="Claim logic">
            <button type="button" aria-pressed={mode === "naive"} onClick={() => pick("naive")}>
              Read, then write
            </button>
            <button type="button" aria-pressed={mode === "atomic"} onClick={() => pick("atomic")}>
              updateMany (shipped)
            </button>
          </span>
        </span>
        <button type="button" className="chip-btn" onClick={() => run()} disabled={running}>
          {step >= 0 && !running ? "Run again" : "Tap both at once"}
        </button>
      </div>

      <div className="race">
        <PhoneView name="A" p={frame.a} />
        <div className="dbrow" aria-label="Voucher row in MySQL">
          <div className="dbrow-head">
            <span>Voucher</span>
            <span>MySQL</span>
          </div>
          <dl>
            <dt>code</dt>
            <dd>{CODE}</dd>
            <dt>isUsed</dt>
            <dd className={row.flash === "isUsed" ? "flash" : ""}>{val(row.isUsed)}</dd>
            <dt>characterId</dt>
            <dd className={row.flash === "characterId" ? "flash" : ""}>{val(row.characterId)}</dd>
            <dt>claimedAt</dt>
            <dd>{val(row.claimedAt)}</dd>
          </dl>
        </div>
        <PhoneView name="B" p={frame.b} />
      </div>

      <ol className="log" aria-live="polite">
        {shown.length === 0 && <li className="faint" style={{ display: "block" }}>Press the button to send both claims.</li>}
        {shown.map((f, i) => (
          <li key={`${mode}-${i}`} className={f.line!.tone ?? ""}>
            <span className="faint">t{i + 1}</span>
            <span className={f.line!.who === "A" ? "who-a" : "who-b"}>{f.line!.who}</span>
            <span className="sql">{f.line!.sql}</span>
          </li>
        ))}
        {frame.verdict && step === frames.length - 1 && <span className="verdict">{frame.verdict}</span>}
      </ol>
    </div>
  );
}
