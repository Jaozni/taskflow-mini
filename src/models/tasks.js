function createTask(database, { title, description, priority }) {
  const statement = database.prepare(`
    INSERT INTO tasks (title, description, priority)
    VALUES (?, ?, ?)
  `);

  const result = statement.run(title, description, priority);
  const createdTask = database.prepare(`
    SELECT id, title, description, priority, status, created_at
    FROM tasks
    WHERE id = ?
  `).get(result.lastInsertRowid);

  return createdTask;
}

function listTasks(database, filters = {}) {
  const conditions = [];
  const parameters = [];

  if (filters.status !== undefined) {
    conditions.push('status = ?');
    parameters.push(filters.status);
  }

  if (filters.priority !== undefined) {
    conditions.push('priority = ?');
    parameters.push(filters.priority);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  return database.prepare(`
    SELECT id, title, description, priority, status, created_at
    FROM tasks
    ${whereClause}
    ORDER BY id DESC
  `).all(...parameters);
}

function findTaskById(database, id) {
  return database.prepare(`
    SELECT id, title, description, priority, status, created_at
    FROM tasks
    WHERE id = ?
  `).get(id);
}

function updateTask(database, id, { title, description, priority }) {
  const result = database.prepare(`
    UPDATE tasks
    SET title = ?, description = ?, priority = ?
    WHERE id = ?
  `).run(title, description, priority, id);

  if (result.changes === 0) {
    return null;
  }

  return findTaskById(database, id);
}

function updateTaskStatus(database, id, status) {
  const result = database.prepare(`
    UPDATE tasks
    SET status = ?
    WHERE id = ?
  `).run(status, id);

  if (result.changes === 0) {
    return null;
  }

  return findTaskById(database, id);
}

function deleteTask(database, id) {
  const result = database.prepare(`
    DELETE FROM tasks
    WHERE id = ?
  `).run(id);

  return result.changes > 0;
}

module.exports = {
  createTask,
  listTasks,
  findTaskById,
  updateTask,
  updateTaskStatus,
  deleteTask
};
