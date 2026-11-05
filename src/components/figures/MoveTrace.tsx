"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useFirstView } from "@/lib/useFirstView";

// Fig: PlayHub. A move walks the same path it takes in the NestJS backend.
// Error messages are copied from the real code (they're in Indonesian there).

type Mark = "X" | "O" | null;
type Layer = "Presentation" | "Business" | "Persistence" | "Infrastructure";
type Step = { call: string; layer: Layer; pattern?: string };

const SID = "7f3a";

const MOVE: Step[] = [
  { call: `POST /sessions/${SID}/move`, layer: "Presentation" },
  { call: "AuthorizationProxy.makeMove()", layer: "Persistence", pattern: "Protection proxy" },
  { call: "GameEngineFacade.makeMove()", layer: "Business", pattern: "Facade" },
  { call: `GameRegistry.get("${SID}")`, layer: "Infrastructure", pattern: "Singleton" },
  { call: "session.canAcceptMove()", layer: "Business", pattern: "State" },
  { call: "MoveValidationService.validate()", layer: "Business" },
  { call: "TicTacToeGame.executeTurn()", layer: "Business", pattern: "Template Method" },
  { call: "applyMove(): state.clone()", layer: "Business", pattern: "Prototype" },
  { call: "emitter.emit('move.applied')", layer: "Business", pattern: "Observer" },
  { call: `gateway: room session:${SID}`, layer: "Presentation" },
  { call: "CachedGameStateProxy: invalidate", layer: "Persistence", pattern: "Cache proxy" },
];

const AI: Step = { call: "MinimaxAiAdapter.getNextMove()", layer: "Infrastructure", pattern: "Adapter" };

const CREATE: Step[] = [
  { call: "POST /sessions", layer: "Presentation" },
  { call: "AuthorizationProxy.createSession()", layer: "Persistence", pattern: "Protection proxy" },
  { call: "GameEngineFacade.createSession()", layer: "Business", pattern: "Facade" },
  { call: "new GameSessionBuilder()…build()", layer: "Business", pattern: "Builder" },
  { call: "TicTacToeFactory.createInitialState()", layer: "Business", pattern: "Abstract Factory" },
  { call: "session.startGame(): IN_PROGRESS", layer: "Business", pattern: "State" },
  { call: "GameRegistry.register(session)", layer: "Infrastructure", pattern: "Singleton" },
  { call: "bridgeToEventBus(session)", layer: "Business", pattern: "Observer" },
];

const LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function winner(b: Mark[]): { who: Mark; line: number[] } | null {
  for (const l of LINES) {
    const [a, c, d] = l;
    if (b[a] && b[a] === b[c] && b[a] === b[d]) return { who: b[a], line: l };
  }
  return null;
}

// Same idea as PlayHub's MinimaxAiAdapter: +10 for a win, -10 for a loss.
function minimax(b: Mark[], me: Mark, isMax: boolean, depth: number): number {
  const w = winner(b);
  const opp = me === "O" ? "X" : "O";
  if (w) return w.who === me ? 10 - depth : depth - 10;
  if (b.every(Boolean)) return 0;
  let best = isMax ? -Infinity : Infinity;
  for (let i = 0; i < 9; i++) {
    if (b[i]) continue;
    b[i] = isMax ? me : opp;
    const s = minimax(b, me, !isMax, depth + 1);
    b[i] = null;
    best = isMax ? Math.max(best, s) : Math.min(best, s);
  }
  return best;
}

function bestMove(b: Mark[]): number {
  let best = -Infinity;
  let pick = -1;
  for (let i = 0; i < 9; i++) {
    if (b[i]) continue;
    b[i] = "O";
    const s = minimax(b, "O", false, 1);
    b[i] = null;
    if (s > best) {
      best = s;
      pick = i;
    }
  }
  return pick;
}

type Run = {
  steps: Step[];
  reached: number; // index of the step currently lit
  failAt: number | null;
  done: boolean;
};

type Res = { ok: boolean; code: string; text: string } | null;

const STEP_MS = 115;

export function MoveTrace() {
  const [board, setBoard] = useState<Mark[]>(Array(9).fill(null));
  const [actor, setActor] = useState<"player" | "guest">("player");
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState<Run>({ steps: MOVE, reached: -1, failAt: null, done: false });
  const [res, setRes] = useState<Res>(null);
  const [busy, setBusy] = useState(false);
  const [finished, setFinished] = useState(false);
  const timers = useRef<number[]>([]);
  const rootRef = useRef<HTMLDivElement>(null);
  // Once someone touches the figure, it stops doing things on its own.
  const touched = useRef(false);

  const clear = () => {
    timers.current.forEach((t) => clearTimeout(t));
    timers.current = [];
  };
  useEffect(() => clear, []);

  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  };

  // Light up steps one after another, stop at failAt if set.
  const play = useCallback((steps: Step[], failAt: number | null, onEnd: () => void, offset = 0) => {
    const last = failAt ?? steps.length - 1;
    setRun({ steps, reached: offset - 1, failAt: null, done: false });
    for (let i = offset; i <= last; i++) {
      later(() => setRun((r) => ({ ...r, reached: i, failAt: i === failAt ? i : null })), (i - offset + 1) * STEP_MS);
    }
    later(() => {
      setRun((r) => ({ ...r, done: true }));
      onEnd();
    }, (last - offset + 2) * STEP_MS);
  }, []);

  const status = (() => {
    const w = winner(board);
    if (w) return w.who === "X" ? "You win. That shouldn't happen." : "O wins. Minimax doesn't lose.";
    if (board.every(Boolean)) return "Draw. The best you can do.";
    if (busy) return "Request in flight…";
    return paused ? "Session paused." : "Your move. You are X.";
  })();

  const move = (i: number, auto = false) => {
    if (!auto) touched.current = true;
    if (busy) return;
    clear();
    setBusy(true);
    setRes(null);

    let failAt: number | null = null;
    let err: Res = null;
    if (actor === "guest") {
      failAt = 1;
      err = { ok: false, code: "403 Forbidden", text: `Player 'guest' bukan anggota sesi '${SID}'.` };
    } else if (finished) {
      failAt = 4;
      err = { ok: false, code: "400 Bad Request", text: "Game sudah selesai. Tidak ada aksi yang diizinkan." };
    } else if (paused) {
      failAt = 4;
      err = { ok: false, code: "400 Bad Request", text: "Game di-pause. Resume dulu sebelum membuat move." };
    } else if (board[i]) {
      failAt = 5;
      err = { ok: false, code: "400 Bad Request", text: "Move tidak valid" };
    }

    play(MOVE, failAt, () => {
      if (err) {
        setRes(err);
        setBusy(false);
        return;
      }
      const next = board.slice();
      next[i] = "X";
      setBoard(next);
      const over = winner(next) || next.every(Boolean);
      setRes({ ok: true, code: "201 Created", text: "move.applied sent to 2 sockets in the room" });
      if (over) {
        setFinished(true);
        setBusy(false);
        return;
      }
      // O answers through the adapter, then the same path.
      later(() => {
        const steps = [...MOVE, AI];
        setRun({ steps, reached: MOVE.length - 1, failAt: null, done: false });
        later(() => setRun((r) => ({ ...r, reached: MOVE.length })), STEP_MS * 2);
        later(() => {
          const o = bestMove(next.slice());
          const after = next.slice();
          after[o] = "O";
          setBoard(after);
          setRun((r) => ({ ...r, done: true }));
          if (winner(after) || after.every(Boolean)) setFinished(true);
          setRes({ ok: true, code: "201 Created", text: `O played row ${Math.floor(o / 3)}, col ${o % 3}` });
          setBusy(false);
        }, STEP_MS * 6);
      }, 260);
    });
  };

  const reset = () => {
    touched.current = true;
    clear();
    setBoard(Array(9).fill(null));
    setFinished(false);
    setBusy(true);
    setRes(null);
    play(CREATE, null, () => {
      setRes({ ok: true, code: "201 Created", text: `session ${SID} is IN_PROGRESS` });
      setBusy(false);
    });
  };

  // First time the figure is on screen, play the centre square as a demo.
  useFirstView(rootRef, () => {
    if (!touched.current && !busy && board.every((c) => !c)) move(4, true);
  });

  const w = winner(board);

  return (
    <div ref={rootRef}>
      <div className="controls">
        <span className="ctl">
          <span className="label">Move as</span>
          <span className="seg" role="group" aria-label="Who sends the move">
            <button
              type="button"
              aria-pressed={actor === "player"}
              onClick={() => {
                touched.current = true;
                setActor("player");
              }}
            >
              Alice, a player
            </button>
            <button
              type="button"
              aria-pressed={actor === "guest"}
              onClick={() => {
                touched.current = true;
                setActor("guest");
              }}
            >
              A stranger
            </button>
          </span>
        </span>
        <span className="ctl">
          <span className="label">Session</span>
          <span className="seg" role="group" aria-label="Session state">
            <button
              type="button"
              aria-pressed={!paused}
              onClick={() => {
                touched.current = true;
                setPaused(false);
              }}
            >
              Running
            </button>
            <button
              type="button"
              aria-pressed={paused}
              onClick={() => {
                touched.current = true;
                setPaused(true);
              }}
            >
              Paused
            </button>
          </span>
        </span>
        <button type="button" className="chip-btn ghost" onClick={reset} disabled={busy}>
          New game
        </button>
      </div>

      <div className="trace">
        <div>
          <div className="board" role="group" aria-label="Tic-tac-toe board">
            {board.map((m, i) => (
              <button
                key={i}
                type="button"
                className={`cell ${m === "X" ? "x" : m === "O" ? "o" : ""} ${w?.line.includes(i) ? "win" : ""}`}
                onClick={() => move(i)}
                disabled={busy}
                aria-label={`Row ${Math.floor(i / 3) + 1}, column ${(i % 3) + 1}${m ? `, ${m}` : ""}`}
              >
                {m}
              </button>
            ))}
          </div>
          <p className="board-status mono">{status}</p>
        </div>

        <div>
          <div className="trace-legend" aria-hidden="true">
            <span>
              <i className="l-presentation" />
              presentation
            </span>
            <span>
              <i className="l-business" />
              business
            </span>
            <span>
              <i className="l-persistence" />
              persistence
            </span>
            <span>
              <i className="l-infrastructure" />
              infrastructure
            </span>
          </div>
          <ol className="steps" aria-label="Call path">
            {run.steps.map((s, i) => {
              const failed = run.failAt === i;
              const stopped = run.failAt !== null && i > run.failAt;
              const cls = failed
                ? "fail"
                : stopped
                  ? "skipped"
                  : i === run.reached && !run.done
                    ? "active"
                    : i <= run.reached
                      ? "done"
                      : "";
              return (
                <li key={s.call} className={`step ${cls}`} data-layer={s.layer}>
                  <span className={`dot l-${s.layer.toLowerCase()}`} />
                  <span className="call">{s.call}</span>
                  {s.pattern ? <span className="pat">{s.pattern}</span> : <span />}
                </li>
              );
            })}
          </ol>
          <div className={`response ${res ? (res.ok ? "ok" : "err") : ""}`} aria-live="polite">
            {res ? (
              <>
                <b>{res.code}</b> {res.text}
              </>
            ) : (
              <span className="faint">{busy ? "…" : "Click a square to send a move."}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
