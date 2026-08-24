import { Layout } from "@/components/layout/Layout";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { ParallaxBackground } from "@/components/animations/ParallaxBackground";
import { ProgramCard } from "@/components/programs/ProgramCard";
import { useProgramModal } from "@/components/programs/ProgramModalProvider";
import { PROGRAMS } from "@/data/programs";

export default function Programs() {
  const { openProgram } = useProgramModal();

  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden py-16">
        <ParallaxBackground className="absolute inset-0" />
        <div className="container relative z-10 mx-auto px-4 lg:px-6">
          <ScrollReveal>
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="mb-6 font-serif text-4xl font-bold text-foreground md:text-5xl">
                Mentorship <span className="text-primary">Programs</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Choose the programme that best aligns with your preparation
                needs, learning style and examination goals.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Program Cards */}
      <section className="pb-20">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PROGRAMS.map((program, index) => (
              <ScrollReveal key={program.id} delay={index * 0.1}>
                <ProgramCard program={program} onViewDetails={openProgram} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
