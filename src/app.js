const express = require('express');
const createTasksRouter = require('./routes/tasks');
const createHealthRouter = require('./routes/health');

function createApp(database) {
  const app = express();
  app.use(express.json());
  app.use('/api/tasks', createTasksRouter(database));
  app.use('/health', createHealthRouter(database));
  app.use((req, res) => res.status(404).json({ message: 'Rota não encontrada' }));
  app.use((error, req, res, next) => {
    if (res.headersSent) return next(error);
    if (error.type === 'entity.parse.failed') {
      return res.status(400).json({ message: 'JSON inválido' });
    }
    if (error.type === 'entity.too.large') {
      return res.status(413).json({ message: 'Corpo da requisição muito grande' });
    }
    console.error(error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  });
  return app;
}

module.exports = { createApp };
