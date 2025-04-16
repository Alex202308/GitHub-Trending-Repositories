const axios = require('axios');
const pool = require('../db');
require('dotenv').config();

const GITHUB_API_URL = 'https://api.github.com/search/repositories';

async function fetchTrendingRepos() {
    const date = new Date();
    date.setDate(date.getDate() - 7); // репы за последнюю неделю
    const formattedDate = date.toISOString().split('T')[0];

    try {
        const response = await axios.get(GITHUB_API_URL, {
            params: {
                q: `created:>${formattedDate}`,
                sort: 'stars',
                order: 'desc',
                per_page: 10,
            },
            headers: {
                Accept: 'application/vnd.github+json',
                'User-Agent': 'Node.js Trending Service',
            },
        });

        const repos = response.data.items;

        for (const repo of repos) {
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
                    repo.id,
                    repo.name,
                    repo.full_name,
                    repo.html_url,
                    repo.description,
                    repo.stargazers_count,
                    repo.language,
                    new Date(repo.created_at),
                    new Date(repo.updated_at),
                ]
            );
        }

        console.log(`[✔] Synced ${repos.length} repositories from GitHub.`);
    } catch (err) {
        console.error('❌ GitHub sync failed:', err.message);
    }
}

module.exports = { fetchTrendingRepos };
