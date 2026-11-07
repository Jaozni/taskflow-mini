const PRIORITIES = ['baixa', 'media', 'alta'];

function validateCreateTask(body) {
  if (body === null || typeof body !== 'object' || Array.isArray(body)) {
    return { isValid: false, message: 'O corpo deve ser um objeto JSON' };
  }

  const allowedFields = ['title', 'description', 'priority'];
  const receivedFields = Object.keys(body);
  const unexpectedField = receivedFields.find((field) => !allowedFields.includes(field));

  if (unexpectedField) {
    return { isValid: false, message: `Campo não permitido: ${unexpectedField}` };
  }

  if (typeof body.title !== 'string' || body.title.trim() === '') {
    return { isValid: false, message: 'O campo title é obrigatório e deve ser um texto não vazio' };
  }

  if (body.description !== undefined && body.description !== null && typeof body.description !== 'string') {
    return { isValid: false, message: 'O campo description deve ser um texto' };
  }

  if (body.description === null) {
    return { isValid: false, message: 'O campo description não pode ser null' };
  }

  if (body.priority !== undefined && !PRIORITIES.includes(body.priority)) {
    return { isValid: false, message: 'O campo priority deve ser baixa, media ou alta' };
  }

  return {
    isValid: true,
    value: {
      title: body.title.trim(),
      description: body.description === undefined ? null : body.description,
      priority: body.priority === undefined ? 'media' : body.priority
    }
  };
}

module.exports = { validateCreateTask };
