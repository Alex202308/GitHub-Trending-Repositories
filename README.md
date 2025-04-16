# GitHub-Trending-Repositories
Проект на Node.js + React для отображения популярных репозиториев с GitHub, созданных за последнюю неделю.
📌 Что делает этот код:
Делает запрос в GitHub API, чтобы получить топ 10 репозиторий, созданные за последнюю неделю, отсортированные по количеству звёзд.

Установка и запуск Backend

1. Установите зависимости:
npm install

2. В файле .env в корне проекта в строке DB_PASSWORD=your_database_password укажите свой пароль от вашей базы данных.

3. Создайте базу данных PostgreSQL и таблицу:
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

4. Запустите сервер:
npm run dev
⚠️ Важно: Сервер должен быть запущен, чтобы использовать CLI и frontend.

❌ Чтобы остановить сервер, нажмите CTRL + C в терминале.

💡 CLI
Работа с репозиториями через командную строку:

Показать все репозитории:
node cli.js list

Получить репозиторий по ID или имени:
node cli.js get <id|name>

Форс-синхронизация:
node cli.js sync

🌐 Frontend (React + Vite)
Находится в папке client.

Установка и запуск:
cd client
npm install
npm run dev
