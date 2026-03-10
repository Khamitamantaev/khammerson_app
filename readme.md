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

## Run app with docker

```js
docker-compose up -d 
```

## ReBuild server container(if change configs etc.)

```js
docker-compose down server
docker-compose -rm -f server
docker-compose up -d --build server
```


## ReBuild web container(if change configs etc.)

```js
docker-compose down web
docker-compose -rm -f web
docker-compose up -d --build web
```

## License

[MIT](https://choosealicense.com/licenses/mit/)