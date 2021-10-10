const {UserFacingError} = require('../schema/error')

module.exports = (service) => {
  const middleware = {}

  middleware.verifyAuthStatus = (req, res, next) => {
    const authToken = req.cookies.token
    if (authToken) {
      const email = service.verifyToken(authToken)
      if (email) {
        req.email = email
        return next()
      }
    }
    res.status(401).send(new UserFacingError(401, ['Unauthorised - Please log in or register first.']))
  }
  
  middleware.verifyListAccessPermissions = async (req, res, next) => {
    const email = req.email
    const {todoListId} = req.params
    return (
      await service.verifyListAccessPermissions(email, todoListId)
        ? next()
        : res.status(401).send(new UserFacingError(401, ['Unauthorised - Please request for list edit access.']))
    )
  }

  return middleware
}