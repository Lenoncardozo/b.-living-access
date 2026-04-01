import { describe, expect, it } from "vitest";
import { EVENT_DETAILS, generateGoogleCalendarUrl } from "@/lib/invitation";

describe("invitation", () => {
  it("uses the official event closing time in the Google Calendar URL", () => {
    const url = generateGoogleCalendarUrl();

    expect(url).toContain("dates=20250409T210000Z/20250410T020000Z");
  });

  it("keeps the updated location reference in event details", () => {
    expect(EVENT_DETAILS.referenceLabel).toBe("Anexo ao Pátio Milano");
  });
});
