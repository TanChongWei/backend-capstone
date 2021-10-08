class ApplicationError extends Error {
  constructor(code, response) {
    super()
    this.statusCode = code
    this.response = response
  }
}

class JwtVerificationError {
  constructor(message) {
    this.error = message
  }
}

class UserFacingError extends ApplicationError {}

class DatabaseError extends ApplicationError {
  constructor(message) {
    super()
    this.databaseError = message
  }
}

class NotFoundError extends ApplicationError {}

module.exports = {
  UserFacingError,
  DatabaseError,
  NotFoundError,
  JwtVerificationError
}