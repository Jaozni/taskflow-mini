const PRIORITIES = ['baixa', 'media', 'alta'];
const STATUSES = ['pendente', 'em_andamento', 'concluida'];
const MAX_SAFE_INTEGER = 9007199254740991;

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

function validateTaskId(value) {
  if (typeof value !== 'string' || !/^\d+$/.test(value)) {
    return { isValid: false, message: 'O campo id deve ser um inteiro positivo' };
  }

  const id = Number(value);

  if (id < 1 || id > MAX_SAFE_INTEGER) {
    return { isValid: false, message: 'O campo id deve ser um inteiro positivo dentro do intervalo seguro' };
  }

  return { isValid: true, value: id };
}

function validateUpdateTask(body) {
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

  if (!PRIORITIES.includes(body.priority)) {
    return { isValid: false, message: 'O campo priority é obrigatório e deve ser baixa, media ou alta' };
  }

  if (body.description !== undefined && body.description !== null && typeof body.description !== 'string') {
    return { isValid: false, message: 'O campo description deve ser um texto' };
  }

  if (body.description === null) {
    return { isValid: false, message: 'O campo description não pode ser null' };
  }

  return {
    isValid: true,
    value: {
      title: body.title.trim(),
      description: body.description === undefined ? null : body.description,
      priority: body.priority
    }
  };
}

function validateStatusUpdate(body) {
  if (body === null || typeof body !== 'object' || Array.isArray(body)) {
    return { isValid: false, message: 'O corpo deve ser um objeto JSON' };
  }

  const receivedFields = Object.keys(body);

  if (receivedFields.length !== 1 || receivedFields[0] !== 'status') {
    return { isValid: false, message: 'O corpo deve conter somente o campo status' };
  }

  if (!STATUSES.includes(body.status)) {
    return { isValid: false, message: 'O campo status deve ser pendente, em_andamento ou concluida' };
  }

  return { isValid: true, value: { status: body.status } };
}

module.exports = {
  validateCreateTask,
  validateTaskId,
  validateUpdateTask,
  validateStatusUpdate
};
