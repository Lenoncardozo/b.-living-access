import { motion } from "framer-motion";
import BrandLockup from "./BrandLockup";

interface HeroVariantProps {
  onCtaClick: () => void;
  backgroundImage: string;
  /** How to position the bg image */
  bgPosition?: string;
  /** Extra overlay intensity */
  overlayClass?: string;
}

const HeroVariant = ({
  onCtaClick,
  backgroundImage,
  bgPosition = "center top",
  overlayClass = "from-navy-deep/95 via-navy-deep/70 to-navy-deep/50",
}: HeroVariantProps) => {
  return (
    <section className="relative min-h-[100svh] flex flex-col overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={backgroundImage}
          alt=""
          className="w-full h-full object-cover"
          style={{ objectPosition: bgPosition }}
          width={1920}
          height={1080}
        />
        <div className={`absolute inset-0 bg-gradient-to-t ${overlayClass}`} />
        {/* Additional overlay for text readability */}
        <div className="absolute inset-0 bg-navy-deep/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col flex-1 justify-between px-6 md:px-12 lg:px-20">
        {/* Top: Brand */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.3 }}
          className="pt-12 md:pt-16 flex justify-center"
        >
          <BrandLockup />
        </motion.div>

        {/* Center: Invitation */}
        <div className="flex-1 flex flex-col items-center justify-center text-center max-w-2xl mx-auto py-12">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-label-premium text-gold/80 mb-8"
          >
            Convite Exclusivo
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="mb-8"
          >
            <div className="divider-gold mb-8" />
            <h1 className="headline-invitation text-cream text-xl md:text-2xl lg:text-3xl">
              Inauguração
            </h1>
            <div className="divider-gold mt-8" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="text-cream/60 text-body-refined text-sm md:text-base max-w-md mb-10 leading-relaxed"
          >
            Alguns momentos marcam uma cidade.
            <br />
            Este é um deles.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.4 }}
            className="flex items-center gap-6 text-cream/45 text-label-premium mb-12"
          >
            <span>09 de Abril</span>
            <span className="w-px h-4 bg-gold/30" />
            <span>18h</span>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.7 }}
            onClick={onCtaClick}
            className="btn-primary-premium"
          >
            Confirmar presença
          </motion.button>
        </div>

        {/* Bottom spacer */}
        <div className="pb-8" />
      </div>
    </section>
  );
};

export default HeroVariant;
