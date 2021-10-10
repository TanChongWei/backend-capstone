class ApplicationError extends Error {
  constructor(code, response) {
    super()
    this.statusCode = code
    this.response = response
  }
}

class baseVerificationError {
  constructor(message) {
    this.error = message
  }
}

class JwtVerificationError extends baseVerificationError {}
class permissionsVerificationError extends baseVerificationError {}

class UserFacingError extends ApplicationError {}
class NotFoundError extends ApplicationError {}
class DatabaseError extends ApplicationError {
  constructor(message) {
    super()
    this.databaseError = message
  }
}


module.exports = {
  UserFacingError,
  DatabaseError,
  NotFoundError,
  JwtVerificationError,
  permissionsVerificationError
}