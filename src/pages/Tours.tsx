import { Layout } from "@/components/layout/Layout";
import { ComingSoon, usePageMeta } from "@/components/common/ComingSoon";
import { Mountain, MapPin, Tent } from "lucide-react";

function ToursVisual() {
  return (
    <div className="relative w-full max-w-sm h-44 md:h-52">
      <div className="absolute inset-0 rounded-[20px] geo-layers opacity-70" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-6">
        <div className="glass-card p-4 animate-float" style={{ animationDelay: "0.6s" }}>
          <Tent className="w-8 h-8 text-primary" />
        </div>
        <div className="glass-card p-5 animate-float">
          <Mountain className="w-10 h-10 text-accent" />
        </div>
        <div className="glass-card p-4 animate-float" style={{ animationDelay: "0.3s" }}>
          <MapPin className="w-8 h-8 text-primary" />
        </div>
      </div>
    </div>
  );
}

/* TODO(future): replace ComingSoon with tour listings, details, availability, booking, payments. */
const Tours = () => {
  usePageMeta(
    "G-Dnyasa Tours — Coming Soon",
    "Explore upcoming G-Dnyasa geological field tours and educational experiences.",
  );

  return (
    <Layout>
      <ComingSoon
        title="G-Dnyasa Tours"
        subtitle="Discover geology beyond the classroom."
        description="We're preparing exciting geological field tours and educational experiences. Stay tuned for upcoming destinations and experiences."
        visual={<ToursVisual />}
      />
    </Layout>
  );
};

export default Tours;
