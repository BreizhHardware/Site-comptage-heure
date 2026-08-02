# ── Stage 1 : installation des dépendances ───────────────────────────────────
FROM node:24-alpine AS deps
WORKDIR /app
RUN npm install -g pnpm@11
COPY package*.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

# ── Stage 2 : build ───────────────────────────────────────────────────────────
FROM node:24-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm@11

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Provider de base de données pour le build (sqlite par défaut)
ARG DATABASE_PROVIDER=sqlite
ENV DATABASE_PROVIDER=${DATABASE_PROVIDER}
ARG DATABASE_URL=file:./data/dev.db
ENV DATABASE_URL=${DATABASE_URL}

# Valeur factice au build – sera surchargée à l'exécution
ENV NEXTAUTH_SECRET=build_time_placeholder
ENV NEXT_TELEMETRY_DISABLED=1

# Configurer le schéma selon le provider et générer le client Prisma
RUN node scripts/setup-db.js --generate-only

RUN pnpm run build

# ── Stage 3 : image de production allégée ─────────────────────────────────────
FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Sortie standalone Next.js (serveur + node_modules minimaux)
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Schéma Prisma et scripts utilitaires (setup, create-super-admin…)
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/scripts ./scripts

# Client Prisma généré + CLI (nécessaires pour db push au démarrage)
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/node_modules/prisma ./node_modules/prisma

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Créer les dossiers, appliquer le schéma DB, démarrer le serveur standalone
CMD ["sh", "-c", "mkdir -p /app/prisma/data && mkdir -p /app/uploads && node scripts/setup-db.js --push-only && node server.js"]
