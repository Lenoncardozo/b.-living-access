import type { RSVPSubmission, UTMParams } from "./rsvp-contracts";

export type { RSVPSubmission, UTMParams } from "./rsvp-contracts";

export function getUTMParams(): UTMParams {
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

export function buildRSVPSubmission(input: {
  name: string;
  whatsapp: string;
  email: string;
  attendance: "confirmed" | "declined";
}) {
  return {
    id: crypto.randomUUID(),
    name: input.name.trim(),
    whatsapp: input.whatsapp.replace(/\D/g, ""),
    email: input.email.trim().toLowerCase(),
    attendance_status: input.attendance,
    created_at: new Date().toISOString(),
    ...getUTMParams(),
  } satisfies RSVPSubmission;
}

async function readErrorMessage(response: Response) {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    const data = (await response.json()) as { message?: string };
    return data.message || "Request failed";
  }

  return (await response.text()) || "Request failed";
}

export async function submitRSVP(submission: RSVPSubmission) {
  const response = await fetch("/api/rsvp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(submission),
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }
}
