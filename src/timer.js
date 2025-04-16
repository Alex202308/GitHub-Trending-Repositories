const { fetchTrendingRepos } = require('./services/githubSync');
require('dotenv').config();

let interval = null;

function startSyncTimer() {
    const minutes = parseInt(process.env.SYNC_INTERVAL_MINUTES || '10');
    const ms = minutes * 60 * 1000;

    if (interval) clearInterval(interval); // сбросить если уже был

    fetchTrendingRepos(); // сразу первый запуск
    interval = setInterval(fetchTrendingRepos, ms);

    console.log(`[⏱] Автосинхронизация каждые ${minutes} минут.`);
}

function forceSyncNow() {
    console.log('[🔁] Форс-синхронизация по команде...');
    startSyncTimer(); // перезапуск таймера
}

module.exports = { startSyncTimer, forceSyncNow };
