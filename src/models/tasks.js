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

module.exports = {
  createTask,
  listTasks,
  findTaskById
};
