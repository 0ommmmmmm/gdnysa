import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { WhyGDnyasa } from "@/components/home/WhyGDnyasa";
import { ProgramsPreview } from "@/components/home/ProgramsPreview";
import { Testimonials } from "@/components/home/Testimonials";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <WhyGDnyasa />
      <ProgramsPreview />
      <Testimonials />
    </Layout>
  );
};

export default Index;
