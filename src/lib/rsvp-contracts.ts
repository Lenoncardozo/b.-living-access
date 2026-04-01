export const ATTENDANCE_STATUSES = ["confirmed", "declined"] as const;

export type AttendanceStatus = (typeof ATTENDANCE_STATUSES)[number];

export interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  inviter?: string;
  origin_channel?: string;
  invite_code?: string;
}

export interface RSVPSubmission extends UTMParams {
  id: string;
  name: string;
  whatsapp: string;
  email: string;
  attendance_status: AttendanceStatus;
  created_at: string;
}

export interface InviteeRecord extends UTMParams {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  attendance_status: AttendanceStatus;
  first_response_at: string;
  last_response_at: string;
  response_count: number;
}

export interface RSVPEventRecord extends UTMParams {
  id: string;
  invitee_id: string;
  name: string;
  email: string;
  whatsapp: string;
  attendance_status: AttendanceStatus;
  created_at: string;
  request_ip?: string;
  user_agent?: string;
}

export interface AdminSession {
  authenticated: boolean;
  username?: string;
}

export interface DashboardSummary {
  totalInvitees: number;
  confirmed: number;
  declined: number;
  attendanceRate: number;
  latestResponseAt?: string;
  topChannel?: string;
}

export interface DashboardTimelinePoint {
  date: string;
  total: number;
  confirmed: number;
  declined: number;
}

export interface DashboardSourcePoint {
  label: string;
  total: number;
}

export interface AdminDashboard {
  summary: DashboardSummary;
  timeline: DashboardTimelinePoint[];
  sources: DashboardSourcePoint[];
  invitees: InviteeRecord[];
}
