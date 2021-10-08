const db = require('../src/db')

db.initialise().then(() => {
  console.log('Database migrated.')
  process.exit()
}).catch(err => {
  console.log(err)
  console.log('Database migration failed')
  process.exit(1)
})