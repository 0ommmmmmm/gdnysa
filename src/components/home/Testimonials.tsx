import { Quote } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { ParallaxBackground } from "@/components/animations/ParallaxBackground";

const testimonials = [
  {
    quote: "The mentorship helped me structure my preparation and boosted my confidence for competitive exams. The personalized approach made all the difference.",
    name: "Priya S.",
    exam: "GATE Geology",
  },
  {
    quote: "G-Dnyasa's systematic study plans and regular mock tests were instrumental in my CSIR-NET success. Highly recommended!",
    name: "Rahul M.",
    exam: "CSIR-NET",
  },
  {
    quote: "The one-to-one mentorship provided clarity on complex geological concepts. The mentor's guidance was invaluable throughout my preparation.",
    name: "Ananya K.",
    exam: "IIT JAM Geology",
  },
];

export function Testimonials() {
  return (
    <section className="py-20 relative overflow-hidden">
      <ParallaxBackground className="absolute inset-0" />

      <div className="container mx-auto px-4 lg:px-6 relative z-10">
        {/* Section Header */}
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground font-serif mb-4">
              Student <span className="text-primary">Testimonials</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Hear from students who transformed their preparation with G-Dnyasa.
            </p>
          </div>
        </ScrollReveal>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <ScrollReveal key={index} delay={index * 0.15}>
              <GlassCard className="relative h-full flex flex-col">
                <Quote className="w-10 h-10 text-primary/30 mb-4" />
                <p className="text-foreground/90 italic mb-6 leading-relaxed flex-1">
                  "{testimonial.quote}"
                </p>
                <div className="border-t border-border/50 pt-4">
                  <div className="font-semibold text-foreground">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {testimonial.exam}
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
