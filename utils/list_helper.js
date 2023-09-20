const dummy = (blogs) => 1

const totalLikes = (blogs) => blogs.reduce((acc, blog) => acc + blog.likes, 0)

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}