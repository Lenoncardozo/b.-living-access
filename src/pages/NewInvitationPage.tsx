import { useMemo, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowDownRight,
  CalendarDays,
  CarFront,
  ChevronDown,
  Clock3,
  ExternalLink,
  MapPin,
} from "lucide-react";
import BrandLockup from "@/components/BrandLockup";
import InvitationFooter from "@/components/InvitationFooter";
import RSVPForm from "@/components/RSVPForm";
import heroArchitectural from "@/assets/hero-architectural.jpg";
import { EVENT_DETAILS, GOOGLE_MAPS_URL, generateGoogleCalendarUrl } from "@/lib/invitation";

function sectionTransition(reducedMotion: boolean, delay = 0) {
  return reducedMotion
    ? { duration: 0 }
    : {
        duration: 0.72,
        delay,
        ease: [0.22, 1, 0.36, 1] as const,
      };
}

const NewInvitationPage = () => {
  const formRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const detailItems = useMemo(
    () => [
      {
        label: "Data",
        value: EVENT_DETAILS.dateLabel,
        icon: CalendarDays,
      },
      {
        label: "Recepção",
        value: `${EVENT_DETAILS.startTimeLabel} às ${EVENT_DETAILS.endTimeLabel}`,
        icon: Clock3,
      },
      {
        label: "Referência",
        value: EVENT_DETAILS.referenceLabel,
        icon: MapPin,
      },
      {
        label: "Estacionamento",
        value: "Pátio Milano",
        icon: CarFront,
      },
    ],
    [],
  );

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scrollToLocation = () => {
    locationRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main className="min-h-screen bg-[#f3ece3] text-foreground">
      <section className="relative isolate min-h-[100svh] overflow-hidden bg-navy-deep text-cream">
        <div className="absolute inset-0">
          <img
            src={heroArchitectural}
            alt=""
            className="h-full w-full object-cover object-center"
            width={1920}
            height={1080}
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,20,31,0.92)_0%,rgba(3,20,31,0.72)_46%,rgba(3,20,31,0.54)_100%)]" />
          <div className="hero-grain absolute inset-0" />
          <div className="absolute inset-0 hero-grid-lines opacity-60" />
          <div className="beam-sweep absolute inset-y-0 left-[46%] hidden w-[18vw] bg-[linear-gradient(90deg,transparent,rgba(214,181,118,0.16),transparent)] blur-2xl md:block" />
        </div>

        <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col px-6 pb-8 pt-8 md:px-10 lg:px-14 lg:pt-10">
          <div className="flex items-center justify-between gap-6">
            <BrandLockup />
            <div className="hidden items-center gap-3 md:flex">
              <a href={generateGoogleCalendarUrl()} target="_blank" rel="noreferrer" className="button-editorial-secondary">
                Salvar data
              </a>
              <button type="button" onClick={scrollToForm} className="button-editorial">
                Confirmar presença
              </button>
            </div>
          </div>

          <div className="grid flex-1 items-end gap-12 pb-10 pt-14 lg:grid-cols-[minmax(0,1.2fr)_360px] lg:gap-16 lg:pt-20">
            <div className="max-w-3xl">
              <motion.p
                initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={sectionTransition(prefersReducedMotion, 0.08)}
                className="editorial-kicker text-gold/78"
              >
                Convite para inauguração
              </motion.p>

              <motion.h1
                initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={sectionTransition(prefersReducedMotion, 0.16)}
                className="editorial-title mt-5 max-w-4xl"
              >
                Uma noite para abrir as portas da nova B. Living em Florianópolis.
              </motion.h1>

              <motion.p
                initial={prefersReducedMotion ? false : { opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={sectionTransition(prefersReducedMotion, 0.24)}
                className="editorial-copy mt-8 max-w-2xl text-cream/74"
              >
                Convidamos você para celebrar a inauguração da nossa nova casa com uma recepção
                desenhada para encontros, conversas e uma nova leitura de cidade.
              </motion.p>

              <motion.div
                initial={prefersReducedMotion ? false : { opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={sectionTransition(prefersReducedMotion, 0.32)}
                className="mt-10 flex flex-wrap items-center gap-4"
              >
                <button type="button" onClick={scrollToForm} className="button-editorial">
                  Confirmar presença
                </button>
                <button
                  type="button"
                  onClick={scrollToLocation}
                  className="button-editorial-secondary"
                >
                  Ver localização
                </button>
              </motion.div>
            </div>

            <motion.aside
              initial={prefersReducedMotion ? false : { opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={sectionTransition(prefersReducedMotion, 0.26)}
              className="editorial-panel relative overflow-hidden px-5 py-6 md:px-6 md:py-7"
            >
              <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(214,181,118,0.6),transparent)]" />
              <p className="editorial-kicker text-gold/60">Essencial</p>
              <div className="mt-6 space-y-5">
                <div>
                  <p className="text-[0.68rem] uppercase tracking-[0.24em] text-cream/40">Data</p>
                  <p className="mt-1 font-headline text-[1.7rem] leading-none text-cream">
                    {EVENT_DETAILS.shortDateLabel}
                  </p>
                  <p className="mt-2 text-sm text-cream/62">{EVENT_DETAILS.weekdayLabel}</p>
                </div>

                <div className="editorial-rule" />

                <div>
                  <p className="text-[0.68rem] uppercase tracking-[0.24em] text-cream/40">Horário</p>
                  <p className="mt-1 text-base text-cream/82">
                    {EVENT_DETAILS.startTimeLabel} às {EVENT_DETAILS.endTimeLabel}
                  </p>
                </div>

                <div className="editorial-rule" />

                <div>
                  <p className="text-[0.68rem] uppercase tracking-[0.24em] text-cream/40">Local</p>
                  <p className="mt-1 text-base leading-7 text-cream/82">
                    {EVENT_DETAILS.addressLine1}
                    <br />
                    {EVENT_DETAILS.addressLine2}
                  </p>
                  <p className="mt-2 text-sm text-gold/76">{EVENT_DETAILS.referenceLabel}</p>
                </div>
              </div>
            </motion.aside>
          </div>

          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={sectionTransition(prefersReducedMotion, 0.45)}
            className="flex items-center justify-center pb-1"
          >
            <button
              type="button"
              onClick={scrollToLocation}
              className="group inline-flex items-center gap-2 text-[0.68rem] uppercase tracking-[0.24em] text-cream/44 transition-colors hover:text-cream/72"
            >
              Explorar convite
              <ChevronDown className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-y-0.5" />
            </button>
          </motion.div>
        </div>
      </section>

      <section className="border-y border-[#d7c8b2] bg-[#f3ece3] px-6 py-16 md:px-10 lg:px-14 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={sectionTransition(prefersReducedMotion)}
            className="space-y-6"
          >
            <p className="editorial-kicker text-slate-luxe/62">A ocasião</p>
            <h2 className="editorial-subtitle max-w-xl text-slate-luxe">
              Um convite com atmosfera de marca, informação precisa e resposta fácil.
            </h2>
          </motion.div>

          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={sectionTransition(prefersReducedMotion, 0.08)}
            className="grid gap-4 md:grid-cols-2"
          >
            {detailItems.map(({ icon: Icon, label, value }, index) => (
              <div
                key={label}
                className={`border border-[#d8c9b5] bg-[#f7f1e9] p-5 ${index % 2 === 0 ? "md:-translate-y-5" : ""}`}
              >
                <Icon className="h-4 w-4 text-gold-muted" strokeWidth={1.5} />
                <p className="mt-5 text-[0.68rem] uppercase tracking-[0.22em] text-slate-luxe/54">{label}</p>
                <p className="mt-2 font-headline text-[1.5rem] leading-tight text-slate-luxe">{value}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <section
        ref={locationRef}
        className="bg-[linear-gradient(180deg,#082433_0%,#0c2d40_100%)] px-6 py-16 text-cream md:px-10 lg:px-14 lg:py-20"
      >
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:gap-16">
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={sectionTransition(prefersReducedMotion)}
            className="space-y-6"
          >
            <p className="editorial-kicker text-gold/64">Como chegar</p>
            <h2 className="editorial-subtitle max-w-lg text-cream">
              A nova casa da B. Living está anexa ao Pátio Milano.
            </h2>
            <p className="editorial-copy max-w-xl text-cream/66">
              A localização foi pensada para uma chegada simples. Se preferir, você pode salvar o
              evento no calendário e abrir a rota em seguida.
            </p>
          </motion.div>

          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={sectionTransition(prefersReducedMotion, 0.08)}
            className="grid gap-4 md:grid-cols-[1.15fr_0.85fr]"
          >
            <div className="editorial-panel p-6 md:p-7">
              <p className="text-[0.68rem] uppercase tracking-[0.22em] text-gold/54">Endereço</p>
              <p className="mt-4 font-headline text-[1.85rem] leading-tight text-cream">
                {EVENT_DETAILS.addressLine1}
              </p>
              <p className="mt-3 text-sm leading-7 text-cream/64">{EVENT_DETAILS.addressLine2}</p>
              <p className="mt-5 inline-flex border border-gold/18 px-3 py-2 text-xs uppercase tracking-[0.18em] text-gold/76">
                {EVENT_DETAILS.referenceLabel}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href={GOOGLE_MAPS_URL} target="_blank" rel="noreferrer" className="button-editorial">
                  Abrir no Maps
                  <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.5} />
                </a>
                <a href={generateGoogleCalendarUrl()} target="_blank" rel="noreferrer" className="button-editorial-secondary">
                  Salvar data
                </a>
              </div>
            </div>

            <div className="space-y-4">
              <div className="border border-gold/14 bg-cream/[0.05] p-5">
                <p className="text-[0.68rem] uppercase tracking-[0.22em] text-gold/54">Chegada</p>
                <p className="mt-3 text-sm leading-7 text-cream/68">
                  Recomendamos chegar entre 18h e 18h30 para a recepção de abertura.
                </p>
              </div>
              <div className="border border-gold/14 bg-cream/[0.05] p-5">
                <p className="text-[0.68rem] uppercase tracking-[0.22em] text-gold/54">Apoio</p>
                <p className="mt-3 text-sm leading-7 text-cream/68">
                  O estacionamento recomendado é o do Pátio Milano.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <RSVPForm ref={formRef} variant="editorial" />

      <section className="bg-[#f3ece3] px-6 py-10 md:px-10 lg:px-14">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 border-t border-[#d9c9b2] pt-8 text-slate-luxe/74 md:flex-row md:items-center md:justify-between">
          <p className="text-sm leading-7">
            Se preferir, você também pode abrir o calendário ou a localização antes de confirmar.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href={generateGoogleCalendarUrl()} target="_blank" rel="noreferrer" className="button-editorial-secondary !text-slate-luxe !border-[#cfb792] !bg-transparent">
              Salvar no Google Calendar
            </a>
            <a href={GOOGLE_MAPS_URL} target="_blank" rel="noreferrer" className="button-editorial-secondary !text-slate-luxe !border-[#cfb792] !bg-transparent">
              Abrir localização
              <ArrowDownRight className="h-3.5 w-3.5" strokeWidth={1.5} />
            </a>
          </div>
        </div>
      </section>

      <InvitationFooter />
    </main>
  );
};

export default NewInvitationPage;
