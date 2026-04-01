import { motion, useReducedMotion } from "framer-motion";
import { Calendar, Check, Heart, MapPin } from "lucide-react";
import { GOOGLE_MAPS_URL, generateGoogleCalendarUrl } from "@/lib/invitation";

type RSVPResponseVariant = "confirmed" | "declined";

export default function RSVPResponsePage({ attendance }: { attendance: RSVPResponseVariant }) {
  const prefersReducedMotion = useReducedMotion();
  const isConfirmed = attendance === "confirmed";

  return (
    <main className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,rgba(7,28,40,0.98)_0%,rgba(8,33,47,0.94)_100%)] px-6 py-20 md:px-12 md:py-28">
      <div className="hero-grid-lines absolute inset-0 opacity-18" />
      <div className="hero-grain absolute inset-0 opacity-50" />
      <div className="pointer-events-none absolute inset-x-[-12%] top-24 h-44 beam-sweep bg-[linear-gradient(90deg,transparent,hsl(var(--gold)/0.18),transparent)] blur-3xl" />

      <div className="relative mx-auto flex min-h-[calc(100vh-10rem)] max-w-5xl items-center justify-center">
        <motion.section
          initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto w-full max-w-4xl text-center"
        >
          <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-full border border-gold/30 mx-auto">
            {isConfirmed ? (
              <Check className="h-5 w-5 text-gold" strokeWidth={1.5} />
            ) : (
              <Heart className="h-5 w-5 text-gold" strokeWidth={1.5} />
            )}
          </div>

          <h1 className="headline-editorial mb-4 text-4xl text-cream md:text-6xl">
            {isConfirmed ? "Presença confirmada." : "Agradecemos o retorno."}
          </h1>

          <p className="text-body-refined mx-auto max-w-3xl text-base leading-8 text-cream/60 md:text-[2rem] md:leading-[1.5]">
            {isConfirmed
              ? "Recebemos sua confirmação. Esperamos você a partir das 18h para celebrar a nova casa da B. Living Floripa."
              : "Registramos sua resposta. Sentiremos sua falta nesta noite, mas agradecemos a gentileza de nos avisar."}
          </p>

          {isConfirmed ? (
            <div className="mx-auto mt-14 grid max-w-4xl gap-4 md:grid-cols-2">
              <a
                href={generateGoogleCalendarUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center gap-4 border border-gold/18 bg-cream/[0.02] px-6 py-7 text-left transition-all duration-300 hover:border-gold/34 hover:bg-cream/[0.05]"
              >
                <Calendar className="h-5 w-5 flex-shrink-0 text-gold" strokeWidth={1.5} />
                <span className="text-label-premium text-lg tracking-[0.22em] text-gold/92 md:text-xl">
                  Adicionar ao calendário
                </span>
              </a>
              <a
                href={GOOGLE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center gap-4 border border-gold/18 bg-cream/[0.02] px-6 py-7 text-left transition-all duration-300 hover:border-gold/34 hover:bg-cream/[0.05]"
              >
                <MapPin className="h-5 w-5 flex-shrink-0 text-gold" strokeWidth={1.5} />
                <span className="text-label-premium text-lg tracking-[0.22em] text-gold/92 md:text-xl">
                  Abrir localização
                </span>
              </a>
            </div>
          ) : null}
        </motion.section>
      </div>
    </main>
  );
}
