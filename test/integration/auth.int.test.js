/* eslint-disable no-undef */
const request = require('supertest')
const utils = require('./utils')

const app = utils.app

const email = 'test_user@gmail.com'
const invalidEmail = 'invalid@gmail.com'
const invalidPassword = 'wrongpassword'
const password = 'test_password_123'

beforeAll(async () => {
  await utils.setup()
})

afterAll(async () => {
  await utils.teardown()
})


describe('default GET /', () => {
  it('Should return 200', async () => {
    return request(app)
      .get('/')
      .expect(200)
  })
})

describe('POST /register for user registration', () => {
  it('Should return a 201 if email has not been registered', async () => {
    return request(app)
      .post('/register')
      .send({email, password})
      .expect(201)
  })

  it('Should return 400 if email already exists', async () => {
    return request(app)
      .post('/register')
      .send({email, password})
      .expect(400)
      .then(res => {
        expect(res.body.token).toBeFalsy()
      })
  })

  it('Should return 500 if an error occured', async () => {
    return request(app)
      .post('/register')
      .send('invalid request body')
      .expect(500)
  })
})

describe('POST /login for user login', () => {
  it('Should return 201 if the email and password are valid', async () => {
    return request(app)
      .post('/login')
      .send({email, password})
      .expect(201)
  })
  it('Should return 401 if an invalid email is passed', async () => {
    return request(app)
      .post('/login')
      .send({email: invalidEmail, password})
      .expect(401)
  })
  it('Should return 401 if an invalid password is passed', async () => {
    return request(app)
      .post('/login')
      .send({email, password: invalidPassword})
      .expect(401)
  })
})