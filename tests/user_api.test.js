const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper.js')
const app = require('../app.js')
const api = supertest(app)

const bcrypt = require('bcryptjs')
const User = require('../models/user.js')

describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('password', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with new user', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'new',
      name: 'user',
      password: 'password',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails if username is missing', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      name: 'name',
      password: 'password',
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(response.body.error)
      .toContain('User validation failed: username: Path `username` is required.')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('creation fails if username has less than 3 characters', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'us',
      name: 'name',
      password: 'password',
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(response.body.error)
      .toContain('User validation failed: username: Path `username` (`us`) is shorter than the minimum allowed length (3).')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('creation fails if username is already in database', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'name',
      password: 'password',
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(response.body.error)
      .toContain('User validation failed: username: Error, expected `username` to be unique. Value: `root`')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('creation fails if password is missing', async () => {
    const usersAtStart = await helper.usersInDb()
  
    const newUser = {
      username: 'someone',
      name: 'name',
    }
  
    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
  
    expect(response.body.error)
      .toContain('password is required')
  
    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
  
  test('creation fails if password is less than 3 characters', async () => {
    const usersAtStart = await helper.usersInDb()
  
    const newUser = {
      username: 'someone',
      name: 'name',
      password: 'pa',
    }
  
    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
  
    expect(response.body.error)
      .toContain('password must be at least 3 characters long')
  
    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})  
