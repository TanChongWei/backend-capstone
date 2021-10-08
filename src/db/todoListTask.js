const { DatabaseError } = require('../schema/error')

module.exports = (pool) => {
  const db = {}

  db.getTodoListTasks = async(listId) => {
    try {
      const res = await pool.query(
        'SELECT * FROM list_tasks WHERE todo_list_id = $1 AND deleted = $2',
        [listId, false]
      )
      return res.rows
    } catch (e) {
      throw new DatabaseError(e.message)
    }
  }

  db.addTodoListTask = async (listId, task) => {
    try {
      const res = await pool.query(
        'INSERT INTO list_tasks (todo_list_id, task, completed, deleted) VALUES  ($1, $2, $3, $4) RETURNING *',
        [listId, task.task, task.completed, task.deleted]
      )
      return res.rows[0]
    } catch (e) {
      throw new DatabaseError(e.message)
    }
  } 

  db.updateTodoListTask = async (listId, taskId, task) => {
    try {
      const res = await pool.query(
        'UPDATE list_tasks SET task = $3 WHERE todo_list_id = $1 AND task_id = $2 RETURNING *',
        [listId, taskId, task]
      )
      return res.rows[0]
    } catch (e) {
      throw new DatabaseError(e.message)
    }
  }

  db.deleteTodoListTask = async (listId, taskId) => {
    try {
      const res = await pool.query(
        'UPDATE list_tasks SET deleted = $3 WHERE todo_list_id = $1 AND task_id = $2',
        [listId, taskId, true]
      )
      return res
    } catch (e) {
      throw new DatabaseError(e.message)
    }
  }

  return db
}