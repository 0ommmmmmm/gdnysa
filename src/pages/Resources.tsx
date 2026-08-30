import { Layout } from "@/components/layout/Layout";
import { GlassCard } from "@/components/ui/GlassCard";
import { CalendarDays, Calendar, CalendarRange, Download } from "lucide-react";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { ParallaxBackground } from "@/components/animations/ParallaxBackground";

const resources = [
  {
    icon: CalendarDays,
    title: "Daily Study Planner",
    description: "Plan your daily study sessions, track your tasks, study type, concept clarity, doubts, and daily geology revision.",
    category: "Daily Planning",
    downloadPath: "/Daily%20planner%20(2).pdf",
  },
  {
    icon: Calendar,
    title: "Weekly Study Planner",
    description: "Organize your weekly subjects, schedule, tasks, strengths, weaknesses, and focus areas for quick revision.",
    category: "Weekly Planning",
    downloadPath: "/Weekly%20Planner%20(2).pdf",
  },
  {
    icon: CalendarRange,
    title: "Monthly Study Planner",
    description: "Plan your month with a calendar, study targets, important dates, and notes to stay consistent with your preparation.",
    category: "Monthly Planning",
    downloadPath: "/Monthly%20Planner%20(2).pdf",
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
                Free study planners designed to help you organize your geology exam preparation and stay consistent.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Resources Grid */}
      <section className="pb-20">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource, index) => (
              <ScrollReveal key={resource.title} delay={index * 0.1}>
                <GlassCard className="p-8 group h-full flex flex-col">
                  <div className="flex items-start gap-4 mb-4">
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
                      <p className="text-muted-foreground text-sm">
                        {resource.description}
                      </p>
                    </div>
                  </div>
                  <div className="mt-auto pt-4">
                    <a
                      href={resource.downloadPath}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-primary text-sm font-medium hover:text-primary/80 transition-colors"
                    >
                      Download Planner
                      <Download className="w-4 h-4" />
                    </a>
                  </div>
                </GlassCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
