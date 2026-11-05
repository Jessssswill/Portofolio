import { ViewTransition, type CSSProperties } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects } from "@/data/site";
import { cases, type Block } from "@/data/cases";
import { screenshots } from "@/lib/assets";
import { Rich } from "@/components/Rich";
import { Code } from "@/components/Code";
import { ArrowLeft, ArrowUpRight } from "@/components/Icons";
import { ProjectFigure } from "@/components/ProjectFigure";

type Props = { params: Promise<{ slug: string }> };

const pad = (n: number) => String(n).padStart(2, "0");

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = projects.find((x) => x.slug === slug);
  if (!p) return {};
  return {
    title: p.title,
    description: p.line,
    alternates: { canonical: `/work/${p.slug}` },
    openGraph: { title: p.title, description: p.line, type: "article" },
  };
}

export default async function CasePage({ params }: Props) {
  const { slug } = await params;
  const index = projects.findIndex((x) => x.slug === slug);
  if (index < 0) notFound();

  const p = projects[index];
  const prev = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];
  const blocks = cases[p.slug] ?? [];
  const shots = screenshots(p.slug);

  return (
    <article>
      <header className="case-head">
        <div className="wrap">
          <Link href={`/#${p.slug}`} className="back">
            <ArrowLeft /> All work
          </Link>
          <p className="project-num mono">
            <b>{pad(index + 1)}</b>
            <span>{p.year}</span>
            <span>{p.context}</span>
          </p>
          <h1 className="case-title">
            <ViewTransition name={`title-${p.slug}`} share="morph" default="none">
              <span className="vt-title">{p.title}</span>
            </ViewTransition>
          </h1>
          <p className="case-line">{p.line}</p>
          <dl className="case-meta">
            <div>
              <dt className="mono">Role</dt>
              <dd>{p.role}</dd>
            </div>
            <div>
              <dt className="mono">Team</dt>
              <dd>{p.team}</dd>
            </div>
            <div>
              <dt className="mono">{p.stackLabel ?? "Stack"}</dt>
              <dd>{p.stack.join(", ")}</dd>
            </div>
            <div>
              <dt className="mono">Links</dt>
              <dd>
                {p.links.length ? (
                  p.links.map((l) => (
                    <span key={l.href} style={{ display: "block" }}>
                      <a href={l.href} target="_blank" rel="noreferrer">
                        {l.label} <ArrowUpRight />
                      </a>
                    </span>
                  ))
                ) : (
                  <span className="faint">No public link yet</span>
                )}
              </dd>
            </div>
          </dl>
        </div>
      </header>

      <div className="wrap">
        <div className="case-body">
          {blocks.map((b, i) => (
            <BlockView key={i} block={b} project={p} />
          ))}

          {shots.length > 0 && (
            <>
              <h2>Screenshots</h2>
              <div className="gallery wide">
                {shots.map((s) => (
                  <figure key={s.src}>
                    <Image
                      src={s.src}
                      width={s.width}
                      height={s.height}
                      alt={s.caption || `${p.title} screenshot`}
                      sizes="(max-width: 700px) 100vw, 460px"
                    />
                    {s.caption && <figcaption>{s.caption}</figcaption>}
                  </figure>
                ))}
              </div>
            </>
          )}
        </div>

        <nav className="pn" aria-label="More projects">
          <Link href={`/work/${prev.slug}`}>
            <span className="mono">Previous</span>
            <b>{prev.title}</b>
          </Link>
          <Link href={`/work/${next.slug}`}>
            <span className="mono">Next</span>
            <b>{next.title}</b>
          </Link>
        </nav>
      </div>
    </article>
  );
}

function BlockView({ block: b, project }: { block: Block; project: (typeof projects)[number] }) {
  switch (b.type) {
    case "h":
      return <h2 data-reveal="">{b.text}</h2>;
    case "p":
      return (
        <p data-reveal="">
          <Rich text={b.text} />
        </p>
      );
    case "note":
      return (
        <p className="note" data-reveal="">
          <Rich text={b.text} />
        </p>
      );
    case "list":
      return (
        <ul data-reveal="">
          {b.items.map((t) => (
            <li key={t}>
              <Rich text={t} />
            </li>
          ))}
        </ul>
      );
    case "code":
      return <Code code={b.code} file={b.file} lang={b.lang} />;
    case "table":
      return (
        <div className="wide" style={{ overflowX: "auto" }} data-reveal="">
          <table className="table">
            <thead>
              <tr>
                {b.head.map((h, i) => (
                  <th key={h} className={b.numeric?.includes(i) ? "num" : undefined}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {b.rows.map((r) => (
                <tr key={r[0]}>
                  {r.map((c, i) => (
                    <td key={i} className={b.numeric?.includes(i) ? "num" : undefined}>
                      <Rich text={c} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "stats":
      return (
        <div className="stats wide" data-reveal="stagger">
          {b.items.map((s, i) => (
            <div key={s.label} style={{ "--i": i } as CSSProperties}>
              <b>{s.value}</b>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      );
    case "figure":
      return <ProjectFigure project={project} num={1} className="wide" />;
  }
}
