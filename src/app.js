const express = require('express');

function createApp() {
  const app = express();

  app.use(express.json());

  app.get('/', (req, res) => {
    return res.json({
      message: 'TaskFlow Mini API'
    });
  });

  app.use((req, res) => {
    return res.status(404).json({ message: 'Rota não encontrada' });
  });

  return app;
}

module.exports = {
  createApp
};
