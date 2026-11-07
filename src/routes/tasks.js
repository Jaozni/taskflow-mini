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

  router.put('/:id', (req, res) => {
    const task = database.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Tarefa não encontrada' });
    }

    const title = req.body.title ?? task.title;
    const description = req.body.description ?? task.description;
    const priority = req.body.priority ?? task.priority;
    const status = req.body.status ?? task.status;

    database.prepare(
      'UPDATE tasks SET title = ?, description = ?, priority = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    ).run(title, description, priority, status, req.params.id);

    const updatedTask = database.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);

    return res.json(updatedTask);
  });

  return router;
}

module.exports = createTasksRouter;
