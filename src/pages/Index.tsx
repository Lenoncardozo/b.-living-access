import { useRef } from "react";
import HeroVariant from "@/components/HeroVariant";
import ContextSection from "@/components/ContextSection";
import EventInfoSection from "@/components/EventInfoSection";
import LocationSection from "@/components/LocationSection";
import RSVPForm from "@/components/RSVPForm";
import InvitationFooter from "@/components/InvitationFooter";
import heroArchitectural from "@/assets/hero-architectural.jpg";

const Index = () => {
  const formRef = useRef<HTMLDivElement>(null);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-background">
      <HeroVariant
        onCtaClick={scrollToForm}
        backgroundImage={heroArchitectural}
        bgPosition="center center"
        overlayClass="from-navy-deep/80 via-navy-deep/50 to-navy-deep/40"
      />
      <ContextSection />
      <EventInfoSection />
      <LocationSection />
      <RSVPForm ref={formRef} />
      <InvitationFooter />
    </main>
  );
};

export default Index;
