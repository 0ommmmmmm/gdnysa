import { Layout } from "@/components/layout/Layout";
import { GlassCard } from "@/components/ui/GlassCard";
import { 
  GraduationCap, 
  Award, 
  Target, 
  BookOpen,
  CheckCircle
} from "lucide-react";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { ParallaxBackground } from "@/components/animations/ParallaxBackground";
import mineralsPattern from "@/assets/minerals-pattern.jpg";

const qualifications = [
  "Qualified geology mentor with strong academic background",
  "Expertise in Applied Geology and related fields",
  "Successfully cleared competitive exams like GATE and CSIR-NET",
  "Years of experience in mentoring geology aspirants",
];

const philosophyPoints = [
  {
    icon: Target,
    title: "Conceptual Clarity",
    description: "Focus on understanding fundamental concepts rather than rote memorization.",
  },
  {
    icon: BookOpen,
    title: "Consistency",
    description: "Building disciplined study habits for sustained progress.",
  },
  {
    icon: Award,
    title: "Smart Strategies",
    description: "Exam-oriented techniques to maximize performance under pressure.",
  },
];

export default function Mentor() {
  return (
    <Layout>
      {/* Hero */}
      <section className="py-16 relative overflow-hidden">
        <ParallaxBackground className="absolute inset-0" />
        <div className="container mx-auto px-4 lg:px-6 relative z-10">
          <ScrollReveal>
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground font-serif mb-6">
                Meet Your <span className="text-primary">Mentor</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Dedicated to guiding geology aspirants towards success in competitive examinations.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Mentor Profile */}
      <section className="pb-12">
        <div className="container mx-auto px-4 lg:px-6">
          <ScrollReveal delay={0.1}>
            <GlassCard className="p-8 md:p-12">
              <div className="grid md:grid-cols-5 gap-8 items-center">
                {/* Image */}
                <div className="md:col-span-2">
                  <div className="relative">
                    <div 
                      className="w-full aspect-square rounded-2xl bg-cover bg-center"
                      style={{ backgroundImage: `url(${mineralsPattern})` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-24 h-24 rounded-full bg-primary/20 backdrop-blur-sm flex items-center justify-center">
                          <GraduationCap className="w-12 h-12 text-primary" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="md:col-span-3">
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground font-serif mb-6">
                    Ms. Apoorva Pimprikar
                  </h2>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    With a passion for geology and a track record of success in competitive exams, 
                    I founded G-Dnyasa to guide students through their preparation journey.
                    My teaching philosophy is centered on building strong conceptual foundations, 
                    practicing consistently, and developing effective exam strategies.
                    I'm here to help you navigate the complexities of these exams and achieve your academic goals
                  </p>

                  <h3 className="font-semibold text-foreground mb-4">Qualifications & Experience:</h3>
                  <ul className="space-y-3 mb-8">
                    {qualifications.map((qual) => (
                      <li key={qual} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-foreground/80">{qual}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </GlassCard>
          </ScrollReveal>
        </div>
      </section>

      {/* Teaching Philosophy */}
      <section className="pb-20">
        <div className="container mx-auto px-4 lg:px-6">
          <ScrollReveal>
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-foreground font-serif mb-4">
                Teaching <span className="text-primary">Philosophy</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                A focus on building strong foundations through understanding, 
                not just memorization.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-6">
            {philosophyPoints.map((point, index) => (
              <ScrollReveal key={point.title} delay={index * 0.15}>
                <GlassCard className="text-center p-8 h-full">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <point.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3 font-serif">
                    {point.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {point.description}
                  </p>
                </GlassCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
