module.exports = class TodoListTask {
  constructor(task) {
    this.task = task
    this.completed = false
    this.deleted = false
  }
}