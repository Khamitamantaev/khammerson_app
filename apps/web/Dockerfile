# Stage 1: Build
FROM node:20-alpine AS builder

# Установка pnpm
RUN npm install -g pnpm@10.10.0
WORKDIR /app

# Копируем ВСЁ (временное решение для проверки)
COPY . .

# Явно переходим в папку web и устанавливаем зависимости
WORKDIR /app/apps/web
RUN pnpm install

# Собираем
RUN pnpm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine AS production

# Копируем nginx конфигурацию
COPY apps/web/nginx.conf /etc/nginx/nginx.conf

# Копируем собранные файлы
COPY --from=builder /app/apps/web/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]