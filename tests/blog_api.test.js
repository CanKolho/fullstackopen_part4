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

describe('HTTP GET to api endpoint /api/blogs', () => {
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
  
describe('HTTP POST to api endpoint /api/blogs', () => {
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

  test('if "likes" property is missing, it is set to 0 by default', async () => {
    const newBlog = {
      title: 'Likes are important',
      author: 'someone who wants likes',
      url: 'www.like.com'
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
    expect(blogsAtEnd[blogsAtEnd.length - 1].likes).toBe(0)
  })

  test('response status 400, if properties "title" or "url" are missing', async () => {
    const newBlog = {
      author: 'bad request',
      likes: 400
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
    
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })
})

describe('HTTP DELETE to api endpoint /api/blogs/:id', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)
    
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})