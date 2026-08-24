import { Layout } from "@/components/layout/Layout";
import { GlassCard } from "@/components/ui/GlassCard";
import { BookOpen, AlertCircle, Calendar, ListChecks, ArrowRight } from "lucide-react";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { ParallaxBackground } from "@/components/animations/ParallaxBackground";

const resources = [
  {
    icon: AlertCircle,
    title: "Top 5 Mistakes Students Make in GATE Geology",
    description: "Learn about common pitfalls and how to avoid them during your GATE preparation.",
    category: "GATE Tips",
  },
  {
    icon: Calendar,
    title: "IIT JAM Geology Revision Strategy",
    description: "Effective revision techniques and time management for IIT JAM aspirants.",
    category: "IIT JAM",
  },
  {
    icon: ListChecks,
    title: "Important Topics for CSIR-NET Geology",
    description: "Comprehensive list of high-weightage topics for CSIR-NET examination.",
    category: "CSIR-NET",
  },
  {
    icon: BookOpen,
    title: "How to Plan Geology Preparation Effectively",
    description: "Step-by-step guide to creating a structured study plan for competitive exams.",
    category: "General",
  },
];

export default function Resources() {
  return (
    <Layout>
      {/* Hero */}
      <section className="py-16 relative overflow-hidden">
        <ParallaxBackground className="absolute inset-0" />
        <div className="container mx-auto px-4 lg:px-6 relative z-10">
          <ScrollReveal>
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground font-serif mb-6">
                Free Learning <span className="text-primary">Resources</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Access valuable study materials, tips, and strategies to enhance 
                your geology exam preparation.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Resources Grid */}
      <section className="pb-20">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="grid md:grid-cols-2 gap-6">
            {resources.map((resource, index) => (
              <ScrollReveal key={resource.title} delay={index * 0.1}>
                <GlassCard className="p-8 group cursor-pointer h-full">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                      <resource.icon className="w-7 h-7 text-primary" />
                    </div>
                    <div className="flex-1">
                      <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                        {resource.category}
                      </span>
                      <h3 className="text-xl font-semibold text-foreground mt-3 mb-2 font-serif group-hover:text-primary transition-colors">
                        {resource.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4">
                        {resource.description}
                      </p>
                      <span className="inline-flex items-center gap-1 text-primary text-sm font-medium">
                        Read More
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </GlassCard>
              </ScrollReveal>
            ))}
          </div>

          {/* Coming Soon */}
          <ScrollReveal delay={0.5}>
            <div className="mt-12 text-center">
              <GlassCard className="inline-block p-8">
                <h3 className="text-xl font-semibold text-foreground mb-2 font-serif">
                  More Resources Coming Soon
                </h3>
                <p className="text-muted-foreground text-sm">
                  Subscribe to our mentorship program for access to premium study materials.
                </p>
              </GlassCard>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </Layout>
  );
}
