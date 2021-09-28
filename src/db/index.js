const db = {
  createUser: () => console.log('User Created!'),
  insertUser: () => console.log('User Inserted!'),
  findUserByEmail: () => {
    console.log('finding')
    return null
  }
}

module.exports = db