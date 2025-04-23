# GitHub-Trending-Repositories

Проект на Node.js + React для отображения популярных репозиториев с GitHub, созданных за последнюю неделю.

## 📌 Что делает этот код:

Делает запрос в GitHub API, чтобы получить топ 10 репозиториев, созданных за последнюю неделю, отсортированных по количеству звёзд.

## Установка и запуск Backend

### 1. Установите зависимости:

```bash
npm install
```

### 2. Создайте файл `.env` в корне проекта:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_database_password
DB_NAME=github_trending
SYNC_INTERVAL_MINUTES=10
```

### 3. Создайте базу данных PostgreSQL и таблицу:

```sql
CREATE DATABASE github_trending;

CREATE TABLE repositories (
    id SERIAL PRIMARY KEY,
    github_id BIGINT UNIQUE,
    name TEXT,
    full_name TEXT,
    html_url TEXT,
    description TEXT,
    stargazers_count INT,
    language TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### 4. Запустите сервер:

```bash
npm run dev
```

> ⚠️ **Важно:** Сервер должен быть запущен, чтобы использовать CLI и frontend.
>
> ❌ Чтобы остановить сервер, нажмите `CTRL + C` в терминале.

## 💡 CLI

Работа с репозиториями через командную строку:

Показать все репозитории:

```bash
node cli.js list
```

Получить репозиторий по ID или имени:

```bash
node cli.js get <id|name>
```

Форс-синхронизация:

```bash
node cli.js sync
```

## 🌐 Frontend (React + Vite)

Находится в папке `client`.

Установка и запуск:

```bash
cd client
npm install
npm run dev
```
