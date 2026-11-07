const express = require('express');
const { createTask, listTasks, getTask } = require('../controllers/tasks');

const router = express.Router();

router.post('/', createTask);
router.get('/', listTasks);
router.get('/:id', getTask);

module.exports = router;
