const PRIORITIES = ['baixa', 'média', 'alta'];
const STATUSES = ['pendente', 'em progresso', 'concluída'];

function validateTaskPayload(payload) {
  const errors = [];

  if (typeof payload.title !== 'string' || payload.title.trim() === '') {
    errors.push('O título é obrigatório.');
  }

  if (payload.priority !== undefined && !PRIORITIES.includes(payload.priority)) {
    errors.push('Prioridade inválida.');
  }

  if (payload.status !== undefined && !STATUSES.includes(payload.status)) {
    errors.push('Status inválido.');
  }

  return errors;
}

module.exports = {
  validateTaskPayload
};
