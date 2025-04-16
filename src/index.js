const express = require('express');
const cors = require('cors');
const routes = require('./api/routes');
const { startSyncTimer } = require('./timer');
require('dotenv').config();

const app = express();

app.use(
    cors({
        origin: 'http://localhost:5173',
    })
);

app.use(express.json());
app.use('/api', routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
    startSyncTimer(); // запуск авто-синхронизации
});
