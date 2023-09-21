const lodash = require("lodash")

const dummy = (blogs) => 1

const totalLikes = (blogs) => blogs.reduce((acc, blog) => acc + blog.likes, 0)

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null

  const arrOfLikes = blogs.map(blog => blog.likes)
  const mostLikesIdx = arrOfLikes.indexOf(Math.max(...arrOfLikes))
  const mostLiked = blogs[mostLikesIdx]

  return {
    title: mostLiked.title,
    author: mostLiked.author,
    url: mostLiked.url,
    likes: mostLiked.likes,
  }
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null

  const authorCountArr = lodash.countBy(blogs, 'author')
  const entries = Object.entries(authorCountArr)
  const blogCount = entries.map(entry => entry[1])
  const mostBlogsIdx = blogCount.indexOf(Math.max(...blogCount))
  const topAuthor = entries[mostBlogsIdx]

  return {
    author: topAuthor[0],
    blogs: topAuthor[1],
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null

  const authorsGrouped = lodash.groupBy(blogs, 'author')
  const keys = Object.keys(authorsGrouped)

  const mostLikesarr = keys.map(key => 
    lodash.sumBy(authorsGrouped[key], 'likes')
  )

  const mostLikesIdx = mostLikesarr.indexOf(Math.max(...mostLikesarr))

  return {
    author: keys[mostLikesIdx],
    likes: mostLikesarr[mostLikesIdx],
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
