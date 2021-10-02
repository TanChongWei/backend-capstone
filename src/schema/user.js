module.exports = class User {
  constructor(email, hashed_password){
    this.email = email
    this.hashed_password = hashed_password
  }
}