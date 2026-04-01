export function jsonResponse(body: unknown, init: ResponseInit = {}) {
  const headers = new Headers(init.headers);

  if (!headers.has("content-type")) {
    headers.set("content-type", "application/json; charset=utf-8");
  }

  return new Response(JSON.stringify(body), {
    ...init,
    headers,
  });
}

export function errorResponse(status: number, message: string, details?: Record<string, unknown>) {
  return jsonResponse(
    {
      message,
      ...details,
    },
    { status },
  );
}

export async function parseJsonBody<T>(request: Request) {
  try {
    return (await request.json()) as T;
  } catch {
    throw new Error("INVALID_JSON");
  }
}
