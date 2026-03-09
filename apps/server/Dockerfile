FROM node:20-alpine

# Устанавливаем pnpm и nest cli глобально
RUN npm install -g pnpm @nestjs/cli

WORKDIR /app

# Копируем ВСЕ файлы проекта
COPY . .

# Устанавливаем зависимости
RUN pnpm install

WORKDIR /app/apps/server

EXPOSE 3000

# Для разработки
CMD ["nest", "start", "--watch"]