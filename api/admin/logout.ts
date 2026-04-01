import { clearSessionCookie } from "../_lib/auth.js";
import { jsonResponse } from "../_lib/http.js";

export const runtime = "nodejs";

export async function POST() {
  return jsonResponse(
    { authenticated: false },
    {
      headers: {
        "set-cookie": clearSessionCookie(),
      },
    },
  );
}
