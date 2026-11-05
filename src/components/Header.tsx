import Link from "next/link";
import { profile } from "@/data/site";
import { publicFile } from "@/lib/assets";
import { HilbertMark } from "./Icons";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  const cv = publicFile("cv.pdf");
  return (
    <header className="site-header">
      <div className="wrap">
        <Link href="/" className="brand" aria-label={`${profile.name}, home`}>
          <HilbertMark />
          {profile.name}
        </Link>
        <nav className="nav" aria-label="Main">
          <Link href="/#work">Work</Link>
          <Link href="/#about" className="nav-extra">
            About
          </Link>
          <Link href="/#contact">Contact</Link>
          {cv && (
            <a href={cv} target="_blank" rel="noreferrer">
              CV
            </a>
          )}
          <ThemeToggle />
        </nav>
      </div>
      <span className="progress" aria-hidden="true" />
    </header>
  );
}
