const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

module.exports = (db) => {
  const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS)
  const JWT_SECRET = process.env.JWT_SECRET
  const JWT_EXPIRY = parseInt(process.env.JWT_EXPIRY)
  const service = {}

  service.generateJSONToken = (uid) => {
    return jwt.sign({uid}, JWT_SECRET, {expiresIn: JWT_EXPIRY})
  }

  service.createUser = async (email, password) => {
    try {
      const user = await db.findUserByEmail(email)
      if (user) {
        return null
      } else {
        // const passwordHash = await bcrypt.hash(password, SALT_ROUNDS)
        // await db.insertUser(email, passwordHash)
        return service.generateJSONToken(email)
      }
    } catch (e) {
      console.log(e.message)
      return null
    }
  }

  service.loginUser = async (email, password) => {
    const user = await db.findUserByEmail(email)
    if (user) {
      const isValid = await bcrypt.compare(password, user.password_hash)
      return isValid ? service.generateJSONToken(email) : null
    }
    return null
  }

  service.verifyToken = async(token) => {
    try {
      return jwt.verify(token, JWT_SECRET)
    } catch (e) {
      console.log(e.message)
      return null
    }
  }

  return service
}