const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('./test_helper')

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(helper.initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(helper.initialBlogs[1])
  await blogObject.save()
  blogObject = new Blog(helper.initialBlogs[2])
  await blogObject.save()
})

test('correct amount of blog posts returned as json', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('identifier property of a blog post is named "id"', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body[0].id).toBeDefined()
})

describe('posting', () => {
  test('a valid blog adds a blog', async () => {
    const newBlog = helper.blogToPost

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const contents = blogsAtEnd.map(b => b.title)
    expect(contents).toContain(helper.blogToPost.title)
  })

  test('a blog defaults a missing likes property to zero', async () => {
    const newBlog = helper.blogToPost

    const postedBlog = await api
      .post('/api/blogs')
      .send(newBlog)

    expect(postedBlog.body.likes).toBe(0)
  })

  test('a blog with missing properties does not go through', async () => {
    const blogMissingTitle = {
      author: 'Forgetful Fanny',
      url: 'this is a website'
    }
    const blogMissingUrl = {
      author: 'Scatterbrain Sam',
      title: 'Where is the internet?'
    }

    await api
      .post('/api/blogs')
      .send(blogMissingTitle)
      .expect(400)

    await api
      .post('/api/blogs')
      .send(blogMissingUrl)
      .expect(400)
  })
})

describe('deleting', () => {
  test('an existing blog removes the blog', async () => {
    const initializedBlogs = await helper.blogsInDb()
    const blogToRemove = initializedBlogs[1]

    await api
      .delete(`/api/blogs/${blogToRemove.id}`)
      .expect(204)

    const blogsNow = await helper.blogsInDb()

    expect(blogsNow).toHaveLength(helper.initialBlogs.length - 1)

    const titles = blogsNow.map(b => b.title)
    expect(titles).not.toContain(blogToRemove.title)
  })

  test('a non-existing blog returns status code 204', async () => {
    const validId = await helper.nonExistentId()

    await api
      .delete(`/api/blogs/${validId}`)
      .expect(204)
  })
})

afterAll(() => {
  mongoose.connection.close()
})
