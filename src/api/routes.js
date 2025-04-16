const express = require('express');
const router = express.Router();
const pool = require('../db');
const { forceSyncNow } = require('../timer');

// 🔹 GET /api/repos — получить все репозитории
router.get('/repos', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM repositories ORDER BY stargazers_count DESC'
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 🔹 GET /api/repos/:id — получить по ID или имени
router.get('/repos/:identifier', async (req, res) => {
    const { identifier } = req.params;

    try {
        let result;

        // Проверяем: это число (ID) или текст (имя)
        if (!isNaN(identifier)) {
            result = await pool.query(
                'SELECT * FROM repositories WHERE id = $1',
                [identifier]
            );
        } else {
            result = await pool.query(
                'SELECT * FROM repositories WHERE name = $1',
                [identifier]
            );
        }

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Repository not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 🔹 POST /api/sync — форс-синхронизация
router.post('/sync', async (req, res) => {
    try {
        forceSyncNow(); // запускает синхронизацию и сбрасывает таймер
        res.json({ message: 'Sync started' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
