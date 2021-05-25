const listHelper = require('../utils/list_helper')
const helper = require('./test_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('totalLikes', () => {
  test('of empty array is zero', () => {
    expect(listHelper.totalLikes([])).toBe(0)
  })

  test('of one blog is the likes of the blog', () => {
    const result = listHelper.totalLikes(helper.oneBlog)
    expect(result).toBe(7)
  })

  test('calculates likes correctly', () => {
    const result = listHelper.totalLikes(helper.initialBlogs)
    expect(result).toBe(8)
  })
})

describe('favoriteBlog', () => {
  test('of an empty list returns null', () => {
    const result = listHelper.favoriteBlog([])
    expect(result).toBe(null)
  })

  test('of list with one blog returns that blog', () => {
    const result = listHelper.favoriteBlog(helper.oneBlog )
    expect(result).toEqual(helper.oneBlog[0])
  })

  test('of list with many blogs returns most liked blog', () => {
    const result = listHelper.favoriteBlog(helper.initialBlogs)
    expect(result).toEqual(helper.initialBlogs[1])
  })
})
