// Подключаем axios для выполнения HTTP-запросов и репозиторий для работы с базой данных
const axios = require('axios');
const repoRepository = require('./repoRepository');
require('dotenv').config();

// URL GitHub API для поиска репозиториев
const GITHUB_API_URL = 'https://api.github.com/search/repositories';

// Функция для получения даты на неделю назад в нужном формате (yyyy-mm-dd)
function getFormattedDate() {
    const date = new Date();
    date.setDate(date.getDate() - 7); // Устанавливаем дату на 7 дней назад
    return date.toISOString().split('T')[0]; // Возвращаем дату в формате "yyyy-mm-dd"
}

// Функция для выполнения запроса на GitHub для получения репозиториев, созданных после заданной даты
async function getTrendingRepos(sinceDate) {
    const response = await axios.get(GITHUB_API_URL, {
        params: {
            q: `created:>${sinceDate}`, // Фильтруем репозитории, созданные после sinceDate
            sort: 'stars', // Сортировка по количеству звезд
            order: 'desc', // В порядке убывания
            per_page: 10, // Ограничение на 10 репозиториев
        },
        headers: {
            Accept: 'application/vnd.github+json', // Устанавливаем тип ответа GitHub API
            'User-Agent': 'Node.js Trending Service', // Устанавливаем User-Agent для запроса
        },
    });
    return response.data.items; // Возвращаем список репозиториев из ответа
}

// Основная функция синхронизации репозиториев с GitHub
async function fetchTrendingRepos() {
    const formattedDate = getFormattedDate(); // Получаем дату за 7 дней назад

    try {
        // Получаем репозитории, созданные после этой даты
        const repos = await getTrendingRepos(formattedDate);

        // Очищаем таблицу репозиториев перед добавлением новых данных
        await repoRepository.deleteAll();

        // Сохраняем каждый полученный репозиторий в базе данных
        await Promise.all(repos.map((repo) => repoRepository.save(repo)));

        console.log(`[✔] Synced ${repos.length} repositories from GitHub.`); // Логируем количество синхронизированных репозиториев
    } catch (err) {
        console.error('❌ GitHub sync failed:', err.message); // Логируем ошибку, если синхронизация не удалась
    }
}

// Экспортируем функцию синхронизации для использования в других частях приложения
module.exports = { fetchTrendingRepos };
