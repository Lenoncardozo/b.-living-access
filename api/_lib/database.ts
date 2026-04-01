import { neon } from "@neondatabase/serverless";
import { z } from "zod";
import type {
  AdminDashboard,
  AttendanceStatus,
  DashboardSourcePoint,
  DashboardTimelinePoint,
  InviteeRecord,
  RSVPSubmission,
} from "../../src/lib/rsvp-contracts.js";
import { ATTENDANCE_STATUSES } from "../../src/lib/rsvp-contracts.js";
import { getDatabaseUrl } from "./env.js";

const sql = neon(getDatabaseUrl());

const submissionSchema = z.object({
  id: z.string().uuid(),
  name: z.string().trim().min(2).max(160),
  whatsapp: z.string().trim().min(10).max(20),
  email: z.string().trim().email().max(160),
  attendance_status: z.enum(ATTENDANCE_STATUSES),
  created_at: z.string().datetime(),
  utm_source: z.string().trim().max(120).optional(),
  utm_medium: z.string().trim().max(120).optional(),
  utm_campaign: z.string().trim().max(160).optional(),
  inviter: z.string().trim().max(160).optional(),
  origin_channel: z.string().trim().max(120).optional(),
  invite_code: z.string().trim().max(120).optional(),
});

const inviteeRowSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  whatsapp: z.string(),
  attendance_status: z.enum(ATTENDANCE_STATUSES),
  first_response_at: z.string(),
  last_response_at: z.string(),
  response_count: z.coerce.number(),
  utm_source: z.string().nullable(),
  utm_medium: z.string().nullable(),
  utm_campaign: z.string().nullable(),
  inviter: z.string().nullable(),
  origin_channel: z.string().nullable(),
  invite_code: z.string().nullable(),
});

let schemaPromise: Promise<void> | null = null;

export interface RSVPRequestMeta {
  requestIp?: string;
  userAgent?: string;
}

function normalizeText(value?: string | null) {
  const normalized = value?.trim();
  return normalized ? normalized : null;
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function normalizeWhatsapp(value: string) {
  return value.replace(/\D/g, "");
}

function asInviteeRecord(row: unknown): InviteeRecord {
  const parsed = inviteeRowSchema.parse(row);

  return {
    id: parsed.id,
    name: parsed.name,
    email: parsed.email,
    whatsapp: parsed.whatsapp,
    attendance_status: parsed.attendance_status,
    first_response_at: parsed.first_response_at,
    last_response_at: parsed.last_response_at,
    response_count: parsed.response_count,
    utm_source: parsed.utm_source || undefined,
    utm_medium: parsed.utm_medium || undefined,
    utm_campaign: parsed.utm_campaign || undefined,
    inviter: parsed.inviter || undefined,
    origin_channel: parsed.origin_channel || undefined,
    invite_code: parsed.invite_code || undefined,
  };
}

async function runSchemaSetup() {
  await sql`
    CREATE TABLE IF NOT EXISTS invitees (
      id UUID PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      whatsapp TEXT NOT NULL,
      attendance_status TEXT NOT NULL CHECK (attendance_status IN ('confirmed', 'declined')),
      utm_source TEXT,
      utm_medium TEXT,
      utm_campaign TEXT,
      inviter TEXT,
      origin_channel TEXT,
      invite_code TEXT,
      first_response_at TIMESTAMPTZ NOT NULL,
      last_response_at TIMESTAMPTZ NOT NULL,
      response_count INTEGER NOT NULL DEFAULT 1,
      created_at TIMESTAMPTZ NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS rsvp_events (
      id UUID PRIMARY KEY,
      invitee_id UUID NOT NULL REFERENCES invitees(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      whatsapp TEXT NOT NULL,
      attendance_status TEXT NOT NULL CHECK (attendance_status IN ('confirmed', 'declined')),
      utm_source TEXT,
      utm_medium TEXT,
      utm_campaign TEXT,
      inviter TEXT,
      origin_channel TEXT,
      invite_code TEXT,
      request_ip TEXT,
      user_agent TEXT,
      created_at TIMESTAMPTZ NOT NULL
    )
  `;

  await sql`CREATE INDEX IF NOT EXISTS invitees_status_idx ON invitees(attendance_status)`;
  await sql`CREATE INDEX IF NOT EXISTS invitees_last_response_idx ON invitees(last_response_at DESC)`;
  await sql`CREATE INDEX IF NOT EXISTS rsvp_events_created_at_idx ON rsvp_events(created_at DESC)`;
}

export async function ensureSchema() {
  if (!schemaPromise) {
    schemaPromise = runSchemaSetup();
  }

  return schemaPromise;
}

export async function saveRSVPSubmission(submission: RSVPSubmission, meta: RSVPRequestMeta = {}) {
  await ensureSchema();

  const parsed = submissionSchema.parse(submission);
  const now = parsed.created_at;
  const normalizedEmail = normalizeEmail(parsed.email);
  const normalizedWhatsapp = normalizeWhatsapp(parsed.whatsapp);
  const inviteeId = crypto.randomUUID();

  const upsertRows = (await sql`
    INSERT INTO invitees (
      id,
      name,
      email,
      whatsapp,
      attendance_status,
      utm_source,
      utm_medium,
      utm_campaign,
      inviter,
      origin_channel,
      invite_code,
      first_response_at,
      last_response_at,
      response_count,
      created_at,
      updated_at
    )
    VALUES (
      ${inviteeId}::uuid,
      ${parsed.name},
      ${normalizedEmail},
      ${normalizedWhatsapp},
      ${parsed.attendance_status},
      ${normalizeText(parsed.utm_source)},
      ${normalizeText(parsed.utm_medium)},
      ${normalizeText(parsed.utm_campaign)},
      ${normalizeText(parsed.inviter)},
      ${normalizeText(parsed.origin_channel)},
      ${normalizeText(parsed.invite_code)},
      ${now}::timestamptz,
      ${now}::timestamptz,
      1,
      ${now}::timestamptz,
      ${now}::timestamptz
    )
    ON CONFLICT (email) DO UPDATE SET
      name = EXCLUDED.name,
      whatsapp = EXCLUDED.whatsapp,
      attendance_status = EXCLUDED.attendance_status,
      utm_source = COALESCE(EXCLUDED.utm_source, invitees.utm_source),
      utm_medium = COALESCE(EXCLUDED.utm_medium, invitees.utm_medium),
      utm_campaign = COALESCE(EXCLUDED.utm_campaign, invitees.utm_campaign),
      inviter = COALESCE(EXCLUDED.inviter, invitees.inviter),
      origin_channel = COALESCE(EXCLUDED.origin_channel, invitees.origin_channel),
      invite_code = COALESCE(EXCLUDED.invite_code, invitees.invite_code),
      last_response_at = EXCLUDED.last_response_at,
      response_count = invitees.response_count + 1,
      updated_at = EXCLUDED.updated_at
    RETURNING
      id,
      name,
      email,
      whatsapp,
      attendance_status,
      first_response_at::text,
      last_response_at::text,
      response_count,
      utm_source,
      utm_medium,
      utm_campaign,
      inviter,
      origin_channel,
      invite_code
  `) as unknown[];

  const invitee = asInviteeRecord(upsertRows[0]);

  await sql`
    INSERT INTO rsvp_events (
      id,
      invitee_id,
      name,
      email,
      whatsapp,
      attendance_status,
      utm_source,
      utm_medium,
      utm_campaign,
      inviter,
      origin_channel,
      invite_code,
      request_ip,
      user_agent,
      created_at
    )
    VALUES (
      ${parsed.id}::uuid,
      ${invitee.id}::uuid,
      ${parsed.name},
      ${normalizedEmail},
      ${normalizedWhatsapp},
      ${parsed.attendance_status},
      ${normalizeText(parsed.utm_source)},
      ${normalizeText(parsed.utm_medium)},
      ${normalizeText(parsed.utm_campaign)},
      ${normalizeText(parsed.inviter)},
      ${normalizeText(parsed.origin_channel)},
      ${normalizeText(parsed.invite_code)},
      ${normalizeText(meta.requestIp)},
      ${normalizeText(meta.userAgent)},
      ${now}::timestamptz
    )
  `;

  return invitee;
}

function summarizeInvitees(invitees: InviteeRecord[], sources: DashboardSourcePoint[]): AdminDashboard["summary"] {
  const confirmed = invitees.filter((invitee) => invitee.attendance_status === "confirmed").length;
  const declined = invitees.filter((invitee) => invitee.attendance_status === "declined").length;
  const latestResponseAt = invitees[0]?.last_response_at;

  return {
    totalInvitees: invitees.length,
    confirmed,
    declined,
    attendanceRate: invitees.length ? Math.round((confirmed / invitees.length) * 100) : 0,
    latestResponseAt,
    topChannel: sources[0]?.label,
  };
}

export async function getDashboardData(): Promise<AdminDashboard> {
  await ensureSchema();

  const inviteeRows = (await sql`
    SELECT
      id,
      name,
      email,
      whatsapp,
      attendance_status,
      first_response_at::text,
      last_response_at::text,
      response_count,
      utm_source,
      utm_medium,
      utm_campaign,
      inviter,
      origin_channel,
      invite_code
    FROM invitees
    ORDER BY last_response_at DESC, created_at DESC
  `) as unknown[];

  const timelineRows = (await sql`
    SELECT
      TO_CHAR(DATE_TRUNC('day', created_at AT TIME ZONE 'America/Sao_Paulo'), 'YYYY-MM-DD') AS date,
      COUNT(*)::int AS total,
      SUM(CASE WHEN attendance_status = 'confirmed' THEN 1 ELSE 0 END)::int AS confirmed,
      SUM(CASE WHEN attendance_status = 'declined' THEN 1 ELSE 0 END)::int AS declined
    FROM rsvp_events
    GROUP BY 1
    ORDER BY 1 ASC
  `) as DashboardTimelinePoint[];

  const sourceRows = (await sql`
    SELECT
      COALESCE(NULLIF(origin_channel, ''), NULLIF(utm_source, ''), NULLIF(inviter, ''), 'Direto') AS label,
      COUNT(*)::int AS total
    FROM invitees
    GROUP BY 1
    ORDER BY total DESC, label ASC
    LIMIT 8
  `) as DashboardSourcePoint[];

  const invitees = inviteeRows.map(asInviteeRecord);

  return {
    summary: summarizeInvitees(invitees, sourceRows),
    timeline: timelineRows,
    sources: sourceRows,
    invitees,
  };
}

export function extractRequestMeta(request: Request): RSVPRequestMeta {
  return {
    requestIp:
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      undefined,
    userAgent: request.headers.get("user-agent") || undefined,
  };
}

export function isAttendanceStatus(value: string): value is AttendanceStatus {
  return ATTENDANCE_STATUSES.includes(value as AttendanceStatus);
}
