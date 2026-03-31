import { motion } from "framer-motion";
import { MapPin, Car, ExternalLink } from "lucide-react";

const GOOGLE_MAPS_URL = "https://www.google.com/maps/search/?api=1&query=Avenida+Mauro+Ramos+1494+Centro+Florianópolis+SC";

const LocationSection = () => {
  return (
    <section className="py-16 md:py-24 px-6 md:px-12 lg:px-20">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8 }}
          className="space-y-10"
        >
          <h2 className="headline-editorial text-2xl md:text-3xl text-foreground text-center">
            Como chegar
          </h2>

          <div className="space-y-6">
            {/* Address */}
            <div className="flex gap-4 items-start">
              <MapPin className="w-4 h-4 text-navy-light mt-1 flex-shrink-0" strokeWidth={1.5} />
              <div>
                <p className="text-sm text-foreground font-medium font-body">
                  Avenida Mauro Ramos, 1494
                </p>
                <p className="text-sm text-muted-foreground font-body">
                  Centro, Florianópolis – SC, 88020-302
                </p>
                <p className="text-xs text-muted-foreground/70 font-body mt-1">
                  Próximo à Beira-Mar, Pátio Milano e Majestic.
                </p>
              </div>
            </div>

            {/* Parking */}
            <div className="flex gap-4 items-start">
              <Car className="w-4 h-4 text-navy-light mt-1 flex-shrink-0" strokeWidth={1.5} />
              <div>
                <p className="text-sm text-foreground font-medium font-body">Estacionamento</p>
                <p className="text-sm text-muted-foreground font-body">
                  Recomendamos o estacionamento do Pátio Milano.
                </p>
              </div>
            </div>
          </div>

          {/* Maps button */}
          <div className="text-center pt-2">
            <a
              href={GOOGLE_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary-premium inline-flex gap-2"
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
