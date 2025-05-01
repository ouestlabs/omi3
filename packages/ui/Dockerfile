# syntax=docker/dockerfile:1.4

FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV PNPM_VERSION="9.15.4"
WORKDIR /app

RUN apk add --no-cache libc6-compat && \
  corepack enable && \
  corepack prepare pnpm@${PNPM_VERSION} --activate

# Étape pour préparer les dépendances avec Turbo
FROM base AS pruner
RUN npm install -g turbo
COPY . .
RUN turbo prune @omi3/ui --docker

# Étape pour installer les dépendances
FROM base AS deps
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Étape de développement
FROM base AS development
ENV NODE_ENV=development

COPY pnpm-lock.yaml package.json pnpm-workspace.yaml turbo.json ./
COPY packages/ui/package.json ./ui/

RUN pnpm install --frozen-lockfile --shamefully-hoist --no-cache && \
  pnpm store prune

WORKDIR /app/ui
EXPOSE 3000
ENV PORT=3000

CMD ["pnpm", "dev"]

# Étape de build
FROM base AS builder

WORKDIR /app
COPY --from=pruner /app/out/full/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Configuration des variables d'environnement pour le build en utilisant les ARGs
ENV NODE_ENV=production \
  NEXT_TELEMETRY_DISABLED=1

# Construction de l'application
RUN pnpm turbo build --filter=@omi3/ui...

# Étape de production
FROM node:22-alpine AS production
WORKDIR /app

# Création d'un utilisateur non-root pour la sécurité
RUN addgroup --system --gid 1001 nodejs && \
  adduser --system --uid 1001 nextjs && \
  mkdir -p /app/node_modules && \
  chown -R nextjs:nodejs /app

# Copie des fichiers nécessaires pour l'exécution
COPY --from=builder --chown=nextjs:nodejs /app/packages/ui/.next/standalone/ ./
COPY --from=builder --chown=nextjs:nodejs /app/packages/ui/.next/static/ ./.next/static/
COPY --from=builder --chown=nextjs:nodejs /app/packages/ui/public/ ./public/

USER nextjs

ENV NODE_ENV=production \
  PORT=3000 \
  HOSTNAME=0.0.0.0 \
  NEXT_TELEMETRY_DISABLED=1

EXPOSE 3000

CMD ["node", "server.js"]