const { test } = require('node:test');
const assert = require('node:assert/strict');
const { performance } = require('node:perf_hooks');
const { once } = require('node:events');
const { mkdtempSync, rmSync } = require('node:fs');
const os = require('node:os');
const { join } = require('node:path');
const request = require('supertest');
const { createDatabase } = require('../src/database');
const { createApp } = require('../src/app');

test('RNF10: tres medicoes por operacao, ate 100 tarefas', {
  timeout: 120000
}, async (t) => {
  const directory = mkdtempSync(join(os.tmpdir(), 'taskflow-perf-'));
  const db = createDatabase(join(directory, 'tasks.db'));
  const server = createApp(db).listen(0, '127.0.0.1');

  t.after(async () => {
    try {
      await new Promise((resolve, reject) => {
        server.close((error) => error ? reject(error) : resolve());
        server.closeAllConnections();
      });
    } finally {
      db.close();
      rmSync(directory, { recursive: true, force: true });
    }
  });

  await once(server, 'listening');
  const api = request(server);
  const insert = db.prepare('INSERT INTO tasks (title) VALUES (?)');

  for (let i = 1; i <= 97; i += 1) {
    insert.run(`Tarefa ${i}`);
  }

  await api.get('/health').expect(200);

  t.diagnostic(JSON.stringify({
    node: process.version,
    system: `${os.platform()} ${os.release()}`,
    architecture: os.arch(),
    cpu: os.cpus()[0]?.model,
    database: 'SQLite em arquivo temporario',
    concurrency: 1,
    maxTasks: 100,
    limitMs: 2000,
    commit: process.env.GITHUB_SHA || 'consultar git rev-parse HEAD'
  }));

  const operations = [
    ['criar', () =>
      api.post('/api/tasks')
        .send({ title: 'Medicao' }).expect(201)],
    ['listar', () =>
      api.get('/api/tasks').expect(200)],
    ['consultar', () =>
      api.get('/api/tasks/1').expect(200)],
    ['editar', (run) =>
      api.put('/api/tasks/1')
        .send({ title: `Atualizada ${run}`, priority: 'alta' })
        .expect(200)],
    ['status', (run) =>
      api.patch('/api/tasks/1/status')
        .send({
          status: ['em_andamento', 'concluida', 'pendente'][run - 1]
        }).expect(200)],
    ['excluir', (run) =>
      api.delete(`/api/tasks/${run + 1}`).expect(204)]
  ];

  for (const [operation, execute] of operations) {
    for (let run = 1; run <= 3; run += 1) {
      const started = performance.now();
      await execute(run).timeout({ response: 5000, deadline: 10000 });
      const elapsed = performance.now() - started;

      t.diagnostic(JSON.stringify({
        operation,
        run,
        milliseconds: Number(elapsed.toFixed(3))
      }));

      assert.ok(
        elapsed <= 2000,
        `${operation}, medicao ${run}: ${elapsed.toFixed(3)} ms`
      );
    }
  }

  const count = db.prepare('SELECT COUNT(*) AS total FROM tasks').get();
  assert.equal(count.total, 97);
});