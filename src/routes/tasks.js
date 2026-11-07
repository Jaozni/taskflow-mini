const express = require('express');
const {
  createTaskController, listTasksController, getTaskController,
  updateTaskController, updateTaskStatusController, deleteTaskController
} = require('../controllers/tasks');

function createTasksRouter(database) {
  const router = express.Router();
  router.post('/', createTaskController(database));
  router.get('/', listTasksController(database));
  router.get('/:id', getTaskController(database));
  router.put('/:id', updateTaskController(database));
  router.patch('/:id/status', updateTaskStatusController(database));
  router.delete('/:id', deleteTaskController(database));
  return router;
}

module.exports = createTasksRouter;
