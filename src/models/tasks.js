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

function buildFilters(filters = {}) {
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

  return { whereClause, parameters };
}

function listTasks(database, filters = {}, pagination = {}) {
  const page = pagination.page || 1;
  const limit = pagination.limit || 10;
  const offset = (page - 1) * limit;
  const { whereClause, parameters } = buildFilters(filters);

  const total = database.prepare(`
    SELECT COUNT(*) AS total
    FROM tasks
    ${whereClause}
  `).get(...parameters).total;

  const data = database.prepare(`
    SELECT id, title, description, priority, status, created_at
    FROM tasks
    ${whereClause}
    ORDER BY id DESC
    LIMIT ? OFFSET ?
  `).all(...parameters, limit, offset);

  const totalPages = Math.ceil(total / limit);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1
    }
  };
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
