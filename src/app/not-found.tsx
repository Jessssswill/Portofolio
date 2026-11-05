import Link from "next/link";
import { ArrowLeft } from "@/components/Icons";

export default function NotFound() {
  return (
    <section className="lost">
      <div className="wrap">
        <p className="mono faint">404</p>
        <h1>Nothing lives at this address.</h1>
        <p>The link might have a typo, or the page moved when I reorganised the site.</p>
        <p>
          <Link href="/" className="textlink">
            <ArrowLeft /> Back to the homepage
          </Link>
        </p>
      </div>
    </section>
  );
}
