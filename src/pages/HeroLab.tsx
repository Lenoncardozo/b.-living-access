import { Link } from "react-router-dom";
import BrandLockup from "@/components/BrandLockup";

const versions = [
  { id: "a", label: "Version A", desc: "Team photo — centered composition", path: "/hero-a" },
  { id: "b", label: "Version B", desc: "Team photo — with headline overlay", path: "/hero-b" },
  { id: "c", label: "Version C", desc: "Architectural — generated premium background", path: "/hero-c" },
];

const HeroLab = () => (
  <main className="min-h-screen bg-navy-deep flex flex-col items-center justify-center px-6 py-20">
    <BrandLockup className="mb-12" />

    <h1 className="headline-editorial text-cream text-2xl md:text-3xl mb-4 text-center">
      Hero Comparison Lab
    </h1>
    <p className="text-cream/40 text-sm font-body mb-16 text-center max-w-md">
      Compare the 3 hero variants. Each link opens the full invitation page with the corresponding hero background.
    </p>

    <div className="grid gap-4 w-full max-w-lg">
      {versions.map((v) => (
        <Link
          key={v.id}
          to={v.path}
          className="flex items-center justify-between p-6 border border-gold/15 hover:border-gold/35 transition-all duration-300 group"
        >
          <div>
            <p className="text-cream font-headline text-lg font-light">{v.label}</p>
            <p className="text-cream/40 text-xs font-body mt-1">{v.desc}</p>
          </div>
          <span className="text-gold/50 group-hover:text-gold/80 transition-colors text-sm font-body">→</span>
        </Link>
      ))}
    </div>

    <div className="mt-16">
      <Link
        to="/"
        className="text-cream/30 text-xs font-body hover:text-cream/50 transition-colors tracking-widest uppercase"
      >
        ← Voltar ao site principal
      </Link>
    </div>
  </main>
);

export default HeroLab;
