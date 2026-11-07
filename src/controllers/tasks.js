const {
  validateCreateTask,
  validateTaskId
} = require('../validators/tasks');
const {
  createTask,
  listTasks,
  findTaskById
} = require('../models/tasks');

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

function listTasksController(database) {
  return (req, res) => {
    try {
      const tasks = listTasks(database);
      return res.status(200).json(tasks);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro interno do servidor' });
    }
  };
}

function getTaskController(database) {
  return (req, res) => {
    const validation = validateTaskId(req.params.id);

    if (!validation.isValid) {
      return res.status(400).json({ message: validation.message });
    }

    try {
      const task = findTaskById(database, validation.value);

      if (!task) {
        return res.status(404).json({ message: 'Tarefa não encontrada' });
      }

      return res.status(200).json(task);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro interno do servidor' });
    }
  };
}

module.exports = {
  createTaskController,
  listTasksController,
  getTaskController
};
