import { profile } from "@/data/site";
import { PageWeight } from "./PageWeight";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap mono">
        <span>
          © {new Date().getFullYear()} {profile.name}. Built with Next.js, set in Schibsted Grotesk and Martian Mono.
        </span>
        <PageWeight />
      </div>
    </footer>
  );
}
