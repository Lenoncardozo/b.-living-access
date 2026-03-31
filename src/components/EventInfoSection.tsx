import { motion } from "framer-motion";
import { Calendar, Clock, MapPin } from "lucide-react";

const EventInfoSection = () => {
  return (
    <section className="py-16 md:py-24 px-6 md:px-12 lg:px-20 bg-sand-warm/50">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <h2 className="headline-editorial text-2xl md:text-3xl text-foreground text-center mb-12">
            Detalhes do evento
          </h2>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="flex flex-col items-center text-center p-6">
              <Calendar className="w-5 h-5 text-navy-light mb-4" strokeWidth={1.5} />
              <span className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-1 font-body">Data</span>
              <span className="font-headline text-lg text-foreground">09 de abril de 2025</span>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <Clock className="w-5 h-5 text-navy-light mb-4" strokeWidth={1.5} />
              <span className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-1 font-body">Horário</span>
              <span className="font-headline text-lg text-foreground">18h</span>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <MapPin className="w-5 h-5 text-navy-light mb-4" strokeWidth={1.5} />
              <span className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-1 font-body">Local</span>
              <span className="font-headline text-lg text-foreground">B. Living Floripa</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default EventInfoSection;
