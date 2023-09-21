const Blog = require('../models/blog.js')

const initialBlogs = [
  {
    title: 'Nodejs is fun',
    author: 'user of node',
    url: 'www.nodejs.com',
    likes: 10
  },
  {
    title: 'React is nice',
    author: 'student from Aalto',
    url: 'www.react.com',
    likes: 102
  },
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
 initialBlogs,
 blogsInDb,
}