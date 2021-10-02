module.exports = class TodoList {
  constructor(id, listName, author, listTasks, access = []) {
    this.id = id
    this.listName = listName
    this.author = author
    this.listTasks = listTasks
    this.access = access
    this.isDeleted = false
  }
}