import { motion } from "framer-motion";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = ({ onCtaClick }: { onCtaClick: () => void }) => {
  return (
    <section className="relative min-h-[100svh] flex flex-col justify-end overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt="Interior arquitetônico com luz dourada"
          className="w-full h-full object-cover"
          width={1920}
          height={1280}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/90 via-navy-deep/40 to-navy-deep/20" />
      </div>

      {/* Content */}
      <div className="relative z-10 px-6 pb-16 pt-32 md:px-12 lg:px-20 max-w-3xl">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-cream/60 text-xs tracking-[0.3em] uppercase font-body mb-8"
        >
          B. Living Floripa — Inauguração
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5 }}
          className="headline-editorial text-cream text-4xl md:text-5xl lg:text-6xl mb-6"
        >
          Uma noite para marcar
          <br />
          uma nova fase.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-cream/70 text-body-refined text-base md:text-lg mb-4 max-w-lg"
        >
          A B. Living convida você para a inauguração de sua nova casa em Florianópolis.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="flex items-center gap-6 text-cream/50 text-sm font-body tracking-wide mb-10"
        >
          <span>09 de abril</span>
          <span className="w-px h-4 bg-cream/20" />
          <span>18h</span>
        </motion.div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.3 }}
          onClick={onCtaClick}
          className="btn-primary-premium bg-cream/10 backdrop-blur-sm border border-cream/20 text-cream hover:bg-cream/20"
        >
          Confirmar presença
        </motion.button>
      </div>
    </section>
  );
};

export default HeroSection;
