# ============================================
# SmartGrow SecureAI - Frontend Dockerfile
# ============================================
# Мультистадійна збірка для оптимального розміру образу
# ============================================

# ============================================
# Stage 1: Dependencies
# ============================================
FROM node:20-alpine AS deps
WORKDIR /app

# Встановлення pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Копіювання файлів залежностей
COPY package.json pnpm-lock.yaml* ./

# Встановлення залежностей
RUN pnpm install --frozen-lockfile

# ============================================
# Stage 2: Builder
# ============================================
FROM node:20-alpine AS builder
WORKDIR /app

# Встановлення pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Копіювання залежностей
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Змінні середовища для збірки
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Збірка додатку
RUN pnpm build

# ============================================
# Stage 3: Runner
# ============================================
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Створення непривілейованого користувача
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Копіювання необхідних файлів
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Встановлення прав
USER nextjs

# Порт
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Запуск
CMD ["node", "server.js"]
