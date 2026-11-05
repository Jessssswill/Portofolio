import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { intro, profile } from "@/data/site";
import { hilbertPath } from "@/lib/hilbert";

export const alt = `${profile.name}, portfolio`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const serif = await readFile(join(process.cwd(), "src/assets/og/Newsreader-Medium.woff"));
const mono = await readFile(join(process.cwd(), "src/assets/og/IBMPlexMono-Regular.woff"));

// Order-4 Hilbert curve, same mark as the site, drawn as one path.
function curve(side: number) {
  const n = 16;
  const cell = side / n;
  return hilbertPath(n)
    .map(([x, y], i) => `${i ? "L" : "M"}${((x + 0.5) * cell).toFixed(1)} ${((y + 0.5) * cell).toFixed(1)}`)
    .join(" ");
}

export default async function Image() {
  const side = 380;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#f4f1ea",
          color: "#1c1b18",
          padding: "64px 72px",
          fontFamily: "Newsreader",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1, paddingRight: 48 }}>
          <div style={{ display: "flex", fontFamily: "Plex Mono", fontSize: 24, color: "#57534b" }}>
            Software Engineering · BINUS University
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 104, lineHeight: 1, letterSpacing: "-0.03em" }}>{profile.name}</div>
            <div style={{ marginTop: 24, fontSize: 40, lineHeight: 1.2, color: "#57534b", maxWidth: 640 }}>
              {intro.headline.replace(/^I'm Will\.\s*/, "")}
            </div>
          </div>
          <div style={{ display: "flex", fontFamily: "Plex Mono", fontSize: 22, color: "#8a857a" }}>
            PlayHub · OKACHU · Trisenpai · SplitIt
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <svg width={side} height={side} viewBox={`0 0 ${side} ${side}`}>
            <path d={curve(side)} fill="none" stroke="#d9480f" strokeWidth={7} strokeLinecap="square" strokeLinejoin="miter" />
          </svg>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Newsreader", data: serif, style: "normal", weight: 500 },
        { name: "Plex Mono", data: mono, style: "normal", weight: 400 },
      ],
    },
  );
}
