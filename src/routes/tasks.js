const express = require('express');
const { validateTaskPayload } = require('../validators/taskValidator');

const PRIORITIES = ['baixa', 'média', 'alta'];
const STATUSES = ['pendente', 'em progresso', 'concluída'];

function createTasksRouter(database) {
  const router = express.Router();

  router.post('/', (req, res) => {
    const errors = validateTaskPayload(req.body);
    if (errors.length > 0) return res.status(400).json({ errors });
    const { title, description = '', priority = 'média', status = 'pendente' } = req.body;
    const result = database.prepare(
      'INSERT INTO tasks (title, description, priority, status) VALUES (?, ?, ?, ?)'
    ).run(title, description, priority, status);
    const task = database.prepare('SELECT * FROM tasks WHERE id = ?').get(result.lastInsertRowid);
    return res.status(201).json(task);
  });

  router.get('/', (req, res) => {
    const unexpected = Object.keys(req.query).find((key) => !['status', 'priority'].includes(key));
    if (unexpected) return res.status(400).json({ message: `Parâmetro não permitido: ${unexpected}` });
    const { status, priority } = req.query;
    if (status !== undefined && (typeof status !== 'string' || !STATUSES.includes(status))) {
      return res.status(400).json({ message: 'Status inválido' });
    }
    if (priority !== undefined && (typeof priority !== 'string' || !PRIORITIES.includes(priority))) {
      return res.status(400).json({ message: 'Prioridade inválida' });
    }
    const conditions = [];
    const values = [];
    if (status !== undefined) {
      conditions.push('status = ?');
      values.push(status);
    }
    if (priority !== undefined) {
      conditions.push('priority = ?');
      values.push(priority);
    }
    const where = conditions.length ? ` WHERE ${conditions.join(' AND ')}` : '';
    const tasks = database.prepare(`SELECT * FROM tasks${where} ORDER BY id DESC`).all(...values);
    return res.json(tasks);
  });

  router.get('/:id', (req, res) => {
    const task = database.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
    if (!task) return res.status(404).json({ message: 'Tarefa não encontrada' });
    return res.json(task);
  });

  router.put('/:id', (req, res) => {
    const errors = validateTaskPayload(req.body);
    if (errors.length > 0) return res.status(400).json({ errors });
    const task = database.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
    if (!task) return res.status(404).json({ message: 'Tarefa não encontrada' });
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

  router.patch('/:id/status', (req, res) => {
    const body = req.body;
    if (!body || typeof body !== 'object' || Array.isArray(body) ||
        Object.keys(body).length !== 1 || !Object.prototype.hasOwnProperty.call(body, 'status') ||
        !STATUSES.includes(body.status)) {
      return res.status(400).json({ message: 'Informe somente status: pendente, em progresso ou concluída' });
    }
    const result = database.prepare('UPDATE tasks SET status = ? WHERE id = ?').run(body.status, req.params.id);
    if (result.changes === 0) return res.status(404).json({ message: 'Tarefa não encontrada' });
    const task = database.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
    return res.json(task);
  });

  router.delete('/:id', (req, res) => {
    const result = database.prepare('DELETE FROM tasks WHERE id = ?').run(req.params.id);
    if (result.changes === 0) return res.status(404).json({ message: 'Tarefa não encontrada' });
    return res.status(204).send();
  });

  return router;
}

module.exports = createTasksRouter;
