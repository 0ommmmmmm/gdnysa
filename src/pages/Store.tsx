import { Layout } from "@/components/layout/Layout";
import { ComingSoon, usePageMeta } from "@/components/common/ComingSoon";
import { BookOpen, Gem, Compass } from "lucide-react";

function StoreVisual() {
  return (
    <div className="relative w-full max-w-sm h-44 md:h-52">
      <div className="absolute inset-0 rounded-[20px] geo-layers opacity-70" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-6">
        <div className="glass-card p-4 animate-float" style={{ animationDelay: "0.4s" }}>
          <BookOpen className="w-8 h-8 text-primary" />
        </div>
        <div className="glass-card p-5 animate-float">
          <Gem className="w-10 h-10 text-accent" />
        </div>
        <div className="glass-card p-4 animate-float" style={{ animationDelay: "0.8s" }}>
          <Compass className="w-8 h-8 text-primary" />
        </div>
      </div>
    </div>
  );
}

/* TODO(future): replace ComingSoon with products, cart, checkout, orders, payments. */
const Store = () => {
  usePageMeta(
    "G-Dnyasa Store — Coming Soon",
    "The G-Dnyasa Store is coming soon. Discover curated geology and learning resources.",
  );

  return (
    <Layout>
      <ComingSoon
        title="G-Dnyasa Store"
        subtitle="Something exciting is on the way."
        description="Explore curated learning resources, study materials, geology essentials, and more. Our store is currently being prepared."
        visual={<StoreVisual />}
      />
    </Layout>
  );
};

export default Store;
