const { DatabaseError } = require('../schema/error')

module.exports = (pool) => {
  const db = {}

  db.insertUser = async (email, password_hash) => {
    try {
      const {rows} = await pool.query(
        'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING *',
        [email, password_hash]
      )
      return rows[0]
    } catch (e) {
      throw new DatabaseError(e.message)
    }
  }

  db.findUserByEmail = async (email) => {
    try {
      const {rows} = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      )
      return rows[0]
    } catch (e) {
      throw new DatabaseError(e.message)
    }
  }

  return db
}