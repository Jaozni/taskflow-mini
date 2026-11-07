const express = require('express');
const {
  createTask,
  listTasks,
  getTask,
  updateTask
} = require('../controllers/tasks');

const router = express.Router();

router.post('/', createTask);
router.get('/', listTasks);
router.get('/:id', getTask);
router.put('/:id', updateTask);

module.exports = router;
