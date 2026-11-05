// Hilbert curve helpers. `n` is the side of the square and must be a power of 2.
// d2xy turns a position along the curve into an (x, y) cell.
// Used to draw the curve on the link preview image (opengraph-image.tsx).

function rotate(n: number, x: number, y: number, rx: number, ry: number): [number, number] {
  if (ry === 0) {
    if (rx === 1) {
      x = n - 1 - x;
      y = n - 1 - y;
    }
    return [y, x];
  }
  return [x, y];
}

export function d2xy(n: number, d: number): [number, number] {
  let x = 0;
  let y = 0;
  let t = d;
  for (let s = 1; s < n; s *= 2) {
    const rx = 1 & (t / 2);
    const ry = 1 & (t ^ rx);
    [x, y] = rotate(s, x, y, rx, ry);
    x += s * rx;
    y += s * ry;
    t = Math.floor(t / 4);
  }
  return [x, y];
}

/** Every cell of an n x n square in curve order. */
export function hilbertPath(n: number): [number, number][] {
  const out: [number, number][] = new Array(n * n);
  for (let d = 0; d < n * n; d++) out[d] = d2xy(n, d);
  return out;
}
