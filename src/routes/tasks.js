const express = require('express');
const {
  createTaskController,
  listTasksController,
  getTaskStatsController,
  getTaskController,
  updateTaskController,
  updateTaskStatusController,
  deleteTaskController
} = require('../controllers/tasks');

function createTasksRouter(database) {
  const router = express.Router();

  router.get('/stats', getTaskStatsController(database));
  router.get('/', listTasksController(database));
  router.get('/:id', getTaskController(database));
  router.post('/', createTaskController(database));
  router.put('/:id', updateTaskController(database));
  router.patch('/:id/status', updateTaskStatusController(database));
  router.delete('/:id', deleteTaskController(database));

  return router;
}

module.exports = createTasksRouter;
