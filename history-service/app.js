const express = require('express');
const cors = require('cors');

const history = require('./routes/history');

const app = express();
app.use(cors());
app.use(express.json());
const { PORT = 3001 } = process.env;

app.use('/', history);
app.use('*', (req, res, next) => {
  res.status(404).json({ error: 'Некорректный URL' });
  next();
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? `На сервере произошла ошибка: ${err.message}`
        : message,
    });
  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port: ${PORT}`);
});

process.on('uncaughtException', (err, origin) => {
  console.log(`${origin} ${err.name} c текстом ${err.message} не была обработана. Обратите внимание!`);
});
