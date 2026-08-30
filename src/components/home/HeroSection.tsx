import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { FloatingElement } from "@/components/animations/ParallaxBackground";
import heroBackground from "@/assets/hero-geology-bg.jpg";

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Image with Parallax Effect */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBackground})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
      </div>

      {/* Floating geological elements with animation */}
      <FloatingElement 
        className="absolute top-20 right-10" 
        size="lg" 
        color="primary" 
        delay={0} 
      />
      <FloatingElement 
        className="absolute bottom-40 left-10" 
        size="lg" 
        color="accent" 
        delay={2} 
      />
      <FloatingElement 
        className="absolute top-1/2 right-1/4" 
        size="md" 
        color="secondary" 
        delay={4} 
      />
      <FloatingElement 
        className="absolute top-1/3 left-1/4" 
        size="sm" 
        color="primary" 
        delay={1} 
      />

      <div className="container mx-auto px-4 lg:px-6 relative z-10">
        <div className="max-w-3xl">
          {/* Badge */}
          <ScrollReveal delay={0}>
            <div className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">
                Expert Geology Mentorship
              </span>
            </div>
          </ScrollReveal>

          {/* Heading */}
          <ScrollReveal delay={0.1}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 font-serif leading-tight">
              Personalized Mentorship for{" "}
              <span className="text-primary">Competitive Geology Exams</span>
            </h1>
          </ScrollReveal>

          {/* Subheading */}
          <ScrollReveal delay={0.2}>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
              Prepare for CSIR-NET, GATE, IIT JAM, and University Geology Exams 
              with structured guidance, expert mentorship, and proven strategies.
            </p>
          </ScrollReveal>

          {/* CTA Buttons */}
          <ScrollReveal delay={0.3}>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/join"
                className="glass-button inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-4 text-lg font-medium"
              >
                Join the Mentorship
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/programs"
                className="glass-button inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-medium text-foreground hover:bg-secondary/50"
              >
                Explore Programs
              </Link>
            </div>
          </ScrollReveal>

          {/* Stats */}
          <ScrollReveal delay={0.4}>
            <div className="grid grid-cols-3 gap-6 mt-12">
              {[
                { value: "100+", label: "Students Mentored" },
                { value: "85%", label: "Success Rate" },
                { value: "2+", label: "Years Experience" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-primary">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
