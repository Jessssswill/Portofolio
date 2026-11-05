import { Suspense } from "react";
import type { Project } from "@/data/site";
import { Figure } from "./figures/Figure";
import { MoveTrace } from "./figures/MoveTrace";
import { RaceCondition } from "./figures/RaceCondition";
import { CourseMap } from "./figures/CourseMap";
import { ItemSplit } from "./figures/ItemSplit";

const FIGURES: Record<string, () => React.ReactNode> = {
  playhub: () => <MoveTrace />,
  okachu: () => <RaceCondition />,
  trisenpai: () => <CourseMap />,
  splitit: () => <ItemSplit />,
};

export function ProjectFigure({ project, num, className }: { project: Project; num: number; className?: string }) {
  const render = FIGURES[project.slug];
  if (!render) return null;
  return (
    <Figure num={num} title={project.figure.title} caption={project.figure.caption} className={className}>
      {/* Each figure hydrates on its own, so the page never does it in one long task. */}
      <Suspense>{render()}</Suspense>
    </Figure>
  );
}
