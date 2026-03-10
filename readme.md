# Khammerson_app

Khammerson_app - это тестовый проект монорепозитория pnpm на vite + nestjs

## Installation and run local dev

Use the package manager pnpm 

```js
pnpm i
docker-compose up -d postgres
pnpm run dev
```

## Run app with docker first time

```js
docker-compose up -d --build
```

## Run app with docker first time

```js
docker-compose up -d --build

# 2. Запустить watch режим отдельно
docker-compose watch
```

## Run app with docker later

```js
docker-compose up --watch
```

## ReBuild containers for development(if change configs etc.)

```js
docker-compose down -v
docker-compose build
docker-compose up --watch
```

## License

[MIT](https://choosealicense.com/licenses/mit/)