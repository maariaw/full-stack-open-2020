const Blog = require('../models/blog')

const initialBlogs = [
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

const oneBlog = [
  {
    _id: '60a793fe1fe845a711cf58a7',
    title: 'My Fair Lady',
    author: 'Hippo Potamus',
    url: 'this is a website',
    likes: 7,
    __v: 0
  }
]

const blogToPost = {
  title: 'From Never-Never to Narnia',
  author: 'Julius Dresden',
  url: 'this is a website',
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs,
  oneBlog,
  blogToPost,
  blogsInDb
}
