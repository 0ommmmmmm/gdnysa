import { ReactNode, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { ScrollReveal } from "@/components/animations/ScrollReveal";

interface ComingSoonProps {
  title: string;
  subtitle: string;
  description: string;
  /** Decorative visual rendered inside the glass card */
  visual: ReactNode;
  /** Extra content for the future (products, tours, etc.) */
  children?: ReactNode;
}

/** Sets document title + meta description for a route (client-side). */
export function usePageMeta(title: string, description: string) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title;
    let meta = document.querySelector('meta[name="description"]');
    const previousDesc = meta?.getAttribute("content") ?? "";
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", description);
    return () => {
      document.title = previousTitle;
      meta?.setAttribute("content", previousDesc);
    };
  }, [title, description]);
}

export function ComingSoon({ title, subtitle, description, visual, children }: ComingSoonProps) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 geo-layers opacity-60 pointer-events-none" />
      <div className="container mx-auto px-4 lg:px-6 py-16 md:py-24 relative">
        <div className="max-w-3xl mx-auto text-center">
          <ScrollReveal>
            <span className="badge-diamond inline-block animate-float">Coming Soon</span>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <h1 className="mt-6 text-4xl md:text-5xl lg:text-6xl font-bold font-serif text-foreground">
              {title}
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <p className="mt-4 text-lg md:text-xl text-primary font-medium">{subtitle}</p>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="glass-card mt-10 p-6 md:p-10">
              <div className="flex justify-center">{visual}</div>
              <p className="mt-8 text-muted-foreground text-base md:text-lg leading-relaxed">
                {description}
              </p>
              <Link
                to="/"
                className="glass-button inline-flex items-center gap-2 mt-8 text-foreground"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Link>
            </div>
          </ScrollReveal>

          {children}
        </div>
      </div>
    </section>
  );
}
