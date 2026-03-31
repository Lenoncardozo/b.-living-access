import { useRef } from "react";
import HeroSection from "@/components/HeroSection";
import ContextSection from "@/components/ContextSection";
import EventInfoSection from "@/components/EventInfoSection";
import LocationSection from "@/components/LocationSection";
import RSVPForm from "@/components/RSVPForm";

const Index = () => {
  const formRef = useRef<HTMLDivElement>(null);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-background">
      <HeroSection onCtaClick={scrollToForm} />
      <ContextSection />
      <EventInfoSection />
      <LocationSection />
      <RSVPForm ref={formRef} />

      {/* Footer */}
      <footer className="py-10 px-6 text-center">
        <p className="text-xs text-muted-foreground/50 font-body tracking-wide">
          © 2025 B. Living Floripa
        </p>
      </footer>
    </main>
  );
};

export default Index;
