// Импортируем необходимые библиотеки и стили
import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    // Состояния для репозиториев, загрузки, выбранного репозитория и ошибок
    const [repos, setRepos] = useState([]); // Список репозиториев
    const [loading, setLoading] = useState(false); // Статус загрузки
    const [selectedRepoId, setSelectedRepoId] = useState(null); // ID выбранного репозитория
    const [repoDetails, setRepoDetails] = useState({}); // Данные о репозитории
    const [error, setError] = useState(null); // Ошибки, если они возникли

    // Функция для загрузки всех репозиториев с сервера
    const fetchRepos = async () => {
        setLoading(true); // Устанавливаем состояние загрузки в true
        setError(null); // Сбрасываем ошибку перед новой загрузкой
        try {
            // Запрос на сервер для получения репозиториев
            const res = await axios.get('http://localhost:3000/api/repos');
            setRepos(res.data); // Сохраняем полученные данные в состояние
        } catch (err) {
            // Если ошибка, устанавливаем сообщение об ошибке
            setError(
                'Ошибка загрузки репозиторов. Пожалуйста, попробуйте позже.'
            );
            console.error('Ошибка загрузки:', err); // Логируем ошибку
        }
        setLoading(false); // Останавливаем состояние загрузки
    };

    // Функция для запуска синхронизации с сервером
    const triggerSync = async () => {
        try {
            // Отправляем запрос на сервер для синхронизации
            await axios.post('http://localhost:3000/api/sync');
            await fetchRepos(); // После синхронизации повторно загружаем репозитории
        } catch (err) {
            // Если ошибка при синхронизации, выводим сообщение об ошибке
            setError('Ошибка синхронизации. Пожалуйста, попробуйте снова.');
            console.error('Ошибка синхронизации:', err); // Логируем ошибку
        }
    };

    // Функция для отображения/скрытия деталей репозитория
    const toggleRepoDetails = async (id) => {
        if (selectedRepoId === id) {
            // Если выбран тот же репозиторий, что и был ранее — скрываем его
            setSelectedRepoId(null);
            return;
        }

        setSelectedRepoId(id); // Устанавливаем новый выбранный репозиторий

        // Загружаем данные репозитория только если они еще не загружены
        if (!repoDetails[id]) {
            try {
                // Запрашиваем подробности репозитория по ID
                const res = await axios.get(
                    `http://localhost:3000/api/repos/${id}`
                );
                // Сохраняем данные о репозитории в состояние
                setRepoDetails((prev) => ({ ...prev, [id]: res.data }));
            } catch (err) {
                // Если ошибка при загрузке данных, выводим сообщение об ошибке
                setError('Ошибка загрузки данных репозитория.');
                console.error('Ошибка загрузки репозитория:', err); // Логируем ошибку
            }
        }
    };

    // Используем useEffect для загрузки репозиториев при первом рендере
    useEffect(() => {
        fetchRepos();
    }, []); // Пустой массив зависимостей означает, что эффект сработает только один раз

    return (
        <div className="container">
            <h1>🔥 GitHub Trending Repos</h1>
            <button onClick={triggerSync}>🔄 Синхронизировать</button>

            {/* Если идет загрузка, показываем индикатор */}
            {loading ? (
                <p>Загрузка...</p>
            ) : error ? (
                // Если ошибка, показываем сообщение об ошибке
                <p style={{ color: 'red' }}>{error}</p>
            ) : (
                // Отображаем список репозиториев, если загрузка завершена
                <ul>
                    {repos.map((repo) => (
                        <li key={repo.id}>
                            <div
                                style={{ cursor: 'pointer' }}
                                onClick={() => toggleRepoDetails(repo.id)} // Обработчик клика на репозиторий
                            >
                                <strong>{repo.full_name}</strong> ⭐{' '}
                                {repo.stargazers_count}
                            </div>

                            {/* Если выбран этот репозиторий, показываем его детали */}
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
