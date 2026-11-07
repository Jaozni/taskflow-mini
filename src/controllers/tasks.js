const { validateCreateTask } = require('../validators/tasks');
const { createTask } = require('../models/tasks');

function createTaskController(database) {
  return (req, res) => {
    const validation = validateCreateTask(req.body);

    if (!validation.isValid) {
      return res.status(400).json({ message: validation.message });
    }

    try {
      const task = createTask(database, validation.value);
      return res.status(201).json(task);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro interno do servidor' });
    }
  };
}

module.exports = { createTaskController };
