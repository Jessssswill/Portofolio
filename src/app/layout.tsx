import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { profile } from "@/data/site";
import { siteUrl } from "@/lib/url";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { RevealObserver } from "@/components/RevealObserver";
import "./globals.css";

const serif = localFont({
  src: "../fonts/Newsreader-Variable.woff2",
  weight: "200 800",
  style: "normal",
  variable: "--font-serif",
  display: "swap",
  fallback: ["Iowan Old Style", "Palatino Linotype", "Georgia", "serif"],
  adjustFontFallback: "Times New Roman",
});

// Italic is only used for a few words on the case studies, so it isn't
// preloaded. The browser fetches it the first time italic text shows up.
const serifItalic = localFont({
  src: "../fonts/Newsreader-Variable-Italic.woff2",
  weight: "200 800",
  style: "italic",
  variable: "--font-serif-italic",
  display: "swap",
  preload: false,
  fallback: ["Georgia", "serif"],
});

const mono = localFont({
  src: [
    { path: "../fonts/IBMPlexMono-Regular.woff2", weight: "400", style: "normal" },
    { path: "../fonts/IBMPlexMono-Medium.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-mono",
  display: "swap",
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
    { media: "(prefers-color-scheme: light)", color: "#f4f1ea" },
    { media: "(prefers-color-scheme: dark)", color: "#141311" },
  ],
};

// Runs before first paint so a saved theme never flashes.
const themeScript = `try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${serifItalic.variable} ${mono.variable}`} suppressHydrationWarning>
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
