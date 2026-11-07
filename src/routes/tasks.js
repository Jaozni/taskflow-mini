const express = require('express');
const { createTask } = require('../controllers/tasks');

const router = express.Router();

router.post('/', createTask);

module.exports = router;
