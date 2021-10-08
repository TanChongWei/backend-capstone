module.exports = class TodoList {
  constructor(listName, author, listTasks) {
    this.listName = listName
    this.author = author
    this.listTasks = listTasks
    this.deleted = false
  }
}