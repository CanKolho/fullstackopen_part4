const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper.js')
const app = require('../app.js')
const api = supertest(app)

const Blog = require('../models/blog.js')

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

describe('GET to api endpoint /api/blogs', () => {
    test('blogs are returned as json', async () => {
      await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })

    test('return right amount of blogs', async () => {
      const response = await api.get('/api/blogs')

      expect(response.body).toHaveLength(helper.initialBlogs.length)
    })

    test('blogs have property id instead of _id', async () => {
      const response = await api.get('/api/blogs')

      const ids = response.body.map(blog => blog.id)
      
      ids.forEach(id => expect(id).toBeDefined())
    })
})
  
afterAll(async () => {
  await mongoose.connection.close()
})