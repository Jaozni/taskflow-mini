const Database = require('better-sqlite3');
const { mkdirSync } = require('node:fs');
const { dirname, resolve } = require('node:path');

function createDatabase(filename = './data/tasks.db') {
  if (filename !== ':memory:') mkdirSync(dirname(resolve(filename)), { recursive: true });
  const database = new Database(filename);
  try {
    database.exec(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL CHECK (length(trim(title)) > 0),
        description TEXT,
        priority TEXT NOT NULL DEFAULT 'media' CHECK (priority IN ('baixa', 'media', 'alta')),
        status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'em_andamento', 'concluida')),
        created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
      );
    `);
    return database;
  } catch (error) {
    database.close();
    throw error;
  }
}

module.exports = { createDatabase };
