# B. Living Access

Landing page do convite de inauguração da B. Living Floripa.

## Rotas

- `/` — versão atual mantida
- `/new` — nova direção editorial
- `/admin` — dashboard interno protegido por login e senha

## Persistência e dashboard

As confirmações são gravadas no Neon Postgres conectado ao projeto Vercel.

Configure estas variáveis de ambiente:

```bash
ADMIN_USERNAME=admin
ADMIN_PASSWORD=...
ADMIN_SESSION_SECRET=...
```

O formulário da home envia para `/api/rsvp`. O `/admin` autentica via cookie HttpOnly e lê os dados consolidados em `/api/admin/dashboard`.
