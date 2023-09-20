const listHelper = require('../utils/list_helper.js')

test('dummy returns one', () => {
  const blog = []

  const result = listHelper.dummy(blog)

  expect(result).toBe(1)
})