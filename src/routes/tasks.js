const express = require('express');
const { validateTaskPayload } = require('../validators/taskValidator');

function createTasksRouter(database) {
  const router = express.Router();

  router.post('/', (req, res) => {
    const errors = validateTaskPayload(req.body);

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const { title, description = '', priority = 'média', status = 'pendente' } = req.body;

    const result = database.prepare(
      'INSERT INTO tasks (title, description, priority, status) VALUES (?, ?, ?, ?)'
    ).run(title, description, priority, status);

    const task = database.prepare('SELECT * FROM tasks WHERE id = ?').get(result.lastInsertRowid);

    return res.status(201).json(task);
  });

  router.put('/:id', (req, res) => {
    const errors = validateTaskPayload(req.body);

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const task = database.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Tarefa não encontrada' });
    }

    const title = req.body.title ?? task.title;
    const description = req.body.description ?? task.description;
    const priority = req.body.priority ?? task.priority;
    const status = req.body.status ?? task.status;

    database.prepare(
      'UPDATE tasks SET title = ?, description = ?, priority = ?, status = ? WHERE id = ?'
    ).run(title, description, priority, status, req.params.id);

    const updatedTask = database.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);

    return res.json(updatedTask);
  });

  return router;
}

module.exports = createTasksRouter;
