const express = require('express');

function createTasksRouter(database) {
  const router = express.Router();

  router.get('/', (req, res) => {
    const tasks = database.prepare('SELECT * FROM tasks ORDER BY created_at DESC').all();

    return res.json(tasks);
  });

  router.get('/:id', (req, res) => {
    const task = database.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Tarefa não encontrada' });
    }

    return res.json(task);
  });

  return router;
}

module.exports = createTasksRouter;
