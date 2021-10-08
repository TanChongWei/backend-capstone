const {UserFacingError} = require('../schema/error')

module.exports = (service) => {
  return (req, res, next) => {
    const authToken = req.cookies.token
    if (authToken) {
      const email = service.verifyToken(authToken)
      if (email) {
        req.email = email
        return next()
      }
    }
    res.status(401).send(new UserFacingError(401, 'Unauthorised - Please log in or register first.'))
  }
}