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
  
describe('POST to api endpoint /api/blogs', () => {
  test('Adds new blog correctly to database', async () => {
    const newBlog = {
      title: 'MongoDB is for storing data',
      author: 'db management',
      url: 'www.mongodb.com',
      likes: 1000
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(blog => blog.title)
    expect(titles).toContain('MongoDB is for storing data')
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})