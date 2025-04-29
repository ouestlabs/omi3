# Use a base image with pnpm pre-installed
FROM node:22-alpine AS base
RUN npm install -g pnpm turbo

# Build stage
FROM base AS builder
RUN apk update && apk add --no-cache libc6-compat
WORKDIR /app
COPY . .

RUN turbo prune @omi3/ui --docker

# Install and build stage
FROM base AS installer
RUN apk update && apk add --no-cache libc6-compat
WORKDIR /app

# Copy necessary files for installation
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/out/full/ .
RUN pnpm install

# Copy remaining files and build
COPY --from=builder /app/out/full/ .
RUN pnpm turbo build --filter=@omi3/ui...

# Final stage
FROM base AS runner
WORKDIR /app

# Create user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 omi3
USER omi3

# Copy standalone content
COPY --from=installer --chown=omi3:nodejs /app/packages/ui/.next/standalone ./
COPY --from=installer --chown=omi3:nodejs /app/packages/ui/.next/static ./packages/ui/.next/static
COPY --from=installer --chown=omi3:nodejs /app/packages/ui/public ./packages/ui/public

EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

CMD ["node", "packages/ui/server.js"]
