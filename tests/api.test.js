const request = require('supertest');
const { createApp } = require('../src/app');
const { createDatabase } = require('../src/database');

let app;
let database;

beforeEach(() => {
  database = createDatabase(':memory:');
  app = createApp(database);
});

afterEach(() => {
  database.close();
});

describe('POST /api/tasks', () => {
  it('cria uma tarefa com prioridade padrão', async () => {
    const response = await request(app)
      .post('/api/tasks')
      .send({ title: 'Estudar Node.js' });

    expect(response.status).toBe(201);
    expect(response.body.title).toBe('Estudar Node.js');
    expect(response.body.priority).toBe('media');
    expect(response.body.status).toBe('pendente');
  });

  it('cria uma tarefa com prioridade informada', async () => {
    const response = await request(app)
      .post('/api/tasks')
      .send({ title: 'Tarefa urgente', priority: 'alta' });

    expect(response.status).toBe(201);
    expect(response.body.priority).toBe('alta');
  });

  it('retorna 400 para título ausente', async () => {
    const response = await request(app)
      .post('/api/tasks')
      .send({});

    expect(response.status).toBe(400);
  });

  it('retorna 400 para prioridade inválida', async () => {
    const response = await request(app)
      .post('/api/tasks')
      .send({ title: 'Tarefa', priority: 'urgente' });

    expect(response.status).toBe(400);
  });
});

describe('GET /api/tasks', () => {
  it('retorna lista vazia quando não há tarefas', async () => {
    const response = await request(app).get('/api/tasks');

    expect(response.status).toBe(200);
    expect(response.body.data).toEqual([]);
    expect(response.body.pagination.total).toBe(0);
  });

  it('filtra por status', async () => {
    await request(app).post('/api/tasks').send({ title: 'Tarefa pendente' });

    const response = await request(app).get('/api/tasks?status=pendente');

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(1);
  });

  it('filtra por prioridade', async () => {
    await request(app).post('/api/tasks').send({ title: 'Tarefa alta', priority: 'alta' });

    const response = await request(app).get('/api/tasks?priority=alta');

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(1);
  });

  it('combina filtros de status e prioridade', async () => {
    await request(app).post('/api/tasks').send({ title: 'Tarefa alta', priority: 'alta' });
    await request(app).post('/api/tasks').send({ title: 'Tarefa baixa', priority: 'baixa' });

    const response = await request(app).get('/api/tasks?status=pendente&priority=alta');

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0].priority).toBe('alta');
  });

  it('retorna 400 para status inválido', async () => {
    const response = await request(app).get('/api/tasks?status=invalido');

    expect(response.status).toBe(400);
  });

  it('retorna 400 para prioridade inválida', async () => {
    const response = await request(app).get('/api/tasks?priority=invalida');

    expect(response.status).toBe(400);
  });

  it('retorna 400 para parâmetro desconhecido', async () => {
    const response = await request(app).get('/api/tasks?unknown=1');

    expect(response.status).toBe(400);
  });

  it('retorna 400 para parâmetro repetido', async () => {
    const response = await request(app).get('/api/tasks?status=pendente&status=concluida');

    expect(response.status).toBe(400);
  });
});

describe('GET /api/tasks?q=', () => {
  it('busca por título', async () => {
    await request(app).post('/api/tasks').send({ title: 'Estudar Node.js' });

    const response = await request(app).get('/api/tasks?q=estudo');

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(1);
  });

  it('busca por descrição', async () => {
    await request(app).post('/api/tasks').send({
      title: 'Tarefa',
      description: 'Revisar Express'
    });

    const response = await request(app).get('/api/tasks?q=express');

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(1);
  });

  it('retorna 400 para busca vazia', async () => {
    const response = await request(app).get('/api/tasks?q=');

    expect(response.status).toBe(400);
  });
});

describe('GET /api/tasks?page=&limit=', () => {
  it('pagina os resultados', async () => {
    for (let index = 1; index <= 15; index += 1) {
      await request(app).post('/api/tasks').send({ title: `Tarefa ${index}` });
    }

    const firstPage = await request(app).get('/api/tasks?page=1&limit=10');
    const secondPage = await request(app).get('/api/tasks?page=2&limit=10');

    expect(firstPage.status).toBe(200);
    expect(firstPage.body.data).toHaveLength(10);
    expect(secondPage.status).toBe(200);
    expect(secondPage.body.data).toHaveLength(5);
    expect(secondPage.body.pagination.page).toBe(2);
  });

  it('retorna 400 para limit acima do máximo', async () => {
    const response = await request(app).get('/api/tasks?limit=101');

    expect(response.status).toBe(400);
  });
});

describe('GET /api/tasks?sort_by=&order=', () => {
  it('ordena por prioridade crescente', async () => {
    await request(app).post('/api/tasks').send({ title: 'Alta', priority: 'alta' });
    await request(app).post('/api/tasks').send({ title: 'Baixa', priority: 'baixa' });

    const response = await request(app).get('/api/tasks?sort_by=priority&order=asc');

    expect(response.status).toBe(200);
    expect(response.body.data[0].priority).toBe('baixa');
  });

  it('retorna 400 para campo de ordenação inválido', async () => {
    const response = await request(app).get('/api/tasks?sort_by=invalido');

    expect(response.status).toBe(400);
  });

  it('retorna 400 para direção inválida', async () => {
    const response = await request(app).get('/api/tasks?order=invalido');

    expect(response.status).toBe(400);
  });
});

describe('GET /api/tasks/:id', () => {
  it('retorna uma tarefa existente', async () => {
    const created = await request(app).post('/api/tasks').send({ title: 'Tarefa' });

    const response = await request(app).get(`/api/tasks/${created.body.id}`);

    expect(response.status).toBe(200);
    expect(response.body.title).toBe('Tarefa');
  });

  it('retorna 404 para tarefa inexistente', async () => {
    const response = await request(app).get('/api/tasks/999');

    expect(response.status).toBe(404);
  });

  it('retorna 400 para ID inválido', async () => {
    const response = await request(app).get('/api/tasks/abc');

    expect(response.status).toBe(400);
  });
});

describe('PUT /api/tasks/:id', () => {
  it('atualiza uma tarefa existente', async () => {
    const created = await request(app).post('/api/tasks').send({ title: 'Tarefa' });

    const response = await request(app)
      .put(`/api/tasks/${created.body.id}`)
      .send({ title: 'Tarefa atualizada', description: '', priority: 'alta' });

    expect(response.status).toBe(200);
    expect(response.body.title).toBe('Tarefa atualizada');
    expect(response.body.priority).toBe('alta');
  });

  it('retorna 404 para tarefa inexistente', async () => {
    const response = await request(app)
      .put('/api/tasks/999')
      .send({ title: 'Tarefa', priority: 'alta' });

    expect(response.status).toBe(404);
  });
});

describe('PATCH /api/tasks/:id/status', () => {
  it('atualiza o status de uma tarefa', async () => {
    const created = await request(app).post('/api/tasks').send({ title: 'Tarefa' });

    const response = await request(app)
      .patch(`/api/tasks/${created.body.id}/status`)
      .send({ status: 'concluida' });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('concluida');
  });

  it('retorna 400 para status inválido', async () => {
    const created = await request(app).post('/api/tasks').send({ title: 'Tarefa' });

    const response = await request(app)
      .patch(`/api/tasks/${created.body.id}/status`)
      .send({ status: 'invalido' });

    expect(response.status).toBe(400);
  });
});

describe('DELETE /api/tasks/:id', () => {
  it('remove uma tarefa existente', async () => {
    const created = await request(app).post('/api/tasks').send({ title: 'Tarefa' });

    const response = await request(app).delete(`/api/tasks/${created.body.id}`);

    expect(response.status).toBe(204);
    expect(response.body).toEqual({});
  });

  it('retorna 404 ao remover novamente', async () => {
    const created = await request(app).post('/api/tasks').send({ title: 'Tarefa' });

    await request(app).delete(`/api/tasks/${created.body.id}`);
    const response = await request(app).delete(`/api/tasks/${created.body.id}`);

    expect(response.status).toBe(404);
  });
});

describe('GET /api/tasks/stats', () => {
  it('retorna estatísticas das tarefas', async () => {
    await request(app).post('/api/tasks').send({ title: 'Tarefa alta', priority: 'alta' });
    await request(app).post('/api/tasks').send({ title: 'Tarefa baixa', priority: 'baixa' });

    const response = await request(app).get('/api/tasks/stats');

    expect(response.status).toBe(200);
    expect(response.body.total).toBe(2);
    expect(response.body.byStatus).toHaveLength(1);
    expect(response.body.byPriority).toHaveLength(2);
  });
});
