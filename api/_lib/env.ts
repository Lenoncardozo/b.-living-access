const REQUIRED_ENV_KEYS = ["DATABASE_URL", "ADMIN_USERNAME", "ADMIN_PASSWORD", "ADMIN_SESSION_SECRET"] as const;

type RequiredEnvKey = (typeof REQUIRED_ENV_KEYS)[number];

function readEnvValue(key: RequiredEnvKey) {
  return process.env[key]?.trim();
}

function requireEnvValue(key: RequiredEnvKey) {
  const value = readEnvValue(key);

  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }

  return value;
}

export function getDatabaseUrl() {
  return requireEnvValue("DATABASE_URL");
}

export function getAdminCredentials() {
  return {
    username: requireEnvValue("ADMIN_USERNAME"),
    password: requireEnvValue("ADMIN_PASSWORD"),
  };
}

export function getAdminSessionSecret() {
  return requireEnvValue("ADMIN_SESSION_SECRET");
}

export function getEnvHealth() {
  return REQUIRED_ENV_KEYS.reduce<Record<RequiredEnvKey, boolean>>((state, key) => {
    state[key] = Boolean(readEnvValue(key));
    return state;
  }, {} as Record<RequiredEnvKey, boolean>);
}
