# LHI website: small production image (Next.js standalone server, ~200 MB RAM at rest).
# Built and run by docker-compose.yml together with its PostgreSQL database.

FROM node:22-bookworm-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

FROM node:22-bookworm-slim AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Public settings are baked into the browser code, so they are needed at build time.
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_GA_MEASUREMENT_ID
ARG NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_TURNSTILE_SITE_KEY
# One build worker and a capped heap keep the build from crowding out other apps on the server.
ENV NEXT_TELEMETRY_DISABLED=1 \
    NEXT_BUILD_CPUS=1 \
    NODE_OPTIONS=--max-old-space-size=1536
RUN npm run build

FROM node:22-bookworm-slim AS run
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0 \
    # Memory: a 320 MB heap ceiling, 8 MB of rendered pages in memory (the rest from disk),
    # and two background threads for image resizing (WebP only; see next.config.ts).
    NODE_OPTIONS=--max-old-space-size=320 \
    NEXT_CACHE_MAX_MEMORY=8388608 \
    UV_THREADPOOL_SIZE=2 \
    # Stops the image library's memory fragmenting and growing over time.
    MALLOC_ARENA_MAX=2 \
    DATABASE_POOL_MAX=5 \
    DATABASE_PREPARE=true
RUN groupadd --system app && useradd --system --gid app --home /app app
COPY --from=build --chown=app:app /app/.next/standalone ./
COPY --from=build --chown=app:app /app/.next/static ./.next/static
COPY --from=build --chown=app:app /app/public ./public
# The one-time Neon copy script needs the database driver (Next.js bundles its own copy into the server).
COPY --from=build --chown=app:app /app/node_modules/postgres ./node_modules/postgres
COPY --chown=app:app scripts/migrate-from-neon.mjs scripts/docker-entrypoint.sh ./scripts/
# The cache folder exists (owned by the app user) so a mounted volume can be written to.
RUN mkdir -p /app/.next/cache && chown -R app:app /app/.next/cache
USER app
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/robots.txt').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["sh", "scripts/docker-entrypoint.sh"]
