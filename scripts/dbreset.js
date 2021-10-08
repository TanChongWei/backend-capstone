const db = require('../src/db')

db.resetDb().then(() => {
  console.log('Database reset completed.')
  process.exit()
}).catch(err => {
  console.log(err)
  console.log('Database reset failed')
  process.exit(1)
})