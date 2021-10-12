const { UserFacingError, DatabaseError } = require('../schema/error')

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
    try {
      const access = await service.verifyListAccessPermissions(email, todoListId)
      if (access === null) return (
        res.status(404)
          .send(new UserFacingError(404, [`No such list found of Id : ${todoListId}`]))
      )
      else if (access === false) return (
        res.status(403)
          .send(new UserFacingError(403, ['Unauthorised - Please request for list edit access.']))
      )
      next()
    } catch (e) {
      res.status(500)
        .send(new UserFacingError(500, e))
    }
  }

  return middleware
}