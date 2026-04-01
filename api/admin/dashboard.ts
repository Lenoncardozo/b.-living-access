import { getDashboardData } from "../_lib/database.js";
import { requireAdmin } from "../_lib/auth.js";
import { errorResponse, jsonResponse } from "../_lib/http.js";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const authError = requireAdmin(request);

    if (authError) {
      return authError;
    }

    return jsonResponse(await getDashboardData());
  } catch (error) {
    console.error("GET /api/admin/dashboard failed", error);
    return errorResponse(500, "Não foi possível carregar o dashboard.");
  }
}
