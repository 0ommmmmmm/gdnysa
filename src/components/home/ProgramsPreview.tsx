import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { ProgramCard } from "@/components/programs/ProgramCard";
import { useProgramModal } from "@/components/programs/ProgramModalProvider";
import { PROGRAMS } from "@/data/programs";

export function ProgramsPreview() {
  const { openProgram } = useProgramModal();

  return (
    <section className="relative py-20">
      <div className="container mx-auto px-4 lg:px-6">
        {/* Section Header */}
        <ScrollReveal>
          <div className="mb-12 text-center">
            <h2 className="mb-4 font-serif text-3xl font-bold text-foreground md:text-4xl">
              Mentorship <span className="text-primary">Programs</span>
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Choose the programme that best fits your preparation needs and goals.
            </p>
          </div>
        </ScrollReveal>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PROGRAMS.map((program, index) => (
            <ScrollReveal key={program.id} delay={index * 0.1}>
              <ProgramCard program={program} onViewDetails={openProgram} />
            </ScrollReveal>
          ))}
        </div>

        {/* View All Link */}
        <ScrollReveal delay={0.5}>
          <div className="mt-10 text-center">
            <Link
              to="/programs"
              className="inline-flex items-center gap-2 font-medium text-primary transition-colors hover:text-primary/80"
            >
              View Program Details
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
