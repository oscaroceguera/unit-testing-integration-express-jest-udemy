const mongoose = require('mongoose')

async function connect() {
  try {
    await mongoose.connect("mongodb://localhost:27017/todo-jest", {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
  } catch (error) {
    console.error('Error connecting mongodb')
    console.error(error)
  }
}

module.exports = { connect }