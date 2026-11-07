const express = require('express');

const VALID_STATUSES = ['pendente', 'em progresso', 'concluída'];

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

  router.patch('/:id/status', (req, res) => {
    const task = database.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Tarefa não encontrada' });
    }

    const { status } = req.body;

    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ message: 'Status inválido' });
    }

    database.prepare(
      'UPDATE tasks SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    ).run(status, req.params.id);

    const updatedTask = database.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);

    return res.json(updatedTask);
  });

  return router;
}

module.exports = createTasksRouter;
