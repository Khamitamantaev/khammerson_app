# Khammerson_app

Khammerson_app - это тестовый проект монорепозитория pnpm на vite + nestjs

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
## Task default выдаст стандартные команды для запуска, среди которых:

## Запуск development app с watch и сборкой(Здесь так же при помощи watch можно спокойно разрабатывать с hot-reload)

```js
task dev_build
```

## Run development app

```js
task dev
```

## Run production app со сборкой
```js
task prod_build
```

## Run production app

```js
task prod
```

## Все доступные команды можно увидеть в task default:
```js
task default
```

## Trpc-playground, примеры запросов
```js
await trpc.users.getAll.query()
```

## License

[MIT](https://choosealicense.com/licenses/mit/)