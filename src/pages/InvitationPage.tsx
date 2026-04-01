import { useRef } from "react";
import HeroVariant from "@/components/HeroVariant";
import ContextSection from "@/components/ContextSection";
import EventInfoSection from "@/components/EventInfoSection";
import LocationSection from "@/components/LocationSection";
import RSVPForm from "@/components/RSVPForm";
import InvitationFooter from "@/components/InvitationFooter";
import heroTeam01 from "@/assets/hero-team-01.png";
import heroTeam02 from "@/assets/hero-team-02.png";
import heroArchitectural from "@/assets/hero-architectural.jpg";

type HeroVersion = "a" | "b" | "c";

const heroConfig: Record<HeroVersion, { image: string; bgPosition: string; overlayClass: string }> = {
  a: {
    image: heroTeam01,
    bgPosition: "center 25%",
    overlayClass: "from-navy-deep/95 via-navy-deep/75 to-navy-deep/60",
  },
  b: {
    image: heroTeam02,
    bgPosition: "center 20%",
    overlayClass: "from-navy-deep/95 via-navy-deep/75 to-navy-deep/60",
  },
  c: {
    image: heroArchitectural,
    bgPosition: "center center",
    overlayClass: "from-navy-deep/80 via-navy-deep/50 to-navy-deep/40",
  },
};

const InvitationPage = ({ version = "c" }: { version?: HeroVersion }) => {
  const formRef = useRef<HTMLDivElement>(null);
  const config = heroConfig[version];

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-background">
      <HeroVariant
        onCtaClick={scrollToForm}
        backgroundImage={config.image}
        bgPosition={config.bgPosition}
        overlayClass={config.overlayClass}
      />
      <ContextSection />
      <EventInfoSection />
      <LocationSection />
      <RSVPForm ref={formRef} />
      <InvitationFooter />
    </main>
  );
};

export default InvitationPage;
