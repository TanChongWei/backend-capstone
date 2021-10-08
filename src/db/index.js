const { Pool } = require('pg')
require('dotenv').config()
const userDbHelpers = require('./users')
const todoListDbHelpers = require('./todoList')
const todoListTaskDbHelpers = require('./todoListTask')

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.DB,
  password: process.env.POSTGRES_KEY,
  port: process.env.POSTGRES_PORT,
  connectionTimeoutMillis: process.env.CONNECTION_TIMEOUT_DURATION || 5000
}) 

pool.connect((err, client, release) => {
  if (err) {
    console.error('Error in connecting to database', err.stack)
  } else {
    console.log('Database connected')
  }
})

const db = {
  ...userDbHelpers(pool),
  ...todoListDbHelpers(pool),
  ...todoListTaskDbHelpers(pool)
}

db.initialise = async() => {
  await pool.query(`
  CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(100) NOT NULL,
    password_hash VARCHAR(100) NOT NULL
  )
  `)

  await pool.query(`
  CREATE TABLE IF NOT EXISTS todo_lists (
    list_id SERIAL PRIMARY KEY,
    list_name VARCHAR(100) NOT NULL,
    author VARCHAR(100) NOT NULL,
    deleted BOOLEAN NOT NULL
  )
  `)

  await pool.query(`
  CREATE TABLE IF NOT EXISTS list_Tasks (
    task_id SERIAL PRIMARY KEY,
    todo_list_id INT NOT NULL,
    task VARCHAR(255) NOT NULL,
    completed BOOLEAN NOT NULL,
    deleted BOOLEAN NOT NULL,
    CONSTRAINT foreign_key_list_id FOREIGN KEY(todo_list_id) REFERENCES todo_lists(list_id) ON DELETE CASCADE
  ) 
  `)

  await pool.query(`
  CREATE TABLE IF NOT EXISTS list_access (
    todo_list_id INT NOT NULL,
    CONSTRAINT foreign_key_todo_list_id FOREIGN KEY(todo_list_id) REFERENCES todo_lists(list_id) ON DELETE CASCADE
  )
  `)
}

db.resetDb = async () => {
  await pool.query(
    'DROP TABLE IF EXISTS list_Tasks, users, todo_lists, list_access'
  )
}

db.end = async () => {
  await pool.end()
}

module.exports = db