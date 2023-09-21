const listHelper = require('../utils/list_helper.js')
const { listWithOneBlog, listWithMultipleBlogs } = require('../tests/blog_helper.js')

test('dummy returns one', () => {
  const blog = []

  const result = listHelper.dummy(blog)

  expect(result).toBe(1)
})

describe('total likes', () => {
  test('of empty list is zero', () => {
    const result = listHelper.totalLikes([])
    expect(result).toBe(0)
  })

  test('when list has only one blog equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    expect(result).toBe(5)
  })

  test('of a bigger list is calculated right', () => {
    const result = listHelper.totalLikes(listWithMultipleBlogs)
    expect(result).toBe(36)
  })
})

describe('favorite blog', () => {
  test('returns the blog with most likes', () => {
    const result = listHelper.favoriteBlog(listWithMultipleBlogs)
    expect(result).toEqual({
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
    })
  })
})

describe('most blogs', () => {
  test('returns the author and count of blogs', () => {
    const result = listHelper.mostBlogs(listWithMultipleBlogs)
    expect(result).toEqual({
      author: 'Robert C. Martin',
      blogs: 3
    })
  })
})

describe('most likes', () => {
  test('returns the author and count of likes', () => {
    const result = listHelper.mostLikes(listWithMultipleBlogs)
    expect(result).toEqual({
      author: 'Edsger W. Dijkstra',
      likes: 17
    })
  })
})

