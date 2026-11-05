import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { intro, profile } from "@/data/site";
import { hilbertPath } from "@/lib/hilbert";

export const alt = `${profile.name}, portfolio`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const og = (file: string) => readFile(join(process.cwd(), "src/assets/og", file));
const [sansRegular, sansSemi, mono] = await Promise.all([
  og("SchibstedGrotesk-Regular.woff"),
  og("SchibstedGrotesk-SemiBold.woff"),
  og("MartianMono-Regular.woff"),
]);

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
          background: "#fafaf8",
          color: "#121413",
          padding: "64px 72px",
          fontFamily: "Schibsted Grotesk",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1, paddingRight: 48 }}>
          <div style={{ display: "flex", fontFamily: "Martian Mono", fontSize: 20, letterSpacing: "-0.01em", color: "#4e5350" }}>
            Software Engineering · BINUS University
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 104, fontWeight: 600, lineHeight: 1, letterSpacing: "-0.045em" }}>{profile.name}</div>
            <div style={{ marginTop: 24, fontSize: 40, fontWeight: 400, lineHeight: 1.2, letterSpacing: "-0.02em", color: "#4e5350", maxWidth: 640 }}>
              {intro.headline.replace(/^I'm Will\.\s*/, "")}
            </div>
          </div>
          <div style={{ display: "flex", fontFamily: "Martian Mono", fontSize: 18, letterSpacing: "-0.01em", color: "#646965" }}>
            PlayHub · OKACHU · Trisenpai · SplitIt
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <svg width={side} height={side} viewBox={`0 0 ${side} ${side}`}>
            <path d={curve(side)} fill="none" stroke="#0e7c58" strokeWidth={7} strokeLinecap="square" strokeLinejoin="miter" />
          </svg>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Schibsted Grotesk", data: sansRegular, style: "normal", weight: 400 },
        { name: "Schibsted Grotesk", data: sansSemi, style: "normal", weight: 600 },
        { name: "Martian Mono", data: mono, style: "normal", weight: 400 },
      ],
    },
  );
}
