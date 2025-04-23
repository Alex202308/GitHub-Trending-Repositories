// Импортируем необходимые модули
const express = require('express'); // Web фреймворк для создания сервера
const cors = require('cors'); // Модуль для настройки CORS (Cross-Origin Resource Sharing)
const routes = require('./api/routes'); // Подключаем маршруты API
const { startSyncTimer } = require('./timer'); // Импортируем функцию для старта автосинхронизации
require('dotenv').config(); // Загружаем переменные окружения из .env файла

// Создаём экземпляр приложения Express
const app = express();

// Настройка CORS для разрешения запросов с фронтенда
app.use(
    cors({
        origin: 'http://localhost:5173', // Разрешаем доступ только с указанного фронтенда
    })
);

// Подключаем middleware для обработки JSON запросов
app.use(express.json());

// Устанавливаем маршруты для API
app.use('/api', routes);

// Устанавливаем порт из переменной окружения или по умолчанию 3000
const PORT = process.env.PORT || 3000;

// Запускаем сервер на указанном порту
app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
    // Запускаем таймер для автосинхронизации репозиториев
    startSyncTimer();
});
