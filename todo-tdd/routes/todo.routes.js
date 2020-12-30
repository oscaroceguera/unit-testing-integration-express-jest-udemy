const router = require('express').Router()
const todoControllers = require('../controllers/todo.controller')

router.post('/', todoControllers.createTodo)

module.exports = router