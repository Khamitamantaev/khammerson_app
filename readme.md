# Khammerson_app

Это мой монорепозиторий, где в одной папке лежат и фронтенд, и бэкенд. Всё управляется через pnpm.

Фронтенд (apps/web) — на React с Vite, TypeScript и Tailwind.
Бэкенд (apps/server) — на NestJS с TypeScript.

Вся инфраструктура завёрнута в Docker: есть два режима — разработка и продакшен.

В dev режиме: фронт на 3006, бэк на 4000, постгрес на 5433, всё с hot-reload.

В prod режиме: фронт на 3005, бэк на 4001, постгрес на 5432.

Недавно я добавил tRPC для связи между фронтом и бэком. На сервере уже есть базовые роутеры (users, auth), настроен контекст с пользователем, есть protectedProcedure для проверки авторизации. Также сделал глобальный модуль для базы данных с простыми SQL запросами через pg.

Сейчас всё работает в обоих окружениях, но нужно дальше развивать проект: подключать tRPC на фронте, добавлять новые модули, миграции и т.д.

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

## Trpc-playground, примеры запросов
```js
await trpc.users.getAll.query()
```

## License

[MIT](https://choosealicense.com/licenses/mit/)