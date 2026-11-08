const { test } = require('node:test');
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const { once } = require('node:events');
const { createServer } = require('node:net');
const { mkdtempSync, rmSync, writeFileSync } = require('node:fs');
const { tmpdir } = require('node:os');
const { join, resolve } = require('node:path');

async function freePort() {
  const server = createServer();
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const port = server.address().port;
  await new Promise((resolve, reject) => server.close(e => e ? reject(e) : resolve()));
  return port;
}

function launch(t, port, databasePath, directory) {
  const child = spawn(process.execPath, [resolve(__dirname, '../src/server.js')], {
    env: { ...process.env, PORT: port, DATABASE_PATH: databasePath },
    stdio: ['ignore', 'pipe', 'pipe']
  });
  let output = '';
  child.stdout.on('data', chunk => { output += chunk; });
  child.stderr.on('data', chunk => { output += chunk; });
  const closed = once(child, 'close');
  const timer = setTimeout(() => child.kill(), 12000);
  t.after(async () => {
    clearTimeout(timer);
    if (child.exitCode === null && child.signalCode === null) child.kill();
    await closed;
    if (directory) rmSync(directory, { recursive: true, force: true });
  });
  return { child, closed, output: () => output };
}

test('servidor real usa PORT e banco em arquivo', { timeout: 20000 }, async t => {
  const directory = mkdtempSync(join(tmpdir(), 'taskflow-start-'));
  const port = await freePort();
  const processInfo = launch(t, String(port), join(directory, 'tasks.db'), directory);
  const deadline = Date.now() + 10000;
  let ready = false;
  while (Date.now() < deadline && processInfo.child.exitCode === null) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/health`, { signal: AbortSignal.timeout(500) });
      await response.text();
      if (response.status === 200) { ready = true; break; }
    } catch {}
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  assert.ok(ready, processInfo.output());
  assert.match(processInfo.output(), new RegExp(`porta ${port}`));
});

test('PORT invalida impede inicializacao real', { timeout: 80000 }, async t => {
  for (const port of ['0', '-1', '65536', 'abc', '1.5']) {
    const processInfo = launch(t, port, ':memory:');
    const [code, signal] = await processInfo.closed;
    assert.equal(signal, null, processInfo.output());
    assert.notEqual(code, 0);
    assert.match(processInfo.output(), /PORT/);
  }
});

test('falha SQLite impede servidor de anunciar inicializacao', { timeout: 20000 }, async t => {
  const directory = mkdtempSync(join(tmpdir(), 'taskflow-fail-'));
  const blocker = join(directory, 'arquivo');
  writeFileSync(blocker, 'nao e diretorio');
  const processInfo = launch(t, '3000', join(blocker, 'tasks.db'), directory);
  const [code, signal] = await processInfo.closed;
  assert.equal(signal, null);
  assert.notEqual(code, 0);
  assert.doesNotMatch(processInfo.output(), /Servidor executando/);
});
