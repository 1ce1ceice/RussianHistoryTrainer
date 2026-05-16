[![Maintainability](https://qlty.sh/gh/1ce1ceice/projects/RussianHistoryTrainer/maintainability.svg)](https://qlty.sh/gh/1ce1ceice/projects/RussianHistoryTrainer)

# Онлайн-тренажер по истории России

Приложение для подготовки и самопроверки по истории России. :exclamation:В текущей версии полная серверная часть и база данных работают только локально, так как я еще не задеплоил бэкенд:exclamation:

## :question:Функции

- каталог тем
- регистрация и авторизация пользователя
- JWT-аутентификация
- прохождение теста по выбранной теме
- выбор ответа и переход между вопросами
- подсчет процента правильных ответов
- просмотр объяснений после завершения теста
- сохранение результатов прохождений в PostgreSQL
- очистка истории результатов
- адаптивная верстка

## Архитектура

- **Frontend:** React + Vite

- **Backend:** Node.js + Express

- **Authentication:** JWT, bcrypt

- **Routing:** React Router

- **State:** React Hooks, Context API

- **Database:** PostgreSQL

- **UI:** CSS

- **Deployment:** Netlify

## :exclamation:Установка

1. Клонировать репозиторий

```bash
git clone git@github.com:1ce1ceice/RussianHistoryTrainer.git
cd RussianHistoryTrainer
```

2. Установить зависимости frontend
```bash
cd client
npm install
```

3. Установить зависимости backend
```bash
cd server
npm install
```

4. Создать файл .env в папке server
```env
PORT=5001
DB_HOST=localhost
DB_PORT=5432
DB_NAME=history_trainer
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_secret_key
```

## :rocket:Запуск

1. Запустить backend
```bash
cd server
npm run dev
```

Backend будет доступен по адресу:
http://localhost:5001

2. Запустить frontend
```bash
cd client
npm run dev
```

Frontend будет доступен по адресу:
http://localhost:5173

## Деплой

https://russianhistorytrainer.netlify.app

## Demo

![Demo](demoGIF.gif)


