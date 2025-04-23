// Импортируем необходимые библиотеки
const express = require('express');
const router = express.Router(); // Создаем экземпляр роутера
const pool = require('../db'); // Подключаем пул соединений с базой данных PostgreSQL
const { forceSyncNow } = require('../timer'); // Импортируем функцию для форс-синхронизации

// 🔹 GET /api/repos — получить все репозитории
router.get('/repos', async (req, res) => {
    try {
        // Запрос к базе данных для получения всех репозиториев, отсортированных по количеству звезд
        const result = await pool.query(
            'SELECT * FROM repositories ORDER BY stargazers_count DESC'
        );
        // Возвращаем список репозиториев в формате JSON
        res.json(result.rows);
    } catch (err) {
        // Обрабатываем ошибки, если запрос к базе данных не удался
        res.status(500).json({ error: err.message });
    }
});

// 🔹 GET /api/repos/:id — получить репозиторий по ID или имени
router.get('/repos/:identifier', async (req, res) => {
    const { identifier } = req.params; // Извлекаем параметр из URL

    try {
        let result;

        // Проверяем, является ли параметр числом (ID) или строкой (имя)
        if (!isNaN(identifier)) {
            // Если это число, ищем репозиторий по ID
            result = await pool.query(
                'SELECT * FROM repositories WHERE id = $1',
                [identifier]
            );
        } else {
            // Если это строка, ищем репозиторий по имени
            result = await pool.query(
                'SELECT * FROM repositories WHERE name = $1',
                [identifier]
            );
        }

        // Если репозиторий не найден, возвращаем ошибку 404
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Repository not found' });
        }

        // Возвращаем найденный репозиторий
        res.json(result.rows[0]);
    } catch (err) {
        // Обрабатываем ошибки, если запрос не удался
        res.status(500).json({ error: err.message });
    }
});

// 🔹 POST /api/sync — форс-синхронизация
router.post('/sync', async (req, res) => {
    try {
        // Запускаем форс-синхронизацию, которая перезапускает таймер
        await forceSyncNow();
        // Возвращаем сообщение о завершении синхронизации
        res.status(200).json({ message: '✅ Синхронизация завершена' });
    } catch (err) {
        // Обрабатываем ошибки, если синхронизация не удалась
        res.status(500).json({ error: err.message });
    }
});

// Экспортируем маршруты, чтобы они могли быть использованы в index.js
module.exports = router;
