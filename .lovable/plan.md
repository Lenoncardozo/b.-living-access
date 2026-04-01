

# Deploy na Vercel — Plano de Preparação

## Resumo

O projeto já é um SPA Vite + React padrão. Para funcionar na Vercel, só precisa de **um arquivo de configuração** para garantir que o client-side routing funcione (todas as rotas caem no `index.html`).

## O que precisa ser feito

### 1. Criar `vercel.json` na raiz do projeto

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

Isso garante que rotas como `/hero-a`, `/hero-b`, `/hero-c` funcionem sem 404.

### 2. Nada mais no código

- O `build` command já é `vite build` e o output já vai para `dist/` — a Vercel detecta isso automaticamente.
- Não há backend/edge functions no projeto (RSVPs ficam no localStorage) — não há nada para migrar.
- Não há variáveis de ambiente necessárias.

## Passos na Vercel (após a mudança no código)

1. Conecte o repositório GitHub do projeto na Vercel.
2. Framework preset: **Vite** (a Vercel detecta automaticamente).
3. Build command: `npm run build` (padrão).
4. Output directory: `dist` (padrão).
5. Deploy.

## Escopo da mudança

| Arquivo | Ação |
|---------|------|
| `vercel.json` | Criar (novo) |

Uma única alteração. O restante do projeto já está pronto para deploy na Vercel.

