const AuthMiddleware = require('../../src/middleware/authMiddleware')
const authService = {
  verifyToken: jest.fn(),
  verifyListAccessPermissions: jest.fn(async() => {
    return true
  })
}
const { DatabaseError } = require('../../src/schema/error')
const { getMockReq, getMockRes } = require('@jest-mock/express')

const authMiddleware = AuthMiddleware(authService)

describe('Authentication middleware', () => {
  describe('If no token is present', () => {
    it('Should return a response with a status of 401', async () => {
      const req = getMockReq()
      const {res, next} = getMockRes()
      authMiddleware.verifyAuthStatus(req, res, next)
      expect(authService.verifyToken).not.toBeCalled()
      expect(res.status).toBeCalledWith(401)
    })
  })
  describe('If token is invalid', () => {
    it('Should return a response with a status of 401', async () => {
      const req = getMockReq()
      const {res, next} = getMockRes()
      req.cookies.token = 'invalid-token'
      authService.verifyToken.mockReturnValue(null)
      authMiddleware.verifyAuthStatus(req, res, next)
      expect(authService.verifyToken).toBeCalled()
      expect(res.status).toBeCalledWith(401)
    })
  })
  describe('If a valid Token is present', () => {
    it('Should return the next middleware and the email should be verified', async () => {
      authService.verifyToken.mockReturnValueOnce('email')
      const req = getMockReq()
      const {res, next} = getMockRes()
      req.cookies.token = 'token'
      authMiddleware.verifyAuthStatus(req, res, next)
      expect(next).toBeCalled()
      expect(req.email).toEqual('email')
    })
  })
})

describe('List permissions middleware', () => {
  describe('If user has no permissions', () => {
    it('Should return a response with a status of 403', async () => {
      const req = getMockReq()
      const {res, next} = getMockRes()
      authService.verifyListAccessPermissions.mockResolvedValueOnce(false)
      await authMiddleware.verifyListAccessPermissions(req, res, next)
      expect(next).not.toBeCalled()
      expect(res.status).toBeCalledWith(403)
    })
  })
  describe('If a database error has occured', () => {
    it('Should return a response of 500', async () => {
      const req = getMockReq()
      const {res, next} = getMockRes()
      const mockDbError = new DatabaseError('test-error')
      authService.verifyListAccessPermissions.mockRejectedValueOnce(mockDbError)
      await authMiddleware.verifyListAccessPermissions(req, res, next)
      expect(res.status).toBeCalledWith(500)
    })
  })
  describe('If no such list is found', () => {
    it('Should return a response of 404', async () => {
      const req = getMockReq()
      const {res, next} = getMockRes()
      authService.verifyListAccessPermissions.mockResolvedValueOnce(null)
      await authMiddleware.verifyListAccessPermissions(req, res, next)
      expect(next).not.toBeCalled()
      expect(res.status).toBeCalledWith(404)
    })
  })
  describe('If user has permissions', () => {
    it('Should return the next middleware', async () => {
      const req = getMockReq()
      const {res, next} = getMockRes()
      await authMiddleware.verifyListAccessPermissions(req, res, next)
      expect(next).toBeCalled()
    })
  })
})