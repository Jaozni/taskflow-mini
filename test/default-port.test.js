const { test } = require('node:test');
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const { once } = require('node:events');
const { resolve } = require('node:path');

test('RNF09: sem PORT servidor real utiliza 3000', { timeout: 20000 }, async t => {
  const env = { ...process.env, DATABASE_PATH: ':memory:' };
  delete env.PORT;
  const child = spawn(process.execPath, [resolve(__dirname, '../src/server.js')], {
    env, stdio: ['ignore', 'pipe', 'pipe']
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
  });

  const deadline = Date.now() + 10000;
  while (!output.includes('Servidor executando na porta 3000') &&
         child.exitCode === null && Date.now() < deadline) {
    await new Promise(resolve => setTimeout(resolve, 50));
  }

  assert.match(output, /Servidor executando na porta 3000/);
  assert.equal(child.exitCode, null, output);
  const response = await fetch('http://127.0.0.1:3000/health', {
    signal: AbortSignal.timeout(2000)
  });
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { status: 'ok' });
});
