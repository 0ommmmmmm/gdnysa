import { BookOpen, Target, Compass, ListChecks, type LucideProps } from "lucide-react";
import type { Program } from "@/data/programs";

const MAP = { BookOpen, Target, Compass, ListChecks } as const;

export function ProgramIcon({
  icon,
  ...props
}: { icon: Program["icon"] } & LucideProps) {
  const Icon = MAP[icon] ?? BookOpen;
  return <Icon {...props} />;
}
