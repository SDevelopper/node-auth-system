require('dotenv').config();
const app = require('./src/app');

const PORT = 3000; 

app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
});