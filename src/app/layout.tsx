import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { profile } from "@/data/site";
import { siteUrl } from "@/lib/url";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { RevealObserver } from "@/components/RevealObserver";
import "./globals.css";

// Schibsted Grotesk for everything you read, Martian Mono for small labels
// and code. Both are variable fonts, so one file covers every weight.
const sans = localFont({
  src: "../fonts/SchibstedGrotesk-Variable.woff2",
  weight: "400 900",
  style: "normal",
  variable: "--font-sans",
  display: "swap",
  fallback: ["Helvetica Neue", "Arial", "sans-serif"],
  adjustFontFallback: "Arial",
});

// Italic is only used for a few words on the case studies, so it isn't
// preloaded. The browser fetches it the first time italic text shows up.
const sansItalic = localFont({
  src: "../fonts/SchibstedGrotesk-Variable-Italic.woff2",
  weight: "400 900",
  style: "italic",
  variable: "--font-sans-italic",
  display: "swap",
  preload: false,
  fallback: ["Arial", "sans-serif"],
});

// Martian Mono cut down to the weights the site uses (400 to 600) plus the
// width axis from 75% to 100%. The diagrams use the narrow end so long
// method names still fit on one line.
const mono = localFont({
  src: "../fonts/MartianMono-Variable.woff2",
  weight: "400 600",
  style: "normal",
  variable: "--font-mono",
  display: "swap",
  declarations: [{ prop: "font-stretch", value: "75% 100%" }],
  fallback: ["ui-monospace", "Menlo", "Consolas", "monospace"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${profile.name} · Software Engineering student`,
    template: `%s · ${profile.name}`,
  },
  description: profile.description,
  authors: [{ name: profile.name, url: profile.github }],
  openGraph: {
    type: "website",
    siteName: profile.name,
    title: `${profile.name} · Software Engineering student`,
    description: profile.description,
    locale: "en_US",
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafaf8" },
    { media: "(prefers-color-scheme: dark)", color: "#0f1211" },
  ],
};

// Runs before first paint so a saved theme never flashes.
const themeScript = `try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${sansItalic.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <RevealObserver />
      </body>
    </html>
  );
}
