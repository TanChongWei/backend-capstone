class SuccessResponse {
  constructor(code, user, data) {
    this.code = code,
    this.user = user,
    this.data = data
  }
}

module.exports = {
  SuccessResponse
}