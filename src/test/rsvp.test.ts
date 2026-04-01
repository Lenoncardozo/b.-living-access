import { beforeEach, describe, expect, it, vi } from "vitest";
import { buildRSVPSubmission, submitRSVP } from "@/lib/rsvp";

describe("rsvp", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("normalizes the payload before sending", () => {
    vi.spyOn(crypto, "randomUUID").mockReturnValue("uuid-123");
    vi.spyOn(Date.prototype, "toISOString").mockReturnValue("2025-04-09T18:00:00.000Z");

    const submission = buildRSVPSubmission({
      name: "  Maria Silva  ",
      whatsapp: "(48) 99999-1212",
      email: "  MARIA@EXAMPLE.COM ",
      attendance: "confirmed",
    });

    expect(submission).toMatchObject({
      id: "uuid-123",
      name: "Maria Silva",
      whatsapp: "48999991212",
      email: "maria@example.com",
      attendance_status: "confirmed",
      created_at: "2025-04-09T18:00:00.000Z",
    });
  });

  it("posts the normalized submission to the internal API", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }),
    );

    vi.stubGlobal("fetch", fetchMock);

    const submission = {
      id: "uuid-123",
      name: "Maria Silva",
      whatsapp: "48999991212",
      email: "maria@example.com",
      attendance_status: "confirmed" as const,
      created_at: "2025-04-09T18:00:00.000Z",
    };

    await expect(submitRSVP(submission)).resolves.toBeUndefined();
    expect(fetchMock).toHaveBeenCalledWith("/api/rsvp", expect.objectContaining({
      method: "POST",
    }));
  });
});
