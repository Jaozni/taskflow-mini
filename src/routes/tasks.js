const express = require('express');

function createTasksRouter(database) {
  const router = express.Router();

  router.post('/', (req, res) => {
    const { title, description = '', priority = 'média', status = 'pendente' } = req.body;

    const result = database.prepare(
      'INSERT INTO tasks (title, description, priority, status) VALUES (?, ?, ?, ?)'
    ).run(title, description, priority, status);

    const task = database.prepare('SELECT * FROM tasks WHERE id = ?').get(result.lastInsertRowid);

    return res.status(201).json(task);
  });

  return router;
}

module.exports = createTasksRouter;
