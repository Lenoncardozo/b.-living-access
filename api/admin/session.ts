import { getAdminSession } from "../_lib/auth.js";
import { jsonResponse } from "../_lib/http.js";

export const runtime = "nodejs";

export async function GET(request: Request) {
  return jsonResponse(getAdminSession(request));
}
