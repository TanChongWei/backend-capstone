module.exports = class TodoListTask {
  constructor(task, subtasks = []) {
    this.task = task
    this.subtasks = subtasks
    this.isCompleted = false
    this.isDeleted = false
  }
}