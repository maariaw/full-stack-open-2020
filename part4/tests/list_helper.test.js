const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('totalLikes', () => {
  const listWithOneBlog = [
    {
      _id: '60a793fe1fe845a711cf58a7',
      title: 'My Fair Lady',
      author: 'Hippo Potamus',
      url: 'this is a website',
      likes: 7,
      __v: 0
    }
  ]

  const listWithManyBlogs = [
    {
      _id: '60a793fe1fe845a711cf58a7',
      title: 'My Fair Lady',
      author: 'Hippo Potamus',
      url: 'this is a website',
      likes: 2,
      __v: 0
    },
    {
      _id: '60a7999b2491e2addc9c1d7c',
      title: 'More Cowbell',
      author: 'Clint Eastwood',
      url: 'this is a website',
      likes: 5,
      __v: 0
    },
    {
      _id: '60a79ea79680e2b1f8a353e6',
      title: 'Che check',
      author: 'Neil Young',
      url: 'this is a website',
      likes: 1,
      __v: 0
    }
  ]

  test('of empty array is zero', () => {
    expect(listHelper.totalLikes([])).toBe(0)
  })

  test('of one blog is the likes of the blog', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    expect(result).toBe(7)
  })

  test('calculates likes correctly', () => {
    const result = listHelper.totalLikes(listWithManyBlogs)
    expect(result).toBe(8)
  })
})

describe('favoriteBlog', () => {
  const listWithOneBlog = [
    {
      _id: '60a793fe1fe845a711cf58a7',
      title: 'My Fair Lady',
      author: 'Hippo Potamus',
      url: 'this is a website',
      likes: 7,
      __v: 0
    }
  ]

  const listWithManyBlogs = [
    {
      _id: '60a793fe1fe845a711cf58a7',
      title: 'My Fair Lady',
      author: 'Hippo Potamus',
      url: 'this is a website',
      likes: 2,
      __v: 0
    },
    {
      _id: '60a7999b2491e2addc9c1d7c',
      title: 'More Cowbell',
      author: 'Clint Eastwood',
      url: 'this is a website',
      likes: 5,
      __v: 0
    },
    {
      _id: '60a79ea79680e2b1f8a353e6',
      title: 'Che check',
      author: 'Neil Young',
      url: 'this is a website',
      likes: 1,
      __v: 0
    }
  ]

  test('of an empty list returns null', () => {
    const result = listHelper.favoriteBlog([])
    expect(result).toBe(null)
  })

  test('of list with one blog returns that blog', () => {
    const result = listHelper.favoriteBlog(listWithOneBlog)
    expect(result).toEqual(
      {
        _id: '60a793fe1fe845a711cf58a7',
        title: 'My Fair Lady',
        author: 'Hippo Potamus',
        url: 'this is a website',
        likes: 7,
        __v: 0
      }
    )
  })

  test('of list with many blogs returns most liked blog', () => {
    const result = listHelper.favoriteBlog(listWithManyBlogs)
    expect(result).toEqual(
      {
        _id: '60a7999b2491e2addc9c1d7c',
        title: 'More Cowbell',
        author: 'Clint Eastwood',
        url: 'this is a website',
        likes: 5,
        __v: 0
      }
    )
  })
})
