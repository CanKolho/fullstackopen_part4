const jwt = require('jsonwebtoken')
const config = require('../utils/config')
const blogRouter = require('express').Router()
const Blog = require('../models/blog.js')
const User = require('../models/user.js')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogRouter.post('/', async (request, response) => {
  const body = request.body

  const decodedToken = jwt.verify(request.token, config.SECRET)

  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })  
  }

  const user = await User.findById(decodedToken.id)

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user.id
  })

  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog.id)
  await user.save()
  
  response
    .status(201)
    .json(
      await savedBlog.populate('user', { username: 1, name: 1 })
    )
})

blogRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

blogRouter.put('/:id', async (request, response) => {
  const blog = request.body //has the updated property (in this case: 'Likes')
  const id = request.params.id
  
  const updatedBlog = await Blog.findByIdAndUpdate(id, blog, { new: true })

  response
    .status(200)
    .json(updatedBlog)
})

module.exports = blogRouter