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

## Production 

# 1. Собрать production образы
```js
docker-compose -f docker-compose.prod.yml build
```
# 2. Запустить production версию
```js
docker-compose -f docker-compose.prod.yml up -d
```
# 3. Проверить логи
```js
docker-compose -f docker-compose.prod.yml logs -f
```
# 4. Протестировать:
# - Web: http://localhost:3006
# - API: http://localhost:4000

# 5. Для быстрого rebuilding контейнера в production, к примеру web_prod
```js
docker compose -f docker-compose.prod.yml up --build --force-recreate -d web_prod
```

# 6. Пересобрать и перезапустить prod сборку после обновления кода
```js
docker-compose -f docker-compose.prod.yml up -d --build
```

# 6. Остановить
```js
docker-compose -f docker-compose.prod.yml down
```


## License

[MIT](https://choosealicense.com/licenses/mit/)