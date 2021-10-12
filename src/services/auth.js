const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { JwtVerificationError, permissionsVerificationError } = require('../schema/error')

module.exports = (db) => {
  const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS)
  const JWT_SECRET = process.env.JWT_SECRET
  const JWT_EXPIRY = parseInt(process.env.JWT_EXPIRY)
  const service = {}

  service.generateJSONToken = (email) => {
    return jwt.sign({email}, JWT_SECRET, {expiresIn: JWT_EXPIRY})
  }

  service.createUser = async (email, password) => {
    const user = await db.findUserByEmail(email)
    if (user) {
      return null
    } else {
      const passwordHash = await bcrypt.hash(password, SALT_ROUNDS)
      const user = await db.insertUser(email, passwordHash)
      return service.generateJSONToken(user.email)
    }
  }

  service.loginUser = async (email, password) => {
    const user = await db.findUserByEmail(email)
    if (user) {
      const isValid = await bcrypt.compare(password, user.password_hash)
      return isValid ? service.generateJSONToken(user.email) : null
    }
    return null
  }

  service.verifyToken = (token) => {
    try {
      return jwt.verify(token, JWT_SECRET).email
    } catch (e) {
      console.log(new JwtVerificationError(e.message))
      return null
    }
  }

  service.verifyListAccessPermissions = async (email, todoListId) => {
    try {
      const access = await db.verifyListAccess(email, todoListId)
      if (access === null) return null
      return access ? true : false
    } catch (e) {
      console.log(new permissionsVerificationError(e))
      return e
    }
  }

  return service
}