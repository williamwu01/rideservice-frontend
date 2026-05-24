import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import DriverSection from "@/components/DriverSection";
import HowItWorks from "@/components/HowItWorks";
import Cities from "@/components/Cities";
import Safety from "@/components/Safety";
import Blog from "@/components/Blog";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <DriverSection />
        <HowItWorks />
        <Cities />
        <Safety />
        <Blog />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
