const fs = require('node:fs');
const path = require('node:path');
const Database = require('better-sqlite3');

function initializeDatabase(databasePath = path.join(process.cwd(), 'data', 'taskflow.db')) {
  const databaseDirectory = path.dirname(databasePath);
  fs.mkdirSync(databaseDirectory, { recursive: true });

  const database = new Database(databasePath);
  database.pragma('journal_mode = WAL');

  database.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      priority TEXT NOT NULL DEFAULT 'media'
        CHECK (priority IN ('baixa', 'media', 'alta')),
      status TEXT NOT NULL DEFAULT 'pendente'
        CHECK (status IN ('pendente', 'em_andamento', 'concluida')),
      created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
    );
  `);

  return database;
}

module.exports = { initializeDatabase };
