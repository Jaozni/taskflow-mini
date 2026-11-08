const { test } = require('node:test');
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const { resolve } = require('node:path');
const request = require('supertest');
const { createDatabase } = require('../src/database');
const { createApp } = require('../src/app');

test('RNF03: texto com aparencia SQL permanece dado literal', async t => {
  const db = createDatabase(':memory:');
  t.after(() => db.close());
  const api = request(createApp(db));
  const title = "X'); DROP TABLE tasks; --";
  const description = "O'Brien; SELECT * FROM tasks;";
  const created = (await api.post('/api/tasks').send({ title, description }).expect(201)).body;
  assert.equal(created.title, title);
  assert.equal(created.description, description);
  await api.get(`/api/tasks/${created.id}`).expect(200, created);
  const changed = (await api.put(`/api/tasks/${created.id}`).send({ title: description, description: title, priority: 'alta' }).expect(200)).body;
  assert.equal(changed.title, description);
  assert.equal(changed.description, title);
  await api.get('/api/tasks').query({ status: "pendente' OR 1=1 --" }).expect(400);
  assert.equal(db.prepare('SELECT COUNT(*) AS total FROM tasks').get().total, 1);
  await api.post('/api/tasks').send({ title: 'Tabela preservada' }).expect(201);
  assert.equal(db.prepare('SELECT COUNT(*) AS total FROM tasks').get().total, 2);
});

test('RNF05: Git nao rastreia dependencias, ambientes privados ou bancos', () => {
  const files = execFileSync('git', ['ls-files', '-z'], {
    cwd: resolve(__dirname, '..'), encoding: 'utf8'
  }).split('\0').filter(Boolean);
  const forbidden = files.filter(path => {
    const base = path.split('/').pop();
    return /(^|\/)(node_modules|data)\//.test(path) ||
      ((base === '.env' || base.startsWith('.env.')) && base !== '.env.example') ||
      /\.(db|sqlite|sqlite3)(-(journal|wal|shm))?$/.test(base);
  });
  assert.deepEqual(forbidden, []);
});
