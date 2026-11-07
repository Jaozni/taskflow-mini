const { test } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const { mkdtempSync, rmSync } = require('node:fs');
const { tmpdir } = require('node:os');
const { join } = require('node:path');
const { createDatabase } = require('../src/database');
const { createApp } = require('../src/app');

test('API: CRUD, filtros e validações', async (t) => {
  const db = createDatabase(':memory:');
  t.after(() => db.close());
  const api = request(createApp(db));
  await api.get('/health').expect(200, { status: 'ok' });
  await api.get('/api/tasks').expect(200, []);
  const a = (await api.post('/api/tasks').send({ title: '  Tarefa A  ', priority: 'alta' }).expect(201)).body;
  assert.equal(a.title, 'Tarefa A');
  assert.equal(a.description, null);
  assert.equal(a.status, 'pendente');
  assert.match(a.created_at, /Z$/);
  const b = (await api.post('/api/tasks').send({ title: 'Tarefa B' }).expect(201)).body;
  assert.equal(b.priority, 'media');
  const c = (await api.post('/api/tasks').send({ title: "Tarefa ' C", priority: 'alta' }).expect(201)).body;
  await api.patch(`/api/tasks/${c.id}/status`).send({ status: 'concluida' }).expect(200);
  const ids = async (query) => (await api.get('/api/tasks').query(query).expect(200)).body.map((task) => task.id);
  assert.deepEqual(await ids({}), [c.id, b.id, a.id]);
  assert.deepEqual(await ids({ status: 'pendente' }), [b.id, a.id]);
  assert.deepEqual(await ids({ priority: 'alta' }), [c.id, a.id]);
  assert.deepEqual(await ids({ status: 'pendente', priority: 'alta' }), [a.id]);
  assert.deepEqual(await ids({ priority: 'baixa' }), []);
  for (const query of ['status=', 'priority=', 'status=ativo', 'priority=m%C3%A9dia', 'extra=1', 'status=pendente&status=pendente', 'priority=alta&priority=baixa', 'status=x%27%20OR%201%3D1--']) {
    const response = await api.get(`/api/tasks?${query}`).expect(400);
    assert.equal(typeof response.body.message, 'string');
  }
  for (const body of [{}, { title: ' ' }, { title: 'X', status: 'pendente' }, { title: 'X', description: null }, { title: 'X', priority: 'média' }, []]) {
    await api.post('/api/tasks').send(body).expect(400);
  }
  for (const id of ['0', '-1', '1abc', '1.5', '9007199254740992']) {
    await api.get(`/api/tasks/${id}`).expect(400);
  }
  await api.get('/api/tasks/99999').expect(404);
  await api.get(`/api/tasks/${a.id}`).expect(200);
  await api.put(`/api/tasks/${a.id}`).send({ title: 'Atualizada' }).expect(400);
  await api.put(`/api/tasks/${a.id}`).send({ title: 'Atualizada', priority: 'baixa', status: 'concluida' }).expect(400);
  const edited = (await api.put(`/api/tasks/${a.id}`).send({ title: 'Atualizada', priority: 'baixa' }).expect(200)).body;
  assert.equal(edited.status, 'pendente');
  assert.equal(edited.created_at, a.created_at);
  await api.patch(`/api/tasks/${a.id}/status`).send({ status: 'em_andamento' }).expect(200);
  await api.patch(`/api/tasks/${a.id}/status`).send({ status: 'em_andamento' }).expect(200);
  await api.patch(`/api/tasks/${a.id}/status`).send({ status: 'pendente', title: 'X' }).expect(400);
  await api.delete(`/api/tasks/${a.id}`).expect(204, '');
  await api.delete(`/api/tasks/${a.id}`).expect(404);
  await api.get('/inexistente').expect(404);
  await api.post('/api/tasks').set('Content-Type', 'application/json').send('{').expect(400);
  const broken = request(createApp({ prepare() { throw new Error('segredo SQL'); } }));
  const failure = await broken.get('/api/tasks').expect(500);
  assert.deepEqual(failure.body, { message: 'Erro interno do servidor' });
});

test('SQLite preserva dados após reabrir o arquivo', (t) => {
  const directory = mkdtempSync(join(tmpdir(), 'taskflow-'));
  const filename = join(directory, 'nested', 'tasks.db');
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  let db = createDatabase(filename);
  try {
    db.prepare('INSERT INTO tasks (title) VALUES (?)').run('Persistente');
  } finally {
    db.close();
  }
  db = createDatabase(filename);
  try {
    assert.equal(db.prepare('SELECT title FROM tasks').get().title, 'Persistente');
  } finally {
    db.close();
  }
});
