const { validateCreateTask } = require('./tasks');

// Compatibilidade para imports antigos; o router usa os controllers.
function validateTaskPayload(payload) {
  const validation = validateCreateTask(payload);
  return validation.isValid ? [] : [validation.message];
}

module.exports = { validateTaskPayload };
