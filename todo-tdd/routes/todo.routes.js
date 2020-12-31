const router = require('express').Router()
const todoControllers = require('../controllers/todo.controller')

router.post('/', todoControllers.createTodo)
router.get('/', todoControllers.getTodos)
router.get('/:todoId', todoControllers.getTodoById)
router.put('/:todoId', todoControllers.updateTodo)
router.delete('/:todoId', todoControllers.deleteTodo)

module.exports = router