import { forwardRef, useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { EVENT_DETAILS } from "@/lib/invitation";
import { buildRSVPSubmission, submitRSVP } from "@/lib/rsvp";

interface RSVPData {
  name: string;
  whatsapp: string;
  email: string;
  attendance: "confirmed" | "declined" | "";
}

type FormState = "idle" | "loading" | "error";
type RSVPFormVariant = "classic" | "editorial";

interface RSVPFormProps {
  variant?: RSVPFormVariant;
}

function formatWhatsApp(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);

  if (digits.length <= 2) return digits;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateWhatsApp(wpp: string): boolean {
  return wpp.replace(/\D/g, "").length >= 10;
}

function getSectionStyles(variant: RSVPFormVariant) {
  if (variant === "editorial") {
    return {
      section: "relative overflow-hidden bg-[linear-gradient(180deg,rgba(7,28,40,0.98)_0%,rgba(8,33,47,0.94)_100%)] px-6 py-20 md:px-12 md:py-28",
      container: "mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start",
      intro: "space-y-6 lg:sticky lg:top-10",
      card: "relative overflow-hidden border border-gold/22 bg-[linear-gradient(180deg,rgba(255,248,240,0.11),rgba(255,248,240,0.07))] px-6 py-7 shadow-[0_28px_80px_rgba(0,0,0,0.16)] backdrop-blur-md md:px-8 md:py-9",
      kicker: "text-label-premium text-gold/78",
      title: "headline-editorial text-3xl text-cream md:text-5xl",
      body: "text-body-refined text-sm leading-7 text-cream/82 md:text-base",
      formShell: "border border-gold/28 bg-[linear-gradient(180deg,rgba(255,248,240,0.11),rgba(255,248,240,0.06))] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.18)] backdrop-blur-md md:p-8",
      label: "mb-2 block text-[0.68rem] uppercase tracking-[0.24em] text-gold/82",
      input: "w-full border border-transparent border-b border-b-cream/30 bg-transparent px-0 py-4 text-base text-cream outline-none transition-[border-color,color] duration-300 placeholder:text-cream/58 focus:border-b-gold/72",
      option:
        "group flex min-h-14 cursor-pointer items-start gap-3 border px-4 py-4 transition-all duration-300",
      optionActive: "border-gold/62 bg-[linear-gradient(180deg,rgba(214,181,118,0.16),rgba(214,181,118,0.08))] shadow-[0_14px_36px_rgba(0,0,0,0.12)]",
      optionIdle: "border-cream/30 bg-[rgba(255,248,240,0.03)] hover:border-gold/42 hover:bg-[rgba(255,248,240,0.06)]",
      optionText: "text-sm text-cream/92",
      helper: "text-xs text-cream/62",
      error: "text-xs text-[#f3a8a8]",
      submit: "button-editorial w-full",
      successSection:
        "relative overflow-hidden bg-[linear-gradient(180deg,rgba(7,28,40,0.98)_0%,rgba(8,33,47,0.94)_100%)] px-6 py-20 md:px-12 md:py-28",
      successCard:
        "mx-auto max-w-2xl border border-gold/18 bg-cream/[0.045] px-6 py-10 text-center backdrop-blur-sm md:px-10 md:py-12",
      successText: "text-body-refined mx-auto max-w-xl text-sm leading-7 text-cream/60 md:text-base",
      linkButton: "button-editorial-secondary",
    };
  }

  return {
    section: "bg-sand-warm/50 px-6 py-24 md:px-12 md:py-32 lg:px-20",
    container: "mx-auto max-w-md",
    intro: "mb-14 space-y-4 text-center",
    card: "",
    kicker: "text-label-premium text-navy-light/50",
    title: "headline-editorial text-2xl text-foreground md:text-3xl",
    body: "text-body-refined pt-2 text-sm text-muted-foreground",
    formShell: "",
    label: "mb-2 block text-[0.68rem] uppercase tracking-[0.24em] text-navy-light/55",
    input: "input-premium",
    option:
      "flex min-h-14 cursor-pointer items-center gap-3 border p-4 transition-all duration-300",
    optionActive: "border-navy/30 bg-navy/5",
    optionIdle: "border-border hover:border-navy/15",
    optionText: "text-sm font-body text-foreground",
    helper: "text-xs text-muted-foreground",
    error: "text-xs text-destructive",
    submit: "btn-primary-solid w-full disabled:opacity-50",
    successSection: "bg-navy-deep px-6 py-24 md:px-12 md:py-32 lg:px-20",
    successCard: "mx-auto max-w-md text-center",
    successText: "text-body-refined text-sm text-cream/50",
    linkButton:
      "inline-flex items-center justify-center gap-2 border border-gold/20 px-6 py-3 text-xs font-medium uppercase tracking-widest text-gold/80 transition-all duration-300 hover:border-gold/40 hover:bg-gold/5",
  };
}

const RSVPForm = forwardRef<HTMLDivElement, RSVPFormProps>(({ variant = "classic" }, ref) => {
  const [form, setForm] = useState<RSVPData>({ name: "", whatsapp: "", email: "", attendance: "" });
  const [state, setState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [errors, setErrors] = useState<Partial<Record<keyof RSVPData, string>>>({});
  const navigate = useNavigate();
  const styles = getSectionStyles(variant);
  const prefersReducedMotion = useReducedMotion();
  const nameId = useId();
  const whatsappId = useId();
  const emailId = useId();
  const attendanceId = useId();

  const validate = () => {
    const nextErrors: typeof errors = {};

    if (!form.name.trim()) nextErrors.name = "Informe seu nome completo.";
    if (!validateWhatsApp(form.whatsapp)) nextErrors.whatsapp = "Informe um WhatsApp válido.";
    if (!validateEmail(form.email)) nextErrors.email = "Informe um e-mail válido.";
    if (!form.attendance) nextErrors.attendance = "Selecione uma opção de resposta.";

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");

    if (!validate()) return;

    setState("loading");

    try {
      await submitRSVP(
        buildRSVPSubmission({
          name: form.name,
          whatsapp: form.whatsapp,
          email: form.email,
          attendance: form.attendance as "confirmed" | "declined",
        }),
      );

      navigate(form.attendance === "confirmed" ? "/im-in" : "/im-out");
    } catch (error) {
      setState("error");
      setErrorMessage(
        error instanceof Error && error.message
          ? error.message
          : "Não foi possível enviar sua confirmação agora. Tente novamente em instantes.",
      );
    }
  };

  return (
    <section ref={ref} className={styles.section}>
      <div className={styles.container}>
        {variant === "editorial" ? (
          <div className={styles.intro}>
            <p className={styles.kicker}>RSVP</p>
            <h2 className={styles.title}>Reserve seu lugar nesta noite de inauguração.</h2>
            <p className={styles.body}>
              Confirme sua presença para recebermos você com a atenção adequada. A recepção
              começa às {EVENT_DETAILS.startTimeLabel} e o evento encerra às {EVENT_DETAILS.endTimeLabel}.
            </p>

	            <div className={styles.card}>
	              <p className="text-label-premium text-gold/78">Informações essenciais</p>
	              <div className="mt-5 space-y-4">
	                <div>
	                  <p className="text-[0.68rem] uppercase tracking-[0.22em] text-gold/70">Data</p>
	                  <p className="mt-1 font-headline text-xl font-light text-cream">{EVENT_DETAILS.dateLabel}</p>
	                </div>
	                <div>
	                  <p className="text-[0.68rem] uppercase tracking-[0.22em] text-gold/70">Local</p>
	                  <p className="mt-1 text-sm leading-6 text-cream/88">
	                    {EVENT_DETAILS.addressLine1}
	                    <br />
	                    {EVENT_DETAILS.addressLine2}
	                    <br />
	                    <span className="text-gold/88">{EVENT_DETAILS.referenceLabel}</span>
	                  </p>
	                </div>
	              </div>
            </div>
          </div>
        ) : null}

        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className={styles.formShell}
        >
          {variant === "classic" ? (
            <div className={styles.intro}>
              <h2 className={styles.title}>Confirme sua presença</h2>
              <div className="divider-fine" />
              <p className={styles.body}>Será um prazer receber você para este encontro.</p>
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-8" noValidate>
            <div>
              <label htmlFor={nameId} className={styles.label}>
                Nome completo
              </label>
              <input
                id={nameId}
                type="text"
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                className={styles.input}
                autoComplete="name"
                placeholder="Como você gostaria de ser identificado"
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? `${nameId}-error` : undefined}
              />
              {errors.name ? (
                <p id={`${nameId}-error`} className={`mt-2 ${styles.error}`}>
                  {errors.name}
                </p>
              ) : null}
            </div>

            <div>
              <label htmlFor={whatsappId} className={styles.label}>
                WhatsApp
              </label>
              <input
                id={whatsappId}
                type="tel"
                value={form.whatsapp}
                onChange={(event) => setForm({ ...form, whatsapp: formatWhatsApp(event.target.value) })}
                className={styles.input}
                autoComplete="tel"
                placeholder="(48) 99999-9999"
                aria-invalid={Boolean(errors.whatsapp)}
                aria-describedby={errors.whatsapp ? `${whatsappId}-error` : undefined}
              />
              {errors.whatsapp ? (
                <p id={`${whatsappId}-error`} className={`mt-2 ${styles.error}`}>
                  {errors.whatsapp}
                </p>
              ) : null}
            </div>

            <div>
              <label htmlFor={emailId} className={styles.label}>
                E-mail
              </label>
              <input
                id={emailId}
                type="email"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                className={styles.input}
                autoComplete="email"
                placeholder="nome@empresa.com"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? `${emailId}-error` : undefined}
              />
              {errors.email ? (
                <p id={`${emailId}-error`} className={`mt-2 ${styles.error}`}>
                  {errors.email}
                </p>
              ) : null}
            </div>

            <fieldset className="space-y-3 pt-2">
              <legend id={attendanceId} className={styles.label}>
                Você poderá comparecer?
              </legend>

              {[
                { value: "confirmed" as const, label: "Confirmo minha presença" },
                { value: "declined" as const, label: "Não poderei comparecer" },
              ].map(({ value, label }) => {
                const active = form.attendance === value;

                return (
                  <label
                    key={value}
                    className={`${styles.option} ${active ? styles.optionActive : styles.optionIdle}`}
                  >
                    <input
                      type="radio"
                      name="attendance"
                      value={value}
                      checked={active}
                      onChange={() => setForm({ ...form, attendance: value })}
                      className="sr-only"
                      aria-labelledby={`${attendanceId}-${value}`}
                    />
                    <span
                      className={`mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                        active ? "border-gold" : variant === "editorial" ? "border-cream/32" : "border-muted-foreground/30"
                      }`}
                    >
                      {active ? (
                        <span className={`h-2 w-2 rounded-full ${variant === "editorial" ? "bg-gold" : "bg-navy"}`} />
                      ) : null}
                    </span>
                    <span id={`${attendanceId}-${value}`} className={styles.optionText}>
                      {label}
                    </span>
                  </label>
                );
              })}

              <p className={styles.helper}>Usaremos seus dados apenas para a organização desta recepção.</p>

              {errors.attendance ? (
                <p className={styles.error}>{errors.attendance}</p>
              ) : null}
            </fieldset>

            <AnimatePresence>
              {state === "error" && errorMessage ? (
                <motion.p
                  initial={prefersReducedMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`${styles.error} text-center`}
                  aria-live="polite"
                >
                  {errorMessage}
                </motion.p>
              ) : null}
            </AnimatePresence>

            <div className="pt-2">
              <button type="submit" disabled={state === "loading"} className={styles.submit}>
                {state === "loading" ? "Enviando confirmação..." : "Confirmar presença"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
});

RSVPForm.displayName = "RSVPForm";

export default RSVPForm;
