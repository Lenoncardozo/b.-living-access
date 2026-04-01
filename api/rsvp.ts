import { saveRSVPSubmission, extractRequestMeta } from "./_lib/database.js";
import { errorResponse, jsonResponse, parseJsonBody } from "./_lib/http.js";
import type { RSVPSubmission } from "../src/lib/rsvp-contracts.js";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const submission = await parseJsonBody<RSVPSubmission>(request);
    const invitee = await saveRSVPSubmission(submission, extractRequestMeta(request));

    return jsonResponse(
      {
        ok: true,
        invitee,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /api/rsvp failed", error);

    if (error instanceof Error && error.message === "INVALID_JSON") {
      return errorResponse(400, "Payload inválido.");
    }

    return errorResponse(500, "Não foi possível registrar a confirmação.");
  }
}
