const db = require('../src/db')

db.resetDb().then(() => {
  console.log('Database reset and reinitialisation completed.')
  process.exit()
}).catch(err => {
  console.log(err)
  console.log('Database reset failed')
  process.exit(1)
})