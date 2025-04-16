import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [repos, setRepos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedRepoId, setSelectedRepoId] = useState(null);
    const [repoDetails, setRepoDetails] = useState({});
    const [error, setError] = useState(null);

    const fetchRepos = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get('http://localhost:3000/api/repos');
            setRepos(res.data);
        } catch (err) {
            setError(
                'Ошибка загрузки репозиториев. Пожалуйста, попробуйте позже.'
            );
            console.error('Ошибка загрузки:', err);
        }
        setLoading(false);
    };

    const triggerSync = async () => {
        try {
            await axios.post('http://localhost:3000/api/sync');
            await fetchRepos();
        } catch (err) {
            setError('Ошибка синхронизации. Пожалуйста, попробуйте снова.');
            console.error('Ошибка синхронизации:', err);
        }
    };

    const toggleRepoDetails = async (id) => {
        if (selectedRepoId === id) {
            // Если снова нажали — скрываем
            setSelectedRepoId(null);
            return;
        }

        setSelectedRepoId(id);

        // Загружаем только если ещё не загружен
        if (!repoDetails[id]) {
            try {
                const res = await axios.get(
                    `http://localhost:3000/api/repos/${id}`
                );
                setRepoDetails((prev) => ({ ...prev, [id]: res.data }));
            } catch (err) {
                setError('Ошибка загрузки данных репозитория.');
                console.error('Ошибка загрузки репозитория:', err);
            }
        }
    };

    useEffect(() => {
        fetchRepos();
    }, []);

    return (
        <div className="container">
            <h1>🔥 GitHub Trending Repos</h1>
            <button onClick={triggerSync}>🔄 Синхронизировать</button>

            {loading ? (
                <p>Загрузка...</p>
            ) : error ? (
                <p style={{ color: 'red' }}>{error}</p>
            ) : (
                <ul>
                    {repos.map((repo) => (
                        <li key={repo.id}>
                            <div
                                style={{ cursor: 'pointer' }}
                                onClick={() => toggleRepoDetails(repo.id)}
                            >
                                <strong>{repo.full_name}</strong> ⭐{' '}
                                {repo.stargazers_count}
                            </div>

                            {selectedRepoId === repo.id &&
                                repoDetails[repo.id] && (
                                    <div className="repo-details">
                                        <p>
                                            {repoDetails[repo.id]
                                                .description ? (
                                                repoDetails[repo.id].description
                                            ) : (
                                                <em>Нет описания 😔</em>
                                            )}
                                        </p>
                                        <p>
                                            ⭐{' '}
                                            {
                                                repoDetails[repo.id]
                                                    .stargazers_count
                                            }
                                        </p>
                                        <a
                                            href={repoDetails[repo.id].html_url}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            Открыть на GitHub
                                        </a>
                                    </div>
                                )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default App;
