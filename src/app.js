const express = require('express');
const tasksRouter = require('./routes/tasks');

function createApp() {
  const app = express();

  app.use(express.json({
    strict: true,
    type: 'application/json'
  }));

  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  app.use('/api/tasks', tasksRouter);

  app.use((req, res) => {
    res.status(404).json({ message: 'Rota não encontrada' });
  });

  app.use((error, req, res, next) => {
    if (error.type === 'entity.parse.failed') {
      return res.status(400).json({ message: 'Corpo JSON malformado' });
    }

    console.error(error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  });

  return app;
}

module.exports = createApp;
