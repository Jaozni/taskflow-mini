const {
  validateCreateTask,
  validateTaskId,
  validateUpdateTask,
  validateStatusUpdate,
  validateTaskFilters,
  validatePagination,
  validateTaskSearch
} = require('../validators/tasks');
const {
  createTask,
  listTasks,
  findTaskById,
  updateTask,
  updateTaskStatus,
  deleteTask
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
    const filterValidation = validateTaskFilters(req.query);

    if (!filterValidation.isValid) {
      return res.status(400).json({ message: filterValidation.message });
    }

    const paginationValidation = validatePagination(req.query);

    if (!paginationValidation.isValid) {
      return res.status(400).json({ message: paginationValidation.message });
    }

    const searchValidation = validateTaskSearch(req.query);

    if (!searchValidation.isValid) {
      return res.status(400).json({ message: searchValidation.message });
    }

    try {
      const result = listTasks(database, filterValidation.value, paginationValidation.value, searchValidation.value);
      return res.status(200).json(result);
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

function updateTaskController(database) {
  return (req, res) => {
    const idValidation = validateTaskId(req.params.id);

    if (!idValidation.isValid) {
      return res.status(400).json({ message: idValidation.message });
    }

    const bodyValidation = validateUpdateTask(req.body);

    if (!bodyValidation.isValid) {
      return res.status(400).json({ message: bodyValidation.message });
    }

    try {
      const task = updateTask(database, idValidation.value, bodyValidation.value);

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

function updateTaskStatusController(database) {
  return (req, res) => {
    const idValidation = validateTaskId(req.params.id);

    if (!idValidation.isValid) {
      return res.status(400).json({ message: idValidation.message });
    }

    const bodyValidation = validateStatusUpdate(req.body);

    if (!bodyValidation.isValid) {
      return res.status(400).json({ message: bodyValidation.message });
    }

    try {
      const task = updateTaskStatus(database, idValidation.value, bodyValidation.value.status);

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

function deleteTaskController(database) {
  return (req, res) => {
    const validation = validateTaskId(req.params.id);

    if (!validation.isValid) {
      return res.status(400).json({ message: validation.message });
    }

    try {
      const deleted = deleteTask(database, validation.value);

      if (!deleted) {
        return res.status(404).json({ message: 'Tarefa não encontrada' });
      }

      return res.status(204).send();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro interno do servidor' });
    }
  };
}

module.exports = {
  createTaskController,
  listTasksController,
  getTaskController,
  updateTaskController,
  updateTaskStatusController,
  deleteTaskController
};
