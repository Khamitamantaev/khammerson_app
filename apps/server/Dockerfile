# Build stage
FROM node:20-alpine AS builder

RUN npm install -g pnpm@10.10.0
WORKDIR /app

# Копируем package.json и lock файлы
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/server/package.json ./apps/server/

# Устанавливаем зависимости
RUN pnpm install --frozen-lockfile

# Проверяем что nest установился
RUN ls -la /app/apps/server/node_modules/.bin/ | grep nest

# Копируем исходники (НЕ node_modules!)
COPY apps/server/tsconfig*.json ./apps/server/
COPY apps/server/nest-cli.json ./apps/server/
COPY apps/server/src ./apps/server/src/

# Собираем
RUN cd /app/apps/server && ./node_modules/.bin/nest build

# Production stage
FROM node:20-alpine AS production

RUN npm install -g pnpm@10.10.0
WORKDIR /app

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/server/package.json ./apps/server/
RUN pnpm install --prod --frozen-lockfile

COPY --from=builder /app/apps/server/dist ./apps/server/dist

EXPOSE 4000
CMD ["node", "apps/server/dist/main.js"]