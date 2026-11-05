import { ViewTransition } from "react";
import Link from "next/link";
import type { Project } from "@/data/site";
import { Rich } from "./Rich";
import { ArrowRight, ArrowUpRight } from "./Icons";
import { ProjectFigure } from "./ProjectFigure";

const pad = (n: number) => String(n).padStart(2, "0");

export function ProjectEntry({ project: p, index }: { project: Project; index: number }) {
  const href = `/work/${p.slug}`;
  return (
    <article className="project" id={p.slug} aria-labelledby={`${p.slug}-title`}>
      <div className="project-text" data-reveal="">
        <p className="project-num mono">
          <b>{pad(index + 1)}</b>
          <span>{p.year}</span>
          <span>{p.context}</span>
        </p>
        <h3 id={`${p.slug}-title`}>
          <Link href={href}>
            {/* Same name as the title on the case study page, so it morphs between the two. */}
            <ViewTransition name={`title-${p.slug}`} share="morph" default="none">
              <span className="vt-title">{p.title}</span>
            </ViewTransition>
          </Link>
        </h3>
        <p className="project-line">{p.line}</p>
        <dl className="meta mono">
          <dt>Role</dt>
          <dd>{p.role}</dd>
          <dt>Team</dt>
          <dd>{p.team}</dd>
          <dt>{p.stackLabel ?? "Stack"}</dt>
          <dd>{p.stack.join(", ")}</dd>
        </dl>
        <p className="project-summary">
          <Rich text={p.summary} />
        </p>
        <div className="project-links">
          <Link className="textlink primary" href={href}>
            Read the case study <ArrowRight />
          </Link>
          {p.links.map((l) => (
            <a key={l.href} className="textlink" href={l.href} target="_blank" rel="noreferrer">
              {l.label} <ArrowUpRight />
            </a>
          ))}
        </div>
      </div>
      <ProjectFigure project={p} num={index + 1} />
    </article>
  );
}
