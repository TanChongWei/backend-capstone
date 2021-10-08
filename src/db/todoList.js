const { DatabaseError } = require('../schema/error')
// this.id = id
// this.listName = listName
// this.author = author
// this.listTasks = listTasks
// this.access = access
// this.isDeleted = false

module.exports = (pool) => {
  const db = {}

  db.findListsByEmail = async (email) => {
    try {
      const res = await pool.query(`
      SELECT * FROM todo_lists
      WHERE author = $1 AND todo_lists.deleted = $2
      `,
      [email, false]
      )
      return res.rows.length > 0 ? res.rows : null
    } catch (e) {
      throw new DatabaseError(e.message)
    }
  }

  db.InsertTodoList = async (todoList) => {
    try {
      const res = await pool.query(
        'INSERT INTO todo_lists (list_name, author, deleted) VALUES ($1, $2, $3) RETURNING *',
        [todoList.listName, todoList.author, false]
      )     
      return res.rows[0]
    } catch (e) {
      throw new DatabaseError(e.message)
    }
  }

  db.findListById = async (id, email) => {
    const res = await pool.query(
      'SELECT * FROM todo_lists WHERE list_id = $1 AND author = $2',
      [id, email]
    )
    return res.rows.length > 0 ? res.rows[0] : null
  }

  db.findListByIdAndUpdate = async (id, email, newName, newTasks) => {
    try {
      const updatedList = await pool.query(
        'UPDATE todo_lists SET list_name = $3 WHERE list_id = $1 AND author = $2 RETURNING *',
        [id, email, newName]
      )
      return updatedList.rows[0]
    } catch (e) {
      throw new DatabaseError(e.message)
    }
  } 

  db.findListByIdAndDelete = async (id, email) => {
    try {
      const res = await pool.query(
        'UPDATE todo_lists SET deleted = $3 WHERE list_id = $1 AND author = $2 RETURNING *',
        [id, email, true]
      )
      return res
    } catch (e) {
      throw new DatabaseError(e.message)
    }
  }

  // db.allowEditAccess = async (id, email) => {
  //   //change to json type, retrieve the current access. If access is already given, do nothing
  //   //else stringify the current access emails and add the new email using spread operator
  //   //update the accesslist
  //   const res = await pool.query(

  //   )
  //   return
  // }

  return db
}