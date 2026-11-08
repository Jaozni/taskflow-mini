const { test } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const { createDatabase } = require('../src/database');
const { createApp } = require('../src/app');
const { loadEnvironment } = require('../src/config/env');

function setup(t) {
  const db = createDatabase(':memory:');
  t.after(() => db.close());
  return { db, api: request(createApp(db)) };
}
const snapshot = (db) => db.prepare('SELECT * FROM tasks ORDER BY id').all();
const fields = ['created_at', 'description', 'id', 'priority', 'status', 'title'];

test('cadastro invalido nao insere registros e respostas possuem contrato completo', async (t) => {
  const { db, api } = setup(t);
  for (const body of [{}, { title: null }, { title: 1 }, { title: '' }, { title: ' ' }, { title: 'X', description: 1 }, { title: 'X', description: null }, { title: 'X', priority: null }, { title: 'X', priority: 'urgente' }, { title: 'X', id: 1 }, [], null, true, 'texto']) {
    const before = snapshot(db);
    await api.post('/api/tasks').set('Content-Type', 'application/json').send(JSON.stringify(body)).expect(400);
    assert.deepEqual(snapshot(db), before);
  }
  const created = (await api.post('/api/tasks').send({ title: '  Teste  ', description: '' }).expect(201)).body;
  assert.deepEqual(Object.keys(created).sort(), fields);
  assert.equal(created.title, 'Teste');
  assert.equal(created.description, '');
  const before = snapshot(db);
  const listing = await api.get('/api/tasks').expect('Content-Type', /json/).expect(200);
  assert.deepEqual(Object.keys(listing.body[0]).sort(), fields);
  await api.get(`/api/tasks/${created.id}`).expect(200, created);
  assert.deepEqual(snapshot(db), before);
});

test('edicao substitui descricao, preserva campos e eh idempotente', async (t) => {
  const { db, api } = setup(t);
  const task = (await api.post('/api/tasks').send({ title: 'A', description: 'Antiga' }).expect(201)).body;
  const payload = { title: '  Nova  ', priority: 'alta' };
  const first = (await api.put(`/api/tasks/${task.id}`).send(payload).expect(200)).body;
  assert.deepEqual(first, { ...task, title: 'Nova', description: null, priority: 'alta' });
  await api.put(`/api/tasks/${task.id}`).send(payload).expect(200, first);
  for (const body of [{}, { title: 'X' }, { title: 'X', priority: 'alta', status: 'concluida' }, { title: 'X', priority: 'alta', description: null }, [], null]) {
    const before = snapshot(db);
    await api.put(`/api/tasks/${task.id}`).set('Content-Type', 'application/json').send(JSON.stringify(body)).expect(400);
    assert.deepEqual(snapshot(db), before);
  }
  await api.put('/api/tasks/9999').send({ title: 'X', priority: 'alta' }).expect(404);
});

test('status suporta conclusao, reabertura e nao altera outros campos', async (t) => {
  const { db, api } = setup(t);
  const task = (await api.post('/api/tasks').send({ title: 'A', description: 'Descricao', priority: 'baixa' }).expect(201)).body;
  for (const status of ['em_andamento', 'concluida', 'pendente', 'pendente']) {
    await api.patch(`/api/tasks/${task.id}/status`).send({ status }).expect(200, { ...task, status });
  }
  for (const body of [{}, { status: null }, { status: 1 }, { status: 'ativo' }, { status: 'pendente', title: 'X' }, [], null]) {
    const before = snapshot(db);
    await api.patch(`/api/tasks/${task.id}/status`).set('Content-Type', 'application/json').send(JSON.stringify(body)).expect(400);
    assert.deepEqual(snapshot(db), before);
  }
  await api.patch('/api/tasks/9999/status').send({ status: 'pendente' }).expect(404);
});

test('exclusao por status preserva demais tarefas; IDs invalidos nao alteram dados', async (t) => {
  const { db, api } = setup(t);
  const keep = (await api.post('/api/tasks').send({ title: 'Manter' }).expect(201)).body;
  for (const status of ['pendente', 'em_andamento', 'concluida']) {
    const task = (await api.post('/api/tasks').send({ title: status }).expect(201)).body;
    await api.patch(`/api/tasks/${task.id}/status`).send({ status }).expect(200);
    await api.delete(`/api/tasks/${task.id}`).expect(204, '');
    await api.get(`/api/tasks/${task.id}`).expect(404);
    await api.delete(`/api/tasks/${task.id}`).expect(404);
    assert.deepEqual(snapshot(db), [keep]);
  }
  for (const id of ['0', '-1', '1abc', '1.5', '9007199254740992']) {
    const before = snapshot(db);
    await api.put(`/api/tasks/${id}`).send({ title: 'X', priority: 'alta' }).expect(400);
    await api.patch(`/api/tasks/${id}/status`).send({ status: 'pendente' }).expect(400);
    await api.delete(`/api/tasks/${id}`).expect(400);
    assert.deepEqual(snapshot(db), before);
  }
  await api.put('/api/tasks/0').send({}).expect(400);
});

test('falhas internas das operacoes nao expoem detalhes', async () => {
  const api = request(createApp({ prepare() { throw new Error('SQL segredo /caminho/privado'); } }));
  const cases = [
    () => api.post('/api/tasks').send({ title: 'X' }),
    () => api.get('/api/tasks'),
    () => api.get('/api/tasks/1'),
    () => api.put('/api/tasks/1').send({ title: 'X', priority: 'alta' }),
    () => api.patch('/api/tasks/1/status').send({ status: 'pendente' }),
    () => api.delete('/api/tasks/1')
  ];
  for (const operation of cases) {
    await operation().expect(500, { message: 'Erro interno do servidor' });
  }
  await api.get('/health').expect(503, { message: 'Banco de dados indisponível' });
});

test('restricoes SQLite e configuracao de ambiente', (t) => {
  const { db } = setup(t);
  for (const title of [null, '', '   ']) {
    assert.throws(() => db.prepare('INSERT INTO tasks (title) VALUES (?)').run(title));
  }
  assert.throws(() => db.prepare('INSERT INTO tasks (title, priority) VALUES (?, ?)').run('X', 'urgente'));
  assert.throws(() => db.prepare('INSERT INTO tasks (title, status) VALUES (?, ?)').run('X', 'ativo'));
  assert.deepEqual(loadEnvironment({}), { port: 3000, databasePath: './data/tasks.db' });
  assert.deepEqual(loadEnvironment({ PORT: '4321', DATABASE_PATH: ':memory:' }), { port: 4321, databasePath: ':memory:' });
  for (const PORT of ['0', '-1', '65536', 'abc', '1.5']) assert.throws(() => loadEnvironment({ PORT }));
});
