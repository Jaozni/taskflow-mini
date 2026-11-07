const express = require('express');
const createTasksRouter = require('./routes/tasks');

function createApp(database) {
  const app = express();

  app.use(express.json());
  app.use('/api/tasks', createTasksRouter(database));

  app.use((req, res) => {
    return res.status(404).json({ message: 'Rota não encontrada' });
  });

  return app;
}

module.exports = {
  createApp
};
