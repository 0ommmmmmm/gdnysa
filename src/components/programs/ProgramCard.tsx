import { ArrowRight } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { ProgramIcon } from "@/components/programs/ProgramIcon";
import { INR, type Program } from "@/data/programs";

interface ProgramCardProps {
  program: Program;
  onViewDetails: (program: Program) => void;
}

export function ProgramCard({ program, onViewDetails }: ProgramCardProps) {
  return (
    <GlassCard
      role="button"
      tabIndex={0}
      onClick={() => onViewDetails(program)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onViewDetails(program);
        }
      }}
      aria-label={`View details for ${program.title}`}
      className="flex h-full cursor-pointer flex-col text-left transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
        <ProgramIcon icon={program.icon} className="h-7 w-7 text-primary" />
      </div>

      <h3 className="font-serif text-xl font-bold text-foreground">
        {program.title}
      </h3>

      <p className="mt-2 flex-1 text-sm text-muted-foreground">
        {program.shortDescription}
      </p>

      <p className="mt-4 text-sm text-muted-foreground">
        Starting at{" "}
        <span className="text-lg font-semibold text-primary">
          {INR(program.startingPrice)}
        </span>
      </p>

      <span className="glass-button mt-5 inline-flex items-center justify-center gap-2 text-sm font-medium">
        View Details
        <ArrowRight className="h-4 w-4" />
      </span>
    </GlassCard>
  );
}
