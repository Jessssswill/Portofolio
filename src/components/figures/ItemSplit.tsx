"use client";

import { useMemo, useState, type CSSProperties } from "react";

// Fig: SplitIt. One expense, one ExpenseSplit per person, and the payment
// flow that lives on each split: isPaid + paymentProof, then isValidated.

const PEOPLE = ["Andi", "Bella", "Cahya"];
const PAYER = 0;

type Item = { name: string; price: number; who: number };

const START: Item[] = [
  { name: "Ayam geprek", price: 25000, who: 1 },
  { name: "Es teh manis", price: 5000, who: 1 },
  { name: "Mie goreng", price: 22000, who: 2 },
  { name: "Es jeruk", price: 7000, who: 2 },
  { name: "Nasi goreng spesial", price: 28000, who: 0 },
  { name: "Es teh manis", price: 5000, who: 0 },
];

type Pay = { isPaid: boolean; isValidated: boolean };
const UNPAID: Pay = { isPaid: false, isValidated: false };

const rp = (n: number) => "Rp" + new Intl.NumberFormat("id-ID").format(n);

export function ItemSplit() {
  const [items, setItems] = useState<Item[]>(START);
  const [pay, setPay] = useState<Pay[]>(PEOPLE.map(() => UNPAID));

  const total = items.reduce((s, i) => s + i.price, 0);

  const splits = useMemo(
    () =>
      PEOPLE.map((name, p) => {
        const mine = items.filter((i) => i.who === p);
        return {
          name,
          amount: mine.reduce((s, i) => s + i.price, 0),
          description: mine.map((i) => i.name).join(" + "),
        };
      }),
    [items],
  );

  const cycle = (k: number) => {
    setItems((list) => list.map((it, i) => (i === k ? { ...it, who: (it.who + 1) % PEOPLE.length } : it)));
    // Changing the bill re-opens every split, like editing the expense would.
    setPay(PEOPLE.map(() => UNPAID));
  };

  const set = (p: number, next: Pay) => setPay((all) => all.map((v, i) => (i === p ? next : v)));

  const owed = splits.reduce((s, sp, p) => (p === PAYER || pay[p].isValidated ? s : s + sp.amount), 0);

  return (
    <div className="split">
      <div className="receipt">
        <div className="receipt-h">
          <b>Makan siang setelah kelas</b>
          Paid by {PEOPLE[PAYER]} · tap an item
        </div>
        {items.map((it, i) => (
          <button type="button" key={i} className="item" onClick={() => cycle(i)} style={{ "--i": i } as CSSProperties}>
            <span className={`avatar p-${it.who}`} aria-hidden="true">
              {PEOPLE[it.who][0]}
            </span>
            <span>
              {it.name}
              <span className="sr-only">, ordered by {PEOPLE[it.who]}</span>
            </span>
            <span>{rp(it.price)}</span>
          </button>
        ))}
        <div className="receipt-total">
          <span>Total</span>
          <span>{rp(total)}</span>
        </div>
      </div>

      <div className="splits">
        {splits.map((sp, p) => {
          const state = pay[p];
          const payer = p === PAYER;
          return (
            <div key={sp.name} className="srow" style={{ "--i": p } as CSSProperties}>
              <div className="srow-top">
                <span className={`avatar p-${p}`}>{sp.name[0]}</span>
                <span className="name">{sp.name}</span>
                <span className="amt">{rp(sp.amount)}</span>
              </div>
              <div className="desc">description: {sp.description ? `"${sp.description}"` : "null"}</div>
              {payer ? (
                <div className="state-line">
                  <span className="flag on">payer</span>
                  <span className="faint">covered the bill, nothing to pay back</span>
                </div>
              ) : (
                <>
                  <div className="state-line">
                    <span className={`flag ${state.isPaid ? "on" : ""}`}>isPaid</span>
                    <span className={`flag ${state.isPaid ? "on" : ""}`}>paymentProof</span>
                    <span className={`flag ${state.isValidated ? "on" : state.isPaid ? "warn" : ""}`}>isValidated</span>
                  </div>
                  <div className="mini-actions">
                    {!state.isPaid && (
                      <button type="button" onClick={() => set(p, { isPaid: true, isValidated: false })} disabled={!sp.amount}>
                        {sp.name} uploads a transfer photo
                      </button>
                    )}
                    {state.isPaid && !state.isValidated && (
                      <>
                        <button type="button" onClick={() => set(p, { isPaid: true, isValidated: true })}>
                          {PEOPLE[PAYER]} confirms
                        </button>
                        <button type="button" onClick={() => set(p, UNPAID)}>
                          {PEOPLE[PAYER]} declines
                        </button>
                      </>
                    )}
                    {state.isValidated && <span className="faint">Settled</span>}
                  </div>
                </>
              )}
            </div>
          );
        })}
        <p className="split-sum" aria-live="polite">
          {owed > 0 ? (
            <>
              {PEOPLE[PAYER]} is still owed <b>{rp(owed)}</b>
            </>
          ) : (
            <b>Everyone has paid {PEOPLE[PAYER]} back.</b>
          )}
        </p>
      </div>
    </div>
  );
}
