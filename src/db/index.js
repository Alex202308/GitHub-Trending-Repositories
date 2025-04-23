// Подключаем Pool из pg для работы с PostgreSQL
const { Pool } = require('pg');

// Загружаем переменные окружения из .env файла
require('dotenv').config();

// Создаем экземпляр Pool для подключения к базе данных PostgreSQL
const pool = new Pool({
    host: process.env.DB_HOST, // Адрес хоста базы данных (например, localhost)
    port: process.env.DB_PORT, // Порт для подключения к базе данных
    user: process.env.DB_USER, // Имя пользователя для подключения к базе данных
    password: process.env.DB_PASSWORD, // Пароль для подключения к базе данных
    database: process.env.DB_NAME, // Имя базы данных для подключения
});

// Экспортируем pool, чтобы использовать его для выполнения запросов в других файлах
module.exports = pool;
