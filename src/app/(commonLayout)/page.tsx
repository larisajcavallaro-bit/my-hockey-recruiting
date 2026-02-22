import Banner from "@/components/commonLayout/home/banner/Banner";
import FeaturesSection from "@/components/commonLayout/home/feature/Features";
import HeroSection from "@/components/commonLayout/home/hero/HeroSection";
// import FeaturesSection from "@/components/commonLayout/home/features/Features";
import HowItWorks from "@/components/commonLayout/home/HowItWorks/HowItWorks";

export default function Home() {
  return (
    <main>
      <Banner />
      <FeaturesSection />
      <HowItWorks />
      <HeroSection />
    </main>
  );
}
