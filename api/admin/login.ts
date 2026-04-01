import { createSessionCookie, validateAdminCredentials } from "../_lib/auth.js";
import { errorResponse, jsonResponse, parseJsonBody } from "../_lib/http.js";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const payload = await parseJsonBody<{ username?: string; password?: string }>(request);

    if (!validateAdminCredentials(payload)) {
      return errorResponse(401, "Login ou senha inválidos.");
    }

    return jsonResponse(
      {
        authenticated: true,
        username: payload.username,
      },
      {
        headers: {
          "set-cookie": createSessionCookie(payload.username || "admin"),
        },
      },
    );
  } catch (error) {
    console.error("POST /api/admin/login failed", error);
    return errorResponse(400, "Não foi possível processar o login.");
  }
}
