const { DatabaseError } = require('../schema/error')

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
      return res.rows.length ? res.rows : null
    } catch (e) {
      throw new DatabaseError(e.message)
    }
  }

  db.InsertTodoList = async (todoList) => {
    try {
      const res = await pool.query(`
      WITH ins1 as (
        INSERT INTO todo_lists (list_name, author, deleted) VALUES ($1, $2, $3) RETURNING *
      ) 
      INSERT INTO list_access (email, todo_list_id) 
      VALUES (
        (SELECT author FROM ins1),
        (SELECT list_id FROM ins1)
        ) RETURNING todo_list_id as list_id
      `,
      [todoList.listName, todoList.author, false]
      )     
      return res.rows[0]
    } catch (e) {
      throw new DatabaseError(e.message)
    }
  }

  db.findListById = async (id) => {
    try {
      const res = await pool.query(
        `SELECT list_id, list_name, author, task_id, task, completed, list_tasks.deleted 
        FROM todo_lists INNER JOIN list_tasks 
        ON todo_lists.list_id = list_tasks.todo_list_id
        WHERE todo_lists.list_id = $1 AND todo_lists.deleted = $2`,
        [id, false]
      )
      
      return res.rows.length ? res.rows : null
    } catch (e) {
      throw new DatabaseError(e.message)
    }
  }

  db.findListByIdAndUpdate = async (id, newName) => {
    try {
      const res = await pool.query(
        'UPDATE todo_lists SET list_name = $2 WHERE list_id = $1 RETURNING *',
        [id, newName]
      )
      return res.rows.length ? res.rows[0] : null
    } catch (e) {
      throw new DatabaseError(e.message)
    }
  } 

  db.findListByIdAndDelete = async (id) => {
    try {
      const res = await pool.query(
        'UPDATE todo_lists SET deleted = $3 WHERE list_id = $1 RETURNING *',
        [id, true]
      )
      return res.rows.length ? res.rows[0] : null
    } catch (e) {
      throw new DatabaseError(e.message)
    }
  }

  db.allowEditAccess = async (id, email) => {
    try {
      const res = await pool.query(`
        WITH ins1 as (
          INSERT INTO list_access (email, todo_list_id) VALUES ($1, $2) RETURNING todo_list_id
        )
        SELECT list_name FROM todo_lists 
        WHERE list_id = (SELECT * FROM ins1)`,
      [email, id]
      )
      return res.rows[0]
    } catch (e) {
      throw new DatabaseError(e.message)
    }
  }

  db.verifyListAccess = async(email, id) => {
    try {
      const res = await pool.query(
        'SELECT * FROM list_access WHERE email = $1 AND todo_list_id = $2',
        [email, id]
      )
      console.log(res.rows)
      return res.rows.length > 0
    } catch (e) {
      throw new DatabaseError(e.message)
    }
  }

  return db
}