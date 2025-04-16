const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

const command = process.argv[2];
const param = process.argv[3];

async function main() {
    try {
        if (command === 'list') {
            const res = await axios.get(`${BASE_URL}/repos`);
            res.data.forEach((repo) => {
                console.log(
                    `${repo.id}. ${repo.name} ★${repo.stargazers_count}`
                );
            });
        } else if (command === 'get') {
            if (!param) {
                return console.log('❗ Укажи ID или имя репозитория');
            }
            const res = await axios.get(`${BASE_URL}/repos/${param}`);
            console.log(res.data);
        } else if (command === 'sync') {
            const res = await axios.post(`${BASE_URL}/sync`);
            console.log(res.data.message);
        } else {
            console.log(`
🚀 Использование:
  node cli.js list          — показать все репозитории
  node cli.js get <id|name> — получить репозиторий по ID или имени
  node cli.js sync          — форс-синхронизация с GitHub
`);
        }
    } catch (err) {
        if (err.response) {
            console.error('❌ Ошибка:', err.response.status, err.response.data);
        } else {
            console.error('❌ Ошибка:', err.message);
        }
    }
}

main();
