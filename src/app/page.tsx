import { Fragment, type CSSProperties } from "react";
import Image from "next/image";
import { about, contact, experience, intro, otherWork, profile, projects, tools } from "@/data/site";
import { findPortrait, publicFile } from "@/lib/assets";
import { Rich } from "@/components/Rich";
import { ArrowRight, ArrowUpRight } from "@/components/Icons";
import { ProjectEntry } from "@/components/ProjectEntry";
import { Headline } from "@/components/Headline";

const stagger = (i: number) => ({ "--i": i }) as CSSProperties;

export default function Home() {
  const cv = publicFile("cv.pdf");
  const portrait = findPortrait();
  const years = projects.map((p) => Number(p.year)).filter(Boolean);

  return (
    <>
      <section className="intro" aria-labelledby="intro-title">
        <div className="wrap">
          <div>
            <p className="kicker mono">{intro.kicker}</p>
            <h1 id="intro-title" className="headline">
              <Headline text={intro.headline} mark={intro.headlineMark} />
            </h1>
            <div className="intro-copy">
              {intro.paragraphs.map((p) => (
                <p key={p}>
                  <Rich text={p} />
                </p>
              ))}
            </div>
            <dl className="facts mono">
              {intro.facts.map((f) => (
                <div key={f.label} style={{ display: "contents" }}>
                  <dt>{f.label}</dt>
                  <dd>{f.value}</dd>
                </div>
              ))}
            </dl>
            <div className="actions">
              <a className="btn" href={`mailto:${profile.email}`}>
                Email me
              </a>
              <a className="textlink" href={profile.github} target="_blank" rel="noreferrer">
                GitHub <ArrowUpRight />
              </a>
              <a className="textlink" href={profile.linkedin} target="_blank" rel="noreferrer">
                LinkedIn <ArrowUpRight />
              </a>
              {cv && (
                <a className="textlink" href={cv} target="_blank" rel="noreferrer">
                  CV, PDF <ArrowUpRight />
                </a>
              )}
            </div>
          </div>

          <nav className="glance" aria-label="Projects at a glance">
            <div className="glance-head mono">
              <span>At a glance</span>
              <span className="faint">{projects.length} projects</span>
            </div>
            <ol>
              {projects.map((p, i) => (
                <li key={p.slug} style={stagger(i)}>
                  <a href={`#${p.slug}`}>
                    <span className="n mono">{String(i + 1).padStart(2, "0")}</span>
                    <span className="t">{p.title}</span>
                    <ArrowRight />
                    <span className="d">{p.short}</span>
                    <span className="p mono">{p.proof}</span>
                  </a>
                </li>
              ))}
            </ol>
            <p className="glance-foot">Each one has a small diagram further down that you can actually try.</p>
          </nav>
        </div>
      </section>

      <section id="work" className="section" aria-labelledby="work-title">
        <div className="wrap">
          <div className="sec-head" data-reveal="line">
            <h2 id="work-title">Selected work</h2>
            <span className="mono">
              {projects.length} projects, {Math.min(...years)} to {Math.max(...years)}
            </span>
          </div>
          {projects.map((p, i) => (
            <ProjectEntry key={p.slug} project={p} index={i} />
          ))}
        </div>
      </section>

      <section id="other" className="section" aria-labelledby="other-title">
        <div className="wrap">
          <div className="sec-head" data-reveal="line">
            <h2 id="other-title">Other things I&apos;ve made</h2>
            <span className="mono">Class projects, clubs, side projects</span>
          </div>
          <ul className="others" data-reveal="stagger">
            {otherWork.map((o, i) => (
              <li key={o.title} className="other" style={stagger(i)}>
                <span className="yr mono">{o.year}</span>
                <h3>
                  {o.href ? (
                    <a href={o.href} target="_blank" rel="noreferrer">
                      {o.title}
                      <ArrowUpRight />
                    </a>
                  ) : (
                    o.title
                  )}
                </h3>
                <p>{o.what}</p>
                <div className="ctx mono">
                  {o.stack}
                  <span>{o.context}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="about" className="section" aria-labelledby="about-title">
        <div className="wrap">
          <div className="sec-head" data-reveal="line">
            <h2 id="about-title">About</h2>
            <span className="mono">{profile.location}</span>
          </div>
          <div className="about">
            <div className="about-side" data-reveal="">
              {portrait && (
                <div className="portrait">
                  <Image
                    src={portrait.src}
                    width={portrait.width}
                    height={portrait.height}
                    sizes="(max-width: 860px) 280px, 320px"
                    alt={`Photo of ${profile.name}`}
                  />
                </div>
              )}
              <dl className="facts mono" style={{ marginTop: 0 }}>
                <dt>Name</dt>
                <dd>
                  {profile.name} ({profile.shortName})
                </dd>
                <dt>Studying</dt>
                <dd>Computer Science, BINUS</dd>
                <dt>Graduating</dt>
                <dd>2028</dd>
                <dt>Languages</dt>
                <dd>English, Bahasa Indonesia</dd>
              </dl>
            </div>
            <div className="about-copy" data-reveal="" style={{ "--d": 120 } as CSSProperties}>
              {about.paragraphs.map((p) => (
                <p key={p}>
                  <Rich text={p} />
                </p>
              ))}
            </div>
          </div>

          <h3 className="subhead" data-reveal="">Experience</h3>
          <ol className="xp" data-reveal="stagger">
            {experience.map((r, i) => (
              <li key={r.title + r.org} style={stagger(i)}>
                <span className="when mono">{r.when}</span>
                <div className="what">
                  <p className="role">
                    {r.title}
                    <span className="org">{r.org}</span>
                  </p>
                  {r.note && <p className="note">{r.note}</p>}
                </div>
              </li>
            ))}
          </ol>

          <h3 className="subhead" data-reveal="">Tools</h3>
          <ul className="tools" data-reveal="stagger">
            {tools.map((g, i) => (
              <li key={g.group} style={stagger(i)}>
                <span className="g mono">{g.group}</span>
                <p className="items">
                  {g.items.map((t, i) => (
                    <Fragment key={t}>
                      {i > 0 && " "}
                      <span>{t}</span>
                    </Fragment>
                  ))}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="contact" className="section contact" aria-labelledby="contact-title">
        <div className="wrap">
          <div className="sec-head" data-reveal="line">
            <h2 id="contact-title">Contact</h2>
            <span className="mono">Open to freelance work</span>
          </div>
          <p className="contact-line" data-reveal="">
            {contact.line}
          </p>
          <a className="big-mail" href={`mailto:${profile.email}`} data-reveal="" style={{ "--d": 120 } as CSSProperties}>
            {profile.email}
          </a>
          <div className="contact-links" data-reveal="" style={{ "--d": 220 } as CSSProperties}>
            <a className="textlink" href={profile.github} target="_blank" rel="noreferrer">
              GitHub <ArrowUpRight />
            </a>
            <a className="textlink" href={profile.linkedin} target="_blank" rel="noreferrer">
              LinkedIn <ArrowUpRight />
            </a>
            {cv && (
              <a className="textlink" href={cv} target="_blank" rel="noreferrer">
                CV, PDF <ArrowUpRight />
              </a>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
