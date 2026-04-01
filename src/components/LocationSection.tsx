import { motion } from "framer-motion";
import { MapPin, Car, ExternalLink } from "lucide-react";
import { EVENT_DETAILS, GOOGLE_MAPS_URL } from "@/lib/invitation";

const LocationSection = () => {
  return (
    <section className="py-20 md:py-28 px-6 md:px-12 lg:px-20 bg-navy-deep">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8 }}
          className="space-y-10"
        >
          <div className="text-center space-y-4">
            <p className="text-label-premium text-gold/50">Localização</p>
            <h2 className="headline-editorial text-2xl md:text-3xl text-cream">
              Como chegar
            </h2>
            <div className="divider-gold mt-4" />
          </div>

          <div className="space-y-6">
            {/* Address */}
            <div className="flex gap-4 items-start">
              <MapPin className="w-4 h-4 text-gold/60 mt-1 flex-shrink-0" strokeWidth={1.5} />
              <div>
                <p className="text-sm text-cream/90 font-medium font-body">
                  {EVENT_DETAILS.addressLine1}
                </p>
                <p className="text-sm text-cream/50 font-body">
                  {EVENT_DETAILS.addressLine2}
                </p>
                <p className="text-xs text-cream/30 font-body mt-1">
                  {EVENT_DETAILS.referenceLabel}
                </p>
              </div>
            </div>

            {/* Parking */}
            <div className="flex gap-4 items-start">
              <Car className="w-4 h-4 text-gold/60 mt-1 flex-shrink-0" strokeWidth={1.5} />
              <div>
                <p className="text-sm text-cream/90 font-medium font-body">Estacionamento</p>
                <p className="text-sm text-cream/50 font-body">
                  Recomendamos o estacionamento do Pátio Milano.
                </p>
              </div>
            </div>
          </div>

          {/* Maps button */}
          <div className="text-center pt-4">
            <a
              href={GOOGLE_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 text-xs font-medium tracking-widest uppercase transition-all duration-300 border font-body text-gold/80 border-gold/20 hover:border-gold/40 hover:bg-gold/5"
              style={{ letterSpacing: "0.15em" }}
            >
              Abrir no Google Maps
              <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.5} />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LocationSection;
