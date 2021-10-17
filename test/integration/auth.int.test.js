/* eslint-disable no-undef */
const request = require('supertest')
const utils = require('./utils')

const app = utils.app

const email = 'test_user@gmail.com'
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

  it('Should return 400 if email already exists', () => {
    return request(app)
      .post('/register')
      .send({email, password})
      .expect(400)
      .then(res => {
        expect(res.body.token).toBeFalsy()
      })
  })

  it('Should return 500 if an error occured', () => {
    return request(app)
      .post('/register')
      .send('invalid request body')
      .expect(500)
  })
})