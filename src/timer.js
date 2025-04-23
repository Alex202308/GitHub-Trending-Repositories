// Импортируем функцию для синхронизации репозиториев с GitHub
const { fetchTrendingRepos } = require('./services/githubSync');
// Загружаем переменные окружения из .env файла
require('dotenv').config();

// Переменная для хранения идентификатора интервала
let interval = null;

// Функция для запуска таймера автосинхронизации
function startSyncTimer() {
    // Получаем интервал синхронизации из переменных окружения или по умолчанию 10 минут
    const minutes = parseInt(process.env.SYNC_INTERVAL_MINUTES || '10');
    // Переводим минуты в миллисекунды
    const ms = minutes * 60 * 1000;

    // Если интервал уже существует, сбрасываем его
    if (interval) clearInterval(interval);

    // Выполняем синхронизацию сразу при старте
    fetchTrendingRepos();
    // Настроим интервал для выполнения синхронизации через заданное количество минут
    interval = setInterval(fetchTrendingRepos, ms);

    // Логируем информацию о частоте синхронизации
    console.log(`[⏱] Автосинхронизация каждые ${minutes} минут.`);
}

// Асинхронная функция для выполнения форсированной синхронизации по команде
async function forceSyncNow() {
    console.log('[🔁] Форс-синхронизация по команде...');
    // Выполняем синхронизацию немедленно
    await fetchTrendingRepos();
}

// Экспортируем функции, чтобы они могли быть использованы в других частях приложения
module.exports = { startSyncTimer, forceSyncNow };
