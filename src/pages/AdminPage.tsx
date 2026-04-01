import { startTransition, useDeferredValue, useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion, useReducedMotion } from "framer-motion";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Activity,
  CheckCircle2,
  Clock3,
  LogOut,
  Search,
  UserRound,
  Users,
  XCircle,
} from "lucide-react";
import BrandLockup from "@/components/BrandLockup";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { fetchAdminDashboard, fetchAdminSession, loginAdmin, logoutAdmin } from "@/lib/admin";
import { EVENT_DETAILS } from "@/lib/invitation";
import type { AttendanceStatus, InviteeRecord } from "@/lib/rsvp-contracts";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

type FilterStatus = "all" | AttendanceStatus;

const timelineChartConfig = {
  total: {
    label: "Respostas",
    color: "hsl(var(--gold))",
  },
  confirmed: {
    label: "Confirmados",
    color: "hsl(var(--cream))",
  },
  declined: {
    label: "Ausências",
    color: "hsl(var(--slate-luxe-soft))",
  },
};

const sourcesChartConfig = {
  total: {
    label: "Convidados",
    color: "hsl(var(--gold-light))",
  },
};

function formatDateTime(value?: string) {
  if (!value) {
    return "Ainda sem registros";
  }

  return format(parseISO(value), "dd 'de' MMM, HH:mm", { locale: ptBR });
}

function formatFullDateTime(value?: string) {
  if (!value) {
    return "Ainda sem registros";
  }

  return format(parseISO(value), "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: ptBR });
}

function formatWhatsApp(value: string) {
  const digits = value.replace(/\D/g, "");

  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }

  if (digits.length === 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }

  return value;
}

function getInviteeSource(invitee: InviteeRecord) {
  return invitee.origin_channel || invitee.utm_source || invitee.inviter || "Direto";
}

function StatusPill({ status }: { status: AttendanceStatus }) {
  const confirmed = status === "confirmed";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[0.68rem] uppercase tracking-[0.18em]",
        confirmed
          ? "border-gold/40 bg-gold/12 text-cream"
          : "border-cream/18 bg-cream/6 text-cream/72",
      )}
    >
      <span
        className={cn(
          "h-2 w-2 rounded-full",
          confirmed ? "bg-gold" : "bg-cream/40",
        )}
      />
      {confirmed ? "Confirmado" : "Não irá"}
    </span>
  );
}

function MetricCard({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string;
  value: string;
  hint: string;
  icon: typeof Users;
}) {
  return (
    <div className="editorial-panel flex min-h-[180px] flex-col justify-between p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-label-premium text-gold/70">{label}</p>
          <p className="mt-5 font-headline text-5xl font-light text-cream">{value}</p>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/20 bg-cream/[0.03]">
          <Icon className="h-5 w-5 text-gold" strokeWidth={1.5} />
        </div>
      </div>
      <p className="mt-5 text-sm leading-6 text-cream/62">{hint}</p>
    </div>
  );
}

function LoginView() {
  const queryClient = useQueryClient();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const prefersReducedMotion = useReducedMotion();

  const loginMutation = useMutation({
    mutationFn: loginAdmin,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "session"] });
      await queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
    },
  });

  return (
    <main className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,hsl(var(--navy-deep))_0%,hsl(var(--slate-luxe))_100%)] text-cream">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(214,181,118,0.08),transparent_30%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,hsl(var(--gold)/0.24),transparent)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,248,240,0.08),transparent)]" />

      <motion.section
        initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative mx-auto flex min-h-screen max-w-4xl items-center justify-center px-6 py-10 md:px-8"
      >
        <div className="w-full max-w-[32rem] border border-white/14 bg-[linear-gradient(180deg,rgba(255,248,240,0.06),rgba(255,248,240,0.025))] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.16)] backdrop-blur-sm md:p-8">
          <div className="mb-8">
            <p className="text-label-premium text-gold/70">Acesso protegido</p>
            <h1 className="headline-editorial mt-4 text-left text-[35px] leading-[0.98] text-cream">
              Entrar no dashboard
            </h1>
          </div>

          <form
            className="space-y-6"
            onSubmit={(event) => {
              event.preventDefault();
              loginMutation.mutate({ username, password });
            }}
          >
            <div className="space-y-4">
              <div>
                <label htmlFor="admin-username" className="mb-2.5 block text-label-premium text-cream/84">
                  Login
                </label>
                <input
                  id="admin-username"
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  className="w-full rounded-[0.2rem] border border-white/24 bg-[rgba(255,248,240,0.015)] px-5 py-4 text-lg text-cream outline-none transition-colors duration-300 placeholder:text-cream/38 focus:border-gold/48"
                  placeholder="admin"
                />
              </div>

              <div>
                <label htmlFor="admin-password" className="mb-2.5 block text-label-premium text-cream/84">
                  Senha
                </label>
                <input
                  id="admin-password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-[0.2rem] border border-white/24 bg-[rgba(255,248,240,0.015)] px-5 py-4 text-lg text-cream outline-none transition-colors duration-300 placeholder:text-cream/38 focus:border-gold/48"
                  placeholder="Digite a senha"
                />
              </div>
            </div>

            {loginMutation.isError ? (
              <p className="rounded-[0.2rem] border border-[#f3b1b1]/14 bg-[#f3b1b1]/6 px-4 py-3 text-sm text-[#f3b1b1]">
                {loginMutation.error instanceof Error
                  ? loginMutation.error.message
                  : "Não foi possível autenticar agora."}
              </p>
            ) : null}

            <button type="submit" disabled={loginMutation.isPending} className="button-editorial w-full py-4">
              {loginMutation.isPending ? "Entrando..." : "Acessar painel"}
            </button>
          </form>
        </div>
      </motion.section>
    </main>
  );
}

export default function AdminPage() {
  const queryClient = useQueryClient();
  const prefersReducedMotion = useReducedMotion();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");
  const [selectedInviteeId, setSelectedInviteeId] = useState<string | null>(null);
  const deferredSearch = useDeferredValue(search);

  const sessionQuery = useQuery({
    queryKey: ["admin", "session"],
    queryFn: fetchAdminSession,
  });

  const dashboardQuery = useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: fetchAdminDashboard,
    enabled: sessionQuery.data?.authenticated === true,
  });

  const logoutMutation = useMutation({
    mutationFn: logoutAdmin,
    onSuccess: async () => {
      queryClient.setQueryData(["admin", "session"], { authenticated: false });
      queryClient.removeQueries({ queryKey: ["admin", "dashboard"] });
    },
  });

  const invitees = dashboardQuery.data?.invitees || [];

  const filteredInvitees = useMemo(() => {
    const searchValue = deferredSearch.trim().toLowerCase();

    return invitees.filter((invitee) => {
      const matchesStatus = statusFilter === "all" || invitee.attendance_status === statusFilter;

      if (!matchesStatus) {
        return false;
      }

      if (!searchValue) {
        return true;
      }

      return [
        invitee.name,
        invitee.email,
        invitee.whatsapp,
        invitee.inviter,
        invitee.origin_channel,
        invitee.invite_code,
      ]
        .filter(Boolean)
        .some((value) => value?.toLowerCase().includes(searchValue));
    });
  }, [deferredSearch, invitees, statusFilter]);

  useEffect(() => {
    if (!filteredInvitees.length) {
      setSelectedInviteeId(null);
      return;
    }

    if (!selectedInviteeId || !filteredInvitees.some((invitee) => invitee.id === selectedInviteeId)) {
      setSelectedInviteeId(filteredInvitees[0].id);
    }
  }, [filteredInvitees, selectedInviteeId]);

  const selectedInvitee = filteredInvitees.find((invitee) => invitee.id === selectedInviteeId) || null;

  if (sessionQuery.isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,hsl(var(--navy-deep))_0%,hsl(var(--slate-luxe))_100%)] text-cream">
        <div className="text-center">
          <p className="text-label-premium text-gold/70">Carregando</p>
          <p className="mt-4 font-headline text-4xl">Preparando o painel.</p>
        </div>
      </main>
    );
  }

  if (!sessionQuery.data?.authenticated) {
    return <LoginView />;
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,hsl(var(--navy-deep))_0%,hsl(var(--slate-luxe))_100%)] text-cream">
      <div className="hero-grid-lines absolute inset-0 opacity-20" />
      <div className="hero-grain absolute inset-0 opacity-65" />
      <div className="pointer-events-none absolute left-[8%] top-24 h-44 w-44 rounded-full bg-gold/10 blur-3xl" />
      <div className="pointer-events-none absolute right-[10%] top-[18%] h-52 w-52 rounded-full bg-cream/6 blur-3xl" />

      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        className="relative mx-auto max-w-[1440px] px-6 py-8 md:px-10 md:py-10"
      >
        <header className="mb-10 flex flex-col gap-8 border-b border-gold/12 pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-5">
            <BrandLockup className="w-44 md:w-52" />
            <div>
              <p className="text-label-premium text-gold/72">Admin</p>
              <h1 className="headline-editorial mt-3 text-4xl text-cream md:text-6xl">
                Leituras claras sobre cada convidado.
              </h1>
            </div>
            <p className="max-w-2xl text-sm leading-7 text-cream/68 md:text-base">
              Visão coletiva por padrão, detalhe individual em um clique e contexto completo da recepção em um
              único lugar.
            </p>
          </div>

          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <div className="editorial-panel min-w-[260px] p-4">
              <p className="text-label-premium text-gold/72">Evento</p>
              <p className="mt-3 font-headline text-2xl text-cream">{EVENT_DETAILS.dateLabel}</p>
              <p className="mt-1 text-sm text-cream/62">
                {EVENT_DETAILS.startTimeLabel} às {EVENT_DETAILS.endTimeLabel}
              </p>
            </div>

            <button
              type="button"
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
              className="button-editorial-secondary"
            >
              <LogOut className="h-3.5 w-3.5" strokeWidth={1.5} />
              {logoutMutation.isPending ? "Saindo..." : "Encerrar sessão"}
            </button>
          </div>
        </header>

        {dashboardQuery.isLoading ? (
          <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {[...Array.from({ length: 4 })].map((_, index) => (
                  <div key={index} className="editorial-panel h-44 animate-pulse bg-cream/[0.05]" />
                ))}
              </div>
              <div className="editorial-panel h-[360px] animate-pulse bg-cream/[0.05]" />
              <div className="editorial-panel h-[420px] animate-pulse bg-cream/[0.05]" />
            </div>
            <div className="editorial-panel h-[680px] animate-pulse bg-cream/[0.05]" />
          </section>
        ) : dashboardQuery.isError ? (
          <section className="editorial-panel max-w-2xl p-8">
            <p className="text-label-premium text-gold/72">Falha</p>
            <h2 className="headline-editorial mt-4 text-4xl text-cream">Não foi possível carregar o dashboard.</h2>
            <p className="mt-4 text-sm leading-7 text-cream/68">
              {dashboardQuery.error instanceof Error
                ? dashboardQuery.error.message
                : "Tente novamente em alguns instantes."}
            </p>
          </section>
        ) : (
          <section className="grid gap-6 xl:grid-cols-[1.12fr_0.88fr]">
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
                <MetricCard
                  label="Convidados"
                  value={String(dashboardQuery.data?.summary.totalInvitees || 0)}
                  hint="Total único de respostas registradas no banco do evento."
                  icon={Users}
                />
                <MetricCard
                  label="Confirmados"
                  value={String(dashboardQuery.data?.summary.confirmed || 0)}
                  hint="Presenças confirmadas para a recepção de inauguração."
                  icon={CheckCircle2}
                />
                <MetricCard
                  label="Ausências"
                  value={String(dashboardQuery.data?.summary.declined || 0)}
                  hint="Convidados que avisaram que não poderão comparecer."
                  icon={XCircle}
                />
                <MetricCard
                  label="Taxa de presença"
                  value={`${dashboardQuery.data?.summary.attendanceRate || 0}%`}
                  hint={
                    dashboardQuery.data?.summary.topChannel
                      ? `Canal dominante: ${dashboardQuery.data.summary.topChannel}.`
                      : "Canal dominante ainda indisponível."
                  }
                  icon={Activity}
                />
              </div>

              <div className="grid gap-6 2xl:grid-cols-[1.35fr_0.9fr]">
                <section className="editorial-panel p-6 md:p-7">
                  <div className="mb-8 flex items-end justify-between gap-4">
                    <div>
                      <p className="text-label-premium text-gold/72">Ritmo de respostas</p>
                      <h2 className="headline-editorial mt-4 text-3xl text-cream md:text-4xl">
                        Cadência da confirmação
                      </h2>
                    </div>
                    <p className="max-w-[220px] text-right text-xs leading-6 text-cream/56">
                      Última atualização: {formatDateTime(dashboardQuery.data?.summary.latestResponseAt)}
                    </p>
                  </div>

                  <ChartContainer config={timelineChartConfig} className="h-[290px] w-full">
                    <AreaChart data={dashboardQuery.data?.timeline}>
                      <defs>
                        <linearGradient id="timelineTotal" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--color-total)" stopOpacity={0.42} />
                          <stop offset="95%" stopColor="var(--color-total)" stopOpacity={0.02} />
                        </linearGradient>
                        <linearGradient id="timelineConfirmed" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--color-confirmed)" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="var(--color-confirmed)" stopOpacity={0.01} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid vertical={false} stroke="rgba(255,248,240,0.08)" />
                      <XAxis
                        dataKey="date"
                        tickLine={false}
                        axisLine={false}
                        minTickGap={24}
                        tickFormatter={(value) => format(parseISO(value), "dd/MM", { locale: ptBR })}
                        stroke="rgba(255,248,240,0.45)"
                      />
                      <YAxis tickLine={false} axisLine={false} stroke="rgba(255,248,240,0.45)" />
                      <ChartTooltip
                        cursor={{ stroke: "rgba(214,181,118,0.22)" }}
                        content={
                          <ChartTooltipContent
                            labelFormatter={(value) =>
                              typeof value === "string"
                                ? format(parseISO(value), "dd 'de' MMMM", { locale: ptBR })
                                : value
                            }
                          />
                        }
                      />
                      <Area
                        type="monotone"
                        dataKey="total"
                        stroke="var(--color-total)"
                        strokeWidth={2}
                        fill="url(#timelineTotal)"
                      />
                      <Area
                        type="monotone"
                        dataKey="confirmed"
                        stroke="var(--color-confirmed)"
                        strokeWidth={1.6}
                        fill="url(#timelineConfirmed)"
                      />
                    </AreaChart>
                  </ChartContainer>
                </section>

                <section className="editorial-panel p-6 md:p-7">
                  <div className="mb-8">
                    <p className="text-label-premium text-gold/72">Origem</p>
                    <h2 className="headline-editorial mt-4 text-3xl text-cream md:text-4xl">
                      Leitura por canal
                    </h2>
                  </div>

                  <ChartContainer config={sourcesChartConfig} className="h-[290px] w-full">
                    <BarChart data={dashboardQuery.data?.sources} layout="vertical" margin={{ left: 12 }}>
                      <CartesianGrid horizontal={false} stroke="rgba(255,248,240,0.08)" />
                      <XAxis type="number" tickLine={false} axisLine={false} stroke="rgba(255,248,240,0.45)" />
                      <YAxis
                        dataKey="label"
                        type="category"
                        tickLine={false}
                        axisLine={false}
                        width={100}
                        stroke="rgba(255,248,240,0.45)"
                      />
                      <ChartTooltip content={<ChartTooltipContent hideLabel indicator="line" />} />
                      <Bar dataKey="total" fill="var(--color-total)" radius={[0, 999, 999, 0]} barSize={18} />
                    </BarChart>
                  </ChartContainer>
                </section>
              </div>

              <section className="editorial-panel p-6 md:p-7">
                <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                  <div>
                    <p className="text-label-premium text-gold/72">Convidados</p>
                    <h2 className="headline-editorial mt-4 text-3xl text-cream md:text-4xl">
                      Lista viva da recepção
                    </h2>
                  </div>

                  <div className="flex flex-col gap-3 lg:min-w-[420px]">
                    <div className="relative">
                      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-cream/44" />
                      <input
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Buscar por nome, e-mail, convidante ou código"
                        className="w-full border border-cream/18 bg-cream/[0.04] py-3 pl-11 pr-4 text-sm text-cream outline-none transition-colors duration-300 placeholder:text-cream/40 focus:border-gold/46"
                      />
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {[
                        { value: "all" as const, label: "Todos" },
                        { value: "confirmed" as const, label: "Confirmados" },
                        { value: "declined" as const, label: "Ausências" },
                      ].map((filter) => {
                        const active = statusFilter === filter.value;

                        return (
                          <button
                            key={filter.value}
                            type="button"
                            onClick={() => setStatusFilter(filter.value)}
                            className={cn(
                              "border px-4 py-2 text-[0.68rem] uppercase tracking-[0.2em] transition-all duration-300",
                              active
                                ? "border-gold/56 bg-gold/12 text-cream"
                                : "border-cream/18 bg-transparent text-cream/62 hover:border-gold/34 hover:text-cream",
                            )}
                          >
                            {filter.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {filteredInvitees.length ? (
                    filteredInvitees.map((invitee) => {
                      const active = invitee.id === selectedInviteeId;

                      return (
                        <button
                          key={invitee.id}
                          type="button"
                          onClick={() =>
                            startTransition(() => {
                              setSelectedInviteeId(invitee.id);
                            })
                          }
                          className={cn(
                            "grid w-full gap-4 border px-4 py-4 text-left transition-all duration-300 md:grid-cols-[1.1fr_0.75fr_0.55fr_0.7fr]",
                            active
                              ? "border-gold/44 bg-[linear-gradient(180deg,rgba(214,181,118,0.14),rgba(255,248,240,0.03))] shadow-[0_18px_34px_rgba(0,0,0,0.12)]"
                              : "border-cream/12 bg-cream/[0.025] hover:border-gold/24 hover:bg-cream/[0.045]",
                          )}
                        >
                          <div>
                            <p className="font-body text-base text-cream">{invitee.name}</p>
                            <p className="mt-1 text-sm text-cream/56">{invitee.email}</p>
                          </div>
                          <div>
                            <p className="text-label-premium text-gold/66">Canal</p>
                            <p className="mt-2 text-sm text-cream/72">{getInviteeSource(invitee)}</p>
                          </div>
                          <div className="flex items-center">
                            <StatusPill status={invitee.attendance_status} />
                          </div>
                          <div>
                            <p className="text-label-premium text-gold/66">Último retorno</p>
                            <p className="mt-2 text-sm text-cream/72">{formatDateTime(invitee.last_response_at)}</p>
                          </div>
                        </button>
                      );
                    })
                  ) : (
                    <div className="border border-dashed border-cream/18 px-5 py-12 text-center">
                      <p className="font-headline text-3xl text-cream">Nenhum convidado encontrado.</p>
                      <p className="mt-3 text-sm text-cream/58">
                        Ajuste os filtros ou aguarde novas confirmações chegarem pela página.
                      </p>
                    </div>
                  )}
                </div>
              </section>
            </div>

            <aside className="xl:sticky xl:top-8 xl:self-start">
              <section className="editorial-panel p-6 md:p-7">
                <div className="mb-8 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-label-premium text-gold/72">Leitura individual</p>
                    <h2 className="headline-editorial mt-4 text-3xl text-cream md:text-4xl">
                      Ficha do convidado
                    </h2>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/20 bg-cream/[0.03]">
                    <UserRound className="h-5 w-5 text-gold" strokeWidth={1.5} />
                  </div>
                </div>

                {selectedInvitee ? (
                  <div className="space-y-8">
                    <div className="border-b border-gold/12 pb-6">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <h3 className="font-headline text-4xl font-light text-cream">{selectedInvitee.name}</h3>
                          <p className="mt-2 text-sm text-cream/62">{selectedInvitee.email}</p>
                        </div>
                        <StatusPill status={selectedInvitee.attendance_status} />
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="border border-cream/10 bg-cream/[0.03] p-4">
                        <p className="text-label-premium text-gold/70">WhatsApp</p>
                        <p className="mt-3 text-sm leading-6 text-cream">{formatWhatsApp(selectedInvitee.whatsapp)}</p>
                      </div>
                      <div className="border border-cream/10 bg-cream/[0.03] p-4">
                        <p className="text-label-premium text-gold/70">Canal</p>
                        <p className="mt-3 text-sm leading-6 text-cream">{getInviteeSource(selectedInvitee)}</p>
                      </div>
                      <div className="border border-cream/10 bg-cream/[0.03] p-4">
                        <p className="text-label-premium text-gold/70">Primeiro retorno</p>
                        <p className="mt-3 text-sm leading-6 text-cream">
                          {formatFullDateTime(selectedInvitee.first_response_at)}
                        </p>
                      </div>
                      <div className="border border-cream/10 bg-cream/[0.03] p-4">
                        <p className="text-label-premium text-gold/70">Último retorno</p>
                        <p className="mt-3 text-sm leading-6 text-cream">
                          {formatFullDateTime(selectedInvitee.last_response_at)}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4 border border-cream/10 bg-cream/[0.03] p-5">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-label-premium text-gold/70">Intensidade</p>
                          <p className="mt-3 font-headline text-3xl text-cream">{selectedInvitee.response_count}</p>
                        </div>
                        <div className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/18 bg-gold/10">
                          <Clock3 className="h-5 w-5 text-gold" strokeWidth={1.5} />
                        </div>
                      </div>
                      <p className="text-sm leading-7 text-cream/62">
                        Quantas vezes esse convidado interagiu com o RSVP. O painel preserva o estado mais recente
                        e contabiliza o histórico.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <p className="text-label-premium text-gold/72">Contexto de origem</p>
                      <div className="grid gap-3">
                        {[
                          ["UTM Source", selectedInvitee.utm_source],
                          ["UTM Medium", selectedInvitee.utm_medium],
                          ["UTM Campaign", selectedInvitee.utm_campaign],
                          ["Convidante", selectedInvitee.inviter],
                          ["Origin Channel", selectedInvitee.origin_channel],
                          ["Código do convite", selectedInvitee.invite_code],
                        ].map(([label, value]) => (
                          <div key={label} className="flex items-start justify-between gap-4 border-b border-cream/8 py-3">
                            <span className="text-sm text-cream/48">{label}</span>
                            <span className="max-w-[58%] text-right text-sm text-cream/78">{value || "—"}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="border border-dashed border-cream/18 px-5 py-14 text-center">
                    <p className="font-headline text-3xl text-cream">Selecione um convidado.</p>
                    <p className="mt-3 text-sm text-cream/58">
                      O detalhe individual aparece aqui sem perder a visão consolidada ao lado.
                    </p>
                  </div>
                )}
              </section>
            </aside>
          </section>
        )}
      </motion.div>
    </main>
  );
}
