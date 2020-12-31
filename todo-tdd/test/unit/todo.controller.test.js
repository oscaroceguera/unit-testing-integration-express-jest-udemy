const TodoController = require('../../controllers/todo.controller')
const TodoModel = require('../../model/todo.model')
const httpMocks = require('node-mocks-http')
const newTodo = require('../mock-data/new-todo.json');
const allTodos = require('../mock-data/all-todos.json');

// Remove this because jest.mock replaces they
// TodoModel.create = jest.fn()
// TodoModel.find = jest.fn()
// TodoModel.findById = jest.fn()
// TodoModel.findByIdAndUpdate = jest.fn()
// TodoModel.findByIdAndDelete = jest.fn()

// replace the jest.fn() methods
jest.mock('../../model/todo.model')

let req, res, next;
const todoId = '5fec538e80d6c0313b8336fc'
beforeEach(() => {
  req = httpMocks.createRequest()
  res = httpMocks.createResponse()
  next = jest.fn()
})

describe('TodoController.deleteTodo', () => {
  beforeEach(() => {
    req.params.todoId = todoId
  })
  it('should have a deletetodo function', () => {
    expect(typeof TodoController.deleteTodo).toBe('function')
  })

  it('should call TodoModel.findAndDelete', async () => {
    await TodoController.deleteTodo(req, res, next)
    expect(TodoModel.findByIdAndDelete).toHaveBeenCalledWith(todoId)
  })
  it('should return 200 ok and deleted todoModel', async () => {
    TodoModel.findByIdAndDelete.mockReturnValue(newTodo)
    await TodoController.deleteTodo(req, res, next)
    expect(res.statusCode).toBe(200)
    expect(res._getJSONData()).toStrictEqual(newTodo)
    expect(res._isEndCalled()).toBeTruthy()
  })
  it('shpould handle errors', async () => {
    const errorMessage = { message: "Error deletinig" }
    const rejectedPromise = Promise.reject(errorMessage)
    TodoModel.findByIdAndDelete.mockReturnValue(rejectedPromise)
    await TodoController.deleteTodo(req, res, next)
    expect(next).toHaveBeenCalledWith(errorMessage)
  })

  it('should handle 404', async () => {
    TodoModel.findByIdAndDelete.mockReturnValue(null)
    await TodoController.deleteTodo(req, res, next)
    expect(res.statusCode).toBe(404)
    expect(res._isEndCalled()).toBeTruthy()
  })

})

describe('TodoCOntroller.updateTodo', () => {
  beforeEach(() => {
    req.params.todoId = todoId
    req.body = newTodo
  })
  it('should have a updateTodo function', () => {
    expect(typeof TodoController.updateTodo).toBe('function')
  })
  it('should update with TodoModel.findByIdAndUpdate', async () => {
    // req.params.todoId = todoId
    // req.body = newTodo
    
    await TodoController.updateTodo(req, res, next)
    expect(TodoModel.findByIdAndUpdate).toBeCalledWith(todoId, newTodo, {
      new: true,
      useFindAndModify: false
    })
  })
  it('should return a respoonse with json data and httpo code 200', async () => {
    // req.params.todoId = todoId
    // req.body = newTodo
    TodoModel.findByIdAndUpdate.mockReturnValue(newTodo)
    await TodoController.updateTodo(req, res, next)
    expect(res._isEndCalled()).toBeTruthy()
    expect(res.statusCode).toBe(200)
    expect(res._getJSONData()).toStrictEqual(newTodo)
  })

  it('should handle errors', async () => {
    const errorMessage = { message: 'Error' }
    const rejectedPromise = Promise.reject(errorMessage)
    TodoModel.findByIdAndUpdate.mockReturnValue(rejectedPromise)
    await TodoController.updateTodo(req, res, next)
    expect(next).toHaveBeenCalledWith(errorMessage)
  })
})

describe('TodoController.getTodoById', () => {
  it('should have a getTodoById function', () => {
    expect(typeof TodoController.getTodoById).toBe('function')
  })
  it('should call TodoModel.findById with route parameters', async () => {
    req.params.todoId = '5fec538e80d6c0313b8336fc'
    await TodoController.getTodoById(req, res, next)
    expect(TodoModel.findById).toHaveBeenCalledWith('5fec538e80d6c0313b8336fc')
  })
  it('should return json body and response 200 code', async () => {
    TodoModel.findById.mockReturnValue(newTodo)
    await TodoController.getTodoById(req, res, next)
    expect(res.statusCode).toBe(200)
    expect(res._isEndCalled()).toBeTruthy()
    expect(res._getJSONData()).toStrictEqual(newTodo)
  })

  it('should handle errors in getTodoById', async () => {
    const errorMessage = { message: 'error finding todoModel' }
    const rejectedPromise = Promise.reject(errorMessage)

    TodoModel.findById.mockReturnValue(rejectedPromise)

    await TodoController.getTodoById(req, res, next)

    expect(next).toBeCalledWith(errorMessage)
  })

  it('should return 404 when item doesnt exist', async () => {
    TodoModel.findById.mockReturnValue(null)
    await TodoController.getTodoById(req, res, next)
    expect(res.statusCode).toBe(404)
    expect(res._isEndCalled()).toBeTruthy()
  })

  it('should handle 404', async () => {
    TodoModel.findByIdAndUpdate.mockReturnValue(null)
    await TodoController.updateTodo(req, res, next)
    expect(res.statusCode).toBe(404)
    expect(res._isEndCalled()).toBeTruthy()
  })
})

describe('TodoController.getTodos', () => {
  it('should have a getTodos function', () => {
    expect(typeof TodoController.getTodos).toBe('function')
  })
  it('should call TodoModel.find({})', async () => {
    await TodoController.getTodos(req, res, next)
    expect(TodoModel.find).toHaveBeenCalledWith({})
  })
  it('should return 200 response code and  all todos', async () => {
    TodoModel.find.mockReturnValue(allTodos)
    await TodoController.getTodos(req, res, next)
    expect(res.statusCode).toBe(200)
    expect(res._isEndCalled()).toBeTruthy()
    expect(res._getJSONData()).toStrictEqual(allTodos)
  })
  it('should handle errors in getTodos', async () => {
    const errorMessage = { message: 'Error finding' }
    const rejectedPromise = Promise.reject(errorMessage)

    TodoModel.find.mockReturnValue(rejectedPromise)

    await TodoController.getTodos(req, res, next)

    expect(next).toBeCalledWith(errorMessage)
  })

})

describe('TodoController.createTodo', () => {
  beforeEach(() => {
    req.body = newTodo
  })
  it('should have a createTodo functioin', () => {
    expect(typeof TodoController.createTodo).toBe('function')
  })
  it('should call todoModel.create', async () => {
    await TodoController.createTodo(req, res, next)
    expect(TodoModel.create).toBeCalledWith(newTodo)
  })
  it('should return 201 response code', async () => {
    await TodoController.createTodo(req, res, next)
    expect(res.statusCode).toBe(201)
    expect(res._isEndCalled()).toBeTruthy()
  })
  it('should return json body in response', async () => {
     TodoModel.create.mockReturnValue(newTodo);

     await TodoController.createTodo(req, res, next)
     expect(res._getJSONData()).toStrictEqual(newTodo)
  })
  it('should handle errors', async () => {
     const errorMessage = { message: 'Done property missing' }
     const rejectedPromise = Promise.reject(errorMessage)

     TodoModel.create.mockReturnValue(rejectedPromise)
     await TodoController.createTodo(req, res, next)
     expect(next).toBeCalledWith(errorMessage)
  })
})