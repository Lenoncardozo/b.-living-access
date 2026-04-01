import { motion } from "framer-motion";
import { Calendar, Clock, MapPin } from "lucide-react";
import { EVENT_DETAILS } from "@/lib/invitation";

const EventInfoSection = () => {
  return (
    <section className="py-20 md:py-28 px-6 md:px-12 lg:px-20 bg-sand-warm/50">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8 }}
          className="space-y-10"
        >
          <div className="text-center space-y-4">
            <p className="text-label-premium text-navy-light/60">Detalhes</p>
            <h2 className="headline-editorial text-2xl md:text-3xl text-foreground">
              O Evento
            </h2>
            <div className="divider-fine mt-4" />
          </div>

          <div className="grid gap-0 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border">
            {[
              { icon: Calendar, label: "Data", value: EVENT_DETAILS.dateLabel },
              { icon: Clock, label: "Horário", value: `${EVENT_DETAILS.startTimeLabel} - ${EVENT_DETAILS.endTimeLabel}` },
              { icon: MapPin, label: "Local", value: EVENT_DETAILS.referenceLabel },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex flex-col items-center text-center py-8 md:py-6 px-4">
                <Icon className="w-4 h-4 text-gold-muted mb-4" strokeWidth={1.5} />
                <span className="text-label-premium text-muted-foreground/60 mb-2">{label}</span>
                <span className="font-headline text-lg text-foreground font-light">{value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default EventInfoSection;
