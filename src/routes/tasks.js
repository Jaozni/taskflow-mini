const express = require('express');

const VALID_STATUSES = ['pendente', 'em progresso', 'concluída'];
const VALID_PRIORITIES = ['baixa', 'média', 'alta'];

function createTasksRouter(database) {
  const router = express.Router();

  router.get('/', (req, res) => {
    const { status, priority } = req.query;
    const conditions = [];
    const values = [];

    if (status !== undefined) {
      if (!VALID_STATUSES.includes(status)) {
        return res.status(400).json({ message: 'Status inválido' });
      }

      conditions.push('status = ?');
      values.push(status);
    }

    if (priority !== undefined) {
      if (!VALID_PRIORITIES.includes(priority)) {
        return res.status(400).json({ message: 'Prioridade inválida' });
      }

      conditions.push('priority = ?');
      values.push(priority);
    }

    let query = 'SELECT * FROM tasks';

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    query += ' ORDER BY created_at DESC';

    const tasks = database.prepare(query).all(...values);

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
