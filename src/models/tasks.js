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

function listTasks(database) {
  return database.prepare(`
    SELECT id, title, description, priority, status, created_at
    FROM tasks
    ORDER BY id DESC
  `).all();
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

module.exports = {
  createTask,
  listTasks,
  findTaskById,
  updateTask,
  updateTaskStatus
};
