import type { AdminDashboard, AdminSession } from "./rsvp-contracts";

export interface AdminCredentials {
  username: string;
  password: string;
}

async function parseJson<T>(response: Response) {
  const contentType = response.headers.get("content-type") || "";

  if (!contentType.includes("application/json")) {
    throw new Error("Resposta inesperada do servidor.");
  }

  return (await response.json()) as T;
}

async function readErrorMessage(response: Response) {
  try {
    const data = await parseJson<{ message?: string }>(response);
    return data.message || "Erro ao processar a requisição.";
  } catch {
    return "Erro ao processar a requisição.";
  }
}

export async function fetchAdminSession() {
  const response = await fetch("/api/admin/session", {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  return parseJson<AdminSession>(response);
}

export async function loginAdmin(credentials: AdminCredentials) {
  const response = await fetch("/api/admin/login", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  return parseJson<AdminSession>(response);
}

export async function logoutAdmin() {
  const response = await fetch("/api/admin/logout", {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }
}

export async function fetchAdminDashboard() {
  const response = await fetch("/api/admin/dashboard", {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  return parseJson<AdminDashboard>(response);
}
