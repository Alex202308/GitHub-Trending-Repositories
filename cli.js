// Подключаем библиотеку axios для выполнения HTTP-запросов
const axios = require('axios');

// Базовый URL для API нашего сервиса
const BASE_URL = 'http://localhost:3000/api';

// Получаем команду и параметр из аргументов командной строки
const command = process.argv[2];
const param = process.argv[3];

// Основная асинхронная функция для выполнения команд
async function main() {
    try {
        // Если команда 'list', то выводим список всех репозиториев
        if (command === 'list') {
            const res = await axios.get(`${BASE_URL}/repos`); // Отправляем GET-запрос на сервер
            // Перебираем полученные репозитории и выводим их информацию в консоль
            res.data.forEach((repo) => {
                console.log(
                    `#${repo.id} [GH:${repo.github_id}] ${repo.name} ★ ${repo.stargazers_count}`
                );
            });
        }
        // Если команда 'get', то выводим информацию о конкретном репозитории
        else if (command === 'get') {
            // Если параметр не передан, показываем ошибку
            if (!param) {
                return console.log('❗ Укажи ID или имя репозитория');
            }
            // Отправляем GET-запрос на сервер для получения информации о репозитории
            const res = await axios.get(`${BASE_URL}/repos/${param}`);
            // Выводим полученные данные репозитория
            console.log(res.data);
        }
        // Если команда 'sync', то инициируем синхронизацию с GitHub
        else if (command === 'sync') {
            // Отправляем POST-запрос на сервер для начала синхронизации
            const res = await axios.post(`${BASE_URL}/sync`);
            // Выводим сообщение о результате синхронизации
            console.log(res.data.message);
        }
        // Если команда не распознана, выводим подсказку по использованию
        else {
            console.log(`
🚀 Использование:
  node cli.js list          — показать все репозитории
  node cli.js get <id|name> — получить репозиторий по ID или имени
  node cli.js sync          — форс-синхронизация с GitHub
`);
        }
    } catch (err) {
        // Обработка ошибок: если ошибка от сервера, выводим код статуса и сообщение
        if (err.response) {
            console.error('❌ Ошибка:', err.response.status, err.response.data);
        } else {
            // Если ошибка не от сервера, выводим ее сообщение
            console.error('❌ Ошибка:', err.message);
        }
    }
}

// Запуск основной функции
main();
