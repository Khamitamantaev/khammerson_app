FROM node:20-alpine

# Устанавливаем pnpm
RUN npm install -g pnpm

WORKDIR /app

# Копируем ВСЕ файлы проекта
COPY . .

# Устанавливаем зависимости
RUN pnpm install

WORKDIR /app/apps/web

EXPOSE 3006

# Для разработки - используем команду из package.json
CMD ["pnpm", "run", "dev"]