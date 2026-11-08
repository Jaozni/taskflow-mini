const express = require('express');

function createHealthRouter(database) {
  const router = express.Router();
  router.get('/', (req, res) => {
    try {
      database.prepare('SELECT 1').get();
      return res.json({ status: 'ok' });
    } catch (error) {
      console.error(error);
      return res.status(503).json({ message: 'Banco de dados indisponível' });
    }
  });
  return router;
}

module.exports = createHealthRouter;
