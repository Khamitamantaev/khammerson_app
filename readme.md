# Khammerson_app

Khammerson_app — это мой монорепозиторий, где в одной папке лежат и фронтенд, и бэкенд. Всё управляется через pnpm.

Фронтенд (apps/web) — на React с Vite, TypeScript и Tailwind.
Бэкенд (apps/server) — на NestJS с TypeScript.

Вся инфраструктура завёрнута в Docker с двумя независимыми окружениями.
В dev режиме: фронт на 3006, бэк на 4000, постгрес на 5433, настроен hot-reload через watch режим.
В prod режиме: фронт на 3005, бэк на 4001, постгрес на 5432.

Для связи между фронтом и бэком используется tRPC с полной типизацией. На сервере настроены базовые роутеры (users, auth), контекст с пользователем и protectedProcedure для проверки авторизации. Валидация данных осуществляется через Zod.

Создан глобальный модуль для работы с PostgreSQL через пул соединений (pg) с поддержкой простых SQL запросов. Настроена JWT аутентификация.

Оба окружения полностью работоспособны и не конфликтуют между собой благодаря раздельным Docker Compose файлам, volumes и networks. Для управления проектом используется Taskfile с набором команд для сборки и запуска.

В планах: подключение tRPC на клиенте, добавление новых модулей, миграции для базы данных.

## Installation and run local dev

Use the package manager pnpm

```js
pnpm i
docker-compose up -d postgres
pnpm run dev
```

Для удобства task/cli the package manager pnpm

```js
pnpm i -g @go-task/cli
```

## Все доступные команды можно увидеть в task default:

```js
task default
```

## Основные команды:

# ================ Development =================

Запуск и создание development окружения в первый раз

```js
task dev-build
```

Запустить dev окружение с watch режимом

```js
task dev-up
```

Пересборка и запуск всего dev окружения...

```js
task dev-rebuild
```

# ================ Production =================

Запуск и сборка production окружения...

```js
task prod-build
```

Запуск production окружения...

```js
task prod-up
```

Пересобрать и запустить prod заново

```js
task  prod-rebuild
```

## ================ Trpc-playground, примеры запросов =================

```js
await trpc.users.getAll.query();
```

# Получить пользователя по ID

```js
await trpc.users.getOne.query({ id: "uuid-пользователя" });
```

# Создать нового пользователя

```js
await trpc.users.create.mutate({
  email: "newuser@example.com",
  userName: "newuser",
  password: "123456",
  name: "New User", // опционально
});
```

## License

[MIT](https://choosealicense.com/licenses/mit/)
