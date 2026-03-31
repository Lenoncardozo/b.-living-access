import { useState, useEffect, forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MapPin, Check, Heart } from "lucide-react";

interface RSVPData {
  name: string;
  whatsapp: string;
  email: string;
  attendance: "confirmed" | "declined" | "";
}

interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  inviter?: string;
  origin_channel?: string;
  invite_code?: string;
}

const GOOGLE_MAPS_URL = "https://www.google.com/maps/search/?api=1&query=Avenida+Mauro+Ramos+1494+Centro+Florianópolis+SC";

function generateGoogleCalendarUrl() {
  const title = encodeURIComponent("Inauguração B. Living Floripa");
  const location = encodeURIComponent("Avenida Mauro Ramos, 1494, Centro, Florianópolis - SC - 88020-302");
  const details = encodeURIComponent("Inauguração da nova casa da B. Living em Florianópolis.");
  // April 9, 2025 at 18:00 BRT (UTC-3) = 21:00 UTC
  const dates = "20250409T210000Z/20250409T230000Z";
  return `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&location=${location}&details=${details}`;
}

function getUTMParams(): UTMParams {
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get("utm_source") || undefined,
    utm_medium: params.get("utm_medium") || undefined,
    utm_campaign: params.get("utm_campaign") || undefined,
    inviter: params.get("inviter") || undefined,
    origin_channel: params.get("origin_channel") || undefined,
    invite_code: params.get("invite_code") || undefined,
  };
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

type FormState = "idle" | "loading" | "success-confirmed" | "success-declined" | "error";

const RSVPForm = forwardRef<HTMLDivElement>((_, ref) => {
  const [form, setForm] = useState<RSVPData>({ name: "", whatsapp: "", email: "", attendance: "" });
  const [state, setState] = useState<FormState>("idle");
  const [errors, setErrors] = useState<Partial<Record<keyof RSVPData, string>>>({});

  const validate = (): boolean => {
    const e: typeof errors = {};
    if (!form.name.trim()) e.name = "Informe seu nome";
    if (!validateWhatsApp(form.whatsapp)) e.whatsapp = "WhatsApp inválido";
    if (!validateEmail(form.email)) e.email = "E-mail inválido";
    if (!form.attendance) e.attendance = "Selecione uma opção";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setState("loading");

    const utm = getUTMParams();

    try {
      // Store in localStorage as fallback until DB is connected
      const rsvp = {
        id: crypto.randomUUID(),
        name: form.name.trim(),
        whatsapp: form.whatsapp.replace(/\D/g, ""),
        email: form.email.trim().toLowerCase(),
        attendance_status: form.attendance,
        created_at: new Date().toISOString(),
        ...utm,
      };

      // Store in localStorage (will be replaced with Supabase when Cloud is enabled)
      const stored = JSON.parse(localStorage.getItem("rsvps") || "[]");
      stored.push(rsvp);
      localStorage.setItem("rsvps", JSON.stringify(stored));

      setState(form.attendance === "confirmed" ? "success-confirmed" : "success-declined");
    } catch (err) {
      console.error("RSVP error:", err);
      setState("error");
    }
  };

  if (state === "success-confirmed") {
    return (
      <section ref={ref} className="py-20 md:py-28 px-6 md:px-12 lg:px-20 bg-sand-warm/50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-md mx-auto text-center"
        >
          <div className="w-12 h-12 rounded-full bg-navy/10 flex items-center justify-center mx-auto mb-6">
            <Check className="w-5 h-5 text-navy" strokeWidth={1.5} />
          </div>
          <h3 className="headline-editorial text-2xl md:text-3xl text-foreground mb-4">
            Presença confirmada.
          </h3>
          <p className="text-body-refined text-muted-foreground text-sm mb-10">
            Agradecemos a confirmação. Será um prazer recebê-lo na inauguração da B. Living Floripa.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={generateGoogleCalendarUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary-premium gap-2"
            >
              <Calendar className="w-3.5 h-3.5" strokeWidth={1.5} />
              Adicionar ao calendário
            </a>
            <a
              href={GOOGLE_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary-premium gap-2"
            >
              <MapPin className="w-3.5 h-3.5" strokeWidth={1.5} />
              Abrir localização
            </a>
          </div>
        </motion.div>
      </section>
    );
  }

  if (state === "success-declined") {
    return (
      <section ref={ref} className="py-20 md:py-28 px-6 md:px-12 lg:px-20 bg-sand-warm/50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-md mx-auto text-center"
        >
          <div className="w-12 h-12 rounded-full bg-navy/10 flex items-center justify-center mx-auto mb-6">
            <Heart className="w-5 h-5 text-navy" strokeWidth={1.5} />
          </div>
          <h3 className="headline-editorial text-2xl md:text-3xl text-foreground mb-4">
            Agradecemos o retorno.
          </h3>
          <p className="text-body-refined text-muted-foreground text-sm">
            Sentiremos sua falta, mas ficamos gratos pela gentileza de nos avisar.
            Esperamos vê-lo em breve.
          </p>
        </motion.div>
      </section>
    );
  }

  return (
    <section ref={ref} className="py-20 md:py-28 px-6 md:px-12 lg:px-20 bg-sand-warm/50">
      <div className="max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="headline-editorial text-2xl md:text-3xl text-foreground text-center mb-3">
            Confirme sua presença
          </h2>
          <p className="text-body-refined text-muted-foreground text-sm text-center mb-12">
            Preencha seus dados abaixo para confirmar.
          </p>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Name */}
            <div>
              <input
                type="text"
                placeholder="Nome completo"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input-premium"
                autoComplete="name"
              />
              {errors.name && <p className="text-xs text-destructive mt-2 font-body">{errors.name}</p>}
            </div>

            {/* WhatsApp */}
            <div>
              <input
                type="tel"
                placeholder="WhatsApp"
                value={form.whatsapp}
                onChange={(e) => setForm({ ...form, whatsapp: formatWhatsApp(e.target.value) })}
                className="input-premium"
                autoComplete="tel"
              />
              {errors.whatsapp && <p className="text-xs text-destructive mt-2 font-body">{errors.whatsapp}</p>}
            </div>

            {/* Email */}
            <div>
              <input
                type="email"
                placeholder="E-mail"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="input-premium"
                autoComplete="email"
              />
              {errors.email && <p className="text-xs text-destructive mt-2 font-body">{errors.email}</p>}
            </div>

            {/* Attendance */}
            <div className="space-y-3 pt-2">
              <label
                className={`flex items-center gap-3 p-4 border cursor-pointer transition-all duration-300 ${
                  form.attendance === "confirmed"
                    ? "border-navy/30 bg-navy/5"
                    : "border-border hover:border-navy/15"
                }`}
              >
                <input
                  type="radio"
                  name="attendance"
                  value="confirmed"
                  checked={form.attendance === "confirmed"}
                  onChange={() => setForm({ ...form, attendance: "confirmed" })}
                  className="sr-only"
                />
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                    form.attendance === "confirmed" ? "border-navy" : "border-muted-foreground/30"
                  }`}
                >
                  {form.attendance === "confirmed" && (
                    <div className="w-2 h-2 rounded-full bg-navy" />
                  )}
                </div>
                <span className="text-sm font-body text-foreground">Confirmo minha presença</span>
              </label>

              <label
                className={`flex items-center gap-3 p-4 border cursor-pointer transition-all duration-300 ${
                  form.attendance === "declined"
                    ? "border-navy/30 bg-navy/5"
                    : "border-border hover:border-navy/15"
                }`}
              >
                <input
                  type="radio"
                  name="attendance"
                  value="declined"
                  checked={form.attendance === "declined"}
                  onChange={() => setForm({ ...form, attendance: "declined" })}
                  className="sr-only"
                />
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                    form.attendance === "declined" ? "border-navy" : "border-muted-foreground/30"
                  }`}
                >
                  {form.attendance === "declined" && (
                    <div className="w-2 h-2 rounded-full bg-navy" />
                  )}
                </div>
                <span className="text-sm font-body text-foreground">Não poderei comparecer</span>
              </label>
              {errors.attendance && <p className="text-xs text-destructive mt-1 font-body">{errors.attendance}</p>}
            </div>

            {/* Error state */}
            <AnimatePresence>
              {state === "error" && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-xs text-destructive text-center font-body"
                >
                  Ocorreu um erro. Por favor, tente novamente.
                </motion.p>
              )}
            </AnimatePresence>

            {/* Submit */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={state === "loading"}
                className="btn-primary-premium w-full disabled:opacity-50"
              >
                {state === "loading" ? "Enviando..." : "Confirmar presença"}
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
