/* eslint-disable no-undef */
const { DatabaseError } = require('../../../src/schema/error')
const AuthService = require('../../../src/services/auth')
const {email, password, db} = require('../mocks/mocks')

const authService = AuthService(db)

describe('Creating a new user', () => {
  describe('Given a valid email and password', () => {
    it('Should return a valid token', async () => {
      db.findUserByEmail.mockResolvedValueOnce(null)
      const token = await authService.createUser(email, password)
      expect(token).toBeTruthy()
    })
  })

  describe('Given an already existing email', () => {
    it('Should return null', async () => {
      const token = await authService.createUser(email, password)
      expect(token).toBeFalsy()
    })
  })
})

describe('User login', () => {
  describe('Given a valid email and password combination', () => {
    it('Should return a valid token', async () => {
      const token = await authService.loginUser(email, password)
      expect(token).toBeTruthy()
    })
  })

  describe('Given an invalid email and password combination', () => {
    it('Should return null', async () => {
      const token = await authService.loginUser('incorrectEmail', 'incorrectPassword')
      expect(token).toBeFalsy()
    })
  })

  describe('Given an invalid email', () => {
    it('Should return null', async () => {
      db.findUserByEmail.mockResolvedValueOnce(null)
      const token = await authService.loginUser('incorrectEmail', password)
      expect(token).toBeFalsy()
    })
  })

  describe('Given an incorrect password', () => {
    it('Should return null', async () => {
      const token = await authService.loginUser(email, 'incorrectPassword')
      expect(token).toBeFalsy()
    })
  })
})

describe('Token verification', () => {
  describe('Given a valid token for a particular email', () => {
    it('Should return the same email', () => {
      const token = authService.generateJSONToken(email)
      const verifiedEmail = authService.verifyToken(token)
      expect(verifiedEmail).toEqual(email)
    })
  })

  describe('Given an invalid token',  () => {
    it('Should return null', () => {
      const token = 'InvalidToken'
      const verifiedEmail = authService.verifyToken(token)
      expect(verifiedEmail).toBeNull()
    })
  })
})

describe('List access permissions verification', () => {
  describe('When user has permissions', () => {
    it('Should return true', async () => {
      const access = await authService.verifyListAccessPermissions(email, 1)
      expect(access).toEqual(true)
    })
  })

  describe('When no such list is found', () => {
    it('Should return null', async () => {
      db.verifyListAccess.mockResolvedValueOnce(null)
      const access = await authService.verifyListAccessPermissions(email, 'invalidListId')
      expect(access).toBeNull()
    })
  })

  describe('When user is unauthorised', () => {
    it('Should return false', async () => {
      db.verifyListAccess.mockResolvedValueOnce(false)
      const access = await authService.verifyListAccessPermissions('unauthorisedUser', 1)
      expect(access).toEqual(false)
    })
  })

  describe('When a database error has occured', () => {
    it('Should return the database error', async() => {
      const mockDbError = new DatabaseError('test-error')
      db.verifyListAccess.mockRejectedValueOnce(mockDbError)
      const access = await authService.verifyListAccessPermissions(email, 1)
      expect(access).toEqual(mockDbError)
    })
  })
})
