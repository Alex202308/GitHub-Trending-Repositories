// Подключаем пул соединений с базой данных
const pool = require('../db');

// Создаём класс для работы с репозиториями в базе данных
class RepoRepository {
    // Метод для сохранения репозитория в базе данных
    async save(repo) {
        // Выполняем SQL запрос для вставки нового репозитория в таблицу или обновления существующего
        await pool.query(
            `
            INSERT INTO repositories (
                github_id, name, full_name, html_url, description,
                stargazers_count, language, created_at, updated_at
            )
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
            ON CONFLICT (github_id) DO UPDATE SET
                stargazers_count = EXCLUDED.stargazers_count,
                updated_at = EXCLUDED.updated_at;
            `,
            [
                repo.id, // github_id репозитория
                repo.name, // Название репозитория
                repo.full_name, // Полное имя репозитория
                repo.html_url, // URL репозитория на GitHub
                repo.description, // Описание репозитория
                repo.stargazers_count, // Количество звёзд
                repo.language, // Язык программирования
                new Date(repo.created_at), // Дата создания репозитория
                new Date(repo.updated_at), // Дата последнего обновления репозитория
            ]
        );
    }

    // Метод для удаления всех репозиториев из базы данных
    async deleteAll() {
        // Выполняем SQL запрос для очистки таблицы репозиториев и сброса счётчика идентификаторов
        await pool.query('TRUNCATE TABLE repositories RESTART IDENTITY');
    }
}

// Экспортируем экземпляр класса RepoRepository для использования в других частях приложения
module.exports = new RepoRepository();
