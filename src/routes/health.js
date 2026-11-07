const express = require('express');

function createHealthRouter(database) {
  const router = express.Router();

  router.get('/', (req, res) => {
    try {
      database.prepare('SELECT 1').get();

      return res.status(200).json({
        status: 'ok',
        database: 'ok'
      });
    } catch (error) {
      console.error(error);

      return res.status(503).json({
        status: 'error',
        database: 'error'
      });
    }
  });

  return router;
}

module.exports = createHealthRouter;
