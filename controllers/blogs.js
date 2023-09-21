const blogRouter = require('express').Router()
const Blog = require('../models/blog.js')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body)

  const savedBlog = await blog.save()
  
  response
    .status(201)
    .json(savedBlog)
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