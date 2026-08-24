import { 
  Users, 
  BookOpen, 
  Video, 
  FileCheck, 
  Lightbulb 
} from "lucide-react";
import { GlassCard, GlassCardTitle, GlassCardContent } from "@/components/ui/GlassCard";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { ParallaxBackground } from "@/components/animations/ParallaxBackground";

const features = [
  {
    icon: Users,
    title: "Personalized One-to-One Mentorship",
    description: "Get dedicated attention with customized guidance tailored to your learning pace and goals.",
  },
  {
    icon: BookOpen,
    title: "Structured & Exam-Oriented Study Plans",
    description: "Follow a systematic approach designed specifically for competitive geology examinations.",
  },
  {
    icon: Video,
    title: "Live and Recorded Classes",
    description: "Access both interactive live sessions and recorded content for flexible learning.",
  },
  {
    icon: FileCheck,
    title: "Regular Mock Tests & Performance Analysis",
    description: "Track your progress with frequent assessments and detailed performance insights.",
  },
  {
    icon: Lightbulb,
    title: "Concept Clarity with Practical Understanding",
    description: "Build strong foundations with emphasis on understanding over memorization.",
  },
];

export function WhyGDnyasa() {
  return (
    <section className="py-20 relative overflow-hidden">
      <ParallaxBackground className="absolute inset-0" />

      <div className="container mx-auto px-4 lg:px-6 relative z-10">
        {/* Section Header */}
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground font-serif mb-4">
              Why <span className="text-primary">G-Dnyasa</span>?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover what makes our mentorship program unique and effective 
              for geology exam preparation.
            </p>
          </div>
        </ScrollReveal>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <ScrollReveal key={feature.title} delay={index * 0.1}>
              <GlassCard>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <GlassCardTitle className="text-lg mb-2">
                      {feature.title}
                    </GlassCardTitle>
                    <GlassCardContent className="text-sm">
                      {feature.description}
                    </GlassCardContent>
                  </div>
                </div>
              </GlassCard>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
