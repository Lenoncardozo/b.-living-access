import { createHmac, timingSafeEqual } from "node:crypto";
import type { AdminSession } from "../../src/lib/rsvp-contracts.js";
import { getAdminCredentials, getAdminSessionSecret } from "./env.js";
import { errorResponse } from "./http.js";

const SESSION_COOKIE_NAME = "bliving_admin_session";
const SESSION_MAX_AGE = 60 * 60 * 12;

interface SessionPayload {
  username: string;
  expiresAt: number;
}

function toBase64Url(value: string) {
  return Buffer.from(value).toString("base64url");
}

function fromBase64Url(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function sign(payload: string) {
  return createHmac("sha256", getAdminSessionSecret()).update(payload).digest("base64url");
}

function parseCookies(request: Request) {
  const header = request.headers.get("cookie") || "";

  return header.split(";").reduce<Record<string, string>>((cookies, chunk) => {
    const [key, ...rest] = chunk.trim().split("=");

    if (!key) {
      return cookies;
    }

    cookies[key] = decodeURIComponent(rest.join("="));
    return cookies;
  }, {});
}

function serializeCookie(name: string, value: string, options: Record<string, string | number | boolean>) {
  const parts = [`${name}=${encodeURIComponent(value)}`];

  Object.entries(options).forEach(([key, optionValue]) => {
    if (optionValue === false || optionValue === undefined) {
      return;
    }

    if (optionValue === true) {
      parts.push(key);
      return;
    }

    parts.push(`${key}=${optionValue}`);
  });

  return parts.join("; ");
}

function buildSessionToken(payload: SessionPayload) {
  const encodedPayload = toBase64Url(JSON.stringify(payload));
  const signature = sign(encodedPayload);
  return `${encodedPayload}.${signature}`;
}

function parseSessionToken(token?: string): SessionPayload | null {
  if (!token) {
    return null;
  }

  const [encodedPayload, signature] = token.split(".");

  if (!encodedPayload || !signature) {
    return null;
  }

  const expectedSignature = sign(encodedPayload);
  const provided = Buffer.from(signature);
  const expected = Buffer.from(expectedSignature);

  if (provided.length !== expected.length || !timingSafeEqual(provided, expected)) {
    return null;
  }

  try {
    const payload = JSON.parse(fromBase64Url(encodedPayload)) as SessionPayload;

    if (!payload.username || !payload.expiresAt || payload.expiresAt <= Date.now()) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export function createSessionCookie(username: string) {
  return serializeCookie(SESSION_COOKIE_NAME, buildSessionToken({
    username,
    expiresAt: Date.now() + SESSION_MAX_AGE * 1000,
  }), {
    Path: "/",
    "Max-Age": SESSION_MAX_AGE,
    HttpOnly: true,
    SameSite: "Lax",
    Secure: true,
  });
}

export function clearSessionCookie() {
  return serializeCookie(SESSION_COOKIE_NAME, "", {
    Path: "/",
    "Max-Age": 0,
    HttpOnly: true,
    SameSite: "Lax",
    Secure: true,
  });
}

export function validateAdminCredentials(input: { username?: string; password?: string }) {
  const { username, password } = getAdminCredentials();
  return input.username === username && input.password === password;
}

export function getAdminSession(request: Request): AdminSession {
  const cookies = parseCookies(request);
  const payload = parseSessionToken(cookies[SESSION_COOKIE_NAME]);

  if (!payload) {
    return { authenticated: false };
  }

  return {
    authenticated: true,
    username: payload.username,
  };
}

export function requireAdmin(request: Request) {
  const session = getAdminSession(request);

  if (!session.authenticated) {
    return errorResponse(401, "Sessão administrativa inválida.");
  }

  return null;
}
