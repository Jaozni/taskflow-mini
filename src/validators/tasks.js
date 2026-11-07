const PRIORITIES = ['baixa', 'media', 'alta'];
const STATUSES = ['pendente', 'em_andamento', 'concluida'];
const MAX_SAFE_INTEGER = 9007199254740991;
const MAX_LIMIT = 100;

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

function validateTaskFilters(query) {
  const allowedFields = ['status', 'priority'];
  const receivedFields = Object.keys(query);
  const unexpectedField = receivedFields.find((field) => !allowedFields.includes(field));

  if (unexpectedField) {
    return { isValid: false, message: `Parâmetro não permitido: ${unexpectedField}` };
  }

  if (Array.isArray(query.status) || Array.isArray(query.priority)) {
    return { isValid: false, message: 'Parâmetros repetidos não são permitidos' };
  }

  if (query.status !== undefined && query.status === '') {
    return { isValid: false, message: 'O parâmetro status não pode estar vazio' };
  }

  if (query.priority !== undefined && query.priority === '') {
    return { isValid: false, message: 'O parâmetro priority não pode estar vazio' };
  }

  if (query.status !== undefined && !STATUSES.includes(query.status)) {
    return { isValid: false, message: 'O parâmetro status deve ser pendente, em_andamento ou concluida' };
  }

  if (query.priority !== undefined && !PRIORITIES.includes(query.priority)) {
    return { isValid: false, message: 'O parâmetro priority deve ser baixa, media ou alta' };
  }

  return {
    isValid: true,
    value: {
      status: query.status,
      priority: query.priority
    }
  };
}

function validatePagination(query) {
  const allowedFields = ['page', 'limit'];
  const receivedFields = Object.keys(query);
  const unexpectedField = receivedFields.find((field) => !allowedFields.includes(field));

  if (unexpectedField) {
    return { isValid: false, message: `Parâmetro não permitido: ${unexpectedField}` };
  }

  if (Array.isArray(query.page) || Array.isArray(query.limit)) {
    return { isValid: false, message: 'Parâmetros repetidos não são permitidos' };
  }

  if (query.page !== undefined && query.page === '') {
    return { isValid: false, message: 'O parâmetro page não pode estar vazio' };
  }

  if (query.limit !== undefined && query.limit === '') {
    return { isValid: false, message: 'O parâmetro limit não pode estar vazio' };
  }

  if (query.page !== undefined && !/^\d+$/.test(query.page)) {
    return { isValid: false, message: 'O parâmetro page deve ser um inteiro positivo' };
  }

  if (query.limit !== undefined && !/^\d+$/.test(query.limit)) {
    return { isValid: false, message: 'O parâmetro limit deve ser um inteiro positivo' };
  }

  const page = query.page === undefined ? 1 : Number(query.page);
  const limit = query.limit === undefined ? 10 : Number(query.limit);

  if (page < 1 || page > MAX_SAFE_INTEGER) {
    return { isValid: false, message: 'O parâmetro page deve ser um inteiro positivo dentro do intervalo seguro' };
  }

  if (limit < 1 || limit > MAX_LIMIT) {
    return { isValid: false, message: 'O parâmetro limit deve ser um inteiro entre 1 e 100' };
  }

  return {
    isValid: true,
    value: { page, limit }
  };
}

module.exports = {
  validateCreateTask,
  validateTaskId,
  validateUpdateTask,
  validateStatusUpdate,
  validateTaskFilters,
  validatePagination
};
