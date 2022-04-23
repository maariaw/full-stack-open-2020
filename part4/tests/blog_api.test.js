const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')
const Blog = require('../models/blog')
const helper = require('./test_helper')

beforeEach(async () => {
  await Blog.deleteMany({})
  for (let blog of helper.initialBlogs) {
    let blogObject = new Blog(blog)
    await blogObject.save()
  }
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

describe('updating the properties of an existing blog', () => {
  test('succeeds with valid properties', async () => {
    const initializedBlogs = await helper.blogsInDb()
    const blogToChange = initializedBlogs[1]

    const validUpdate = {
      author: 'Ray Redo',
      title: 'I was mistaken',
      url: 'this is a website',
      likes: 3
    }

    await api
      .put(`/api/blogs/${blogToChange.id}`)
      .send(validUpdate)
      .expect(200)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)

    const updatedBlog = await Blog.findById(blogToChange.id)

    expect(updatedBlog.title).toBe(validUpdate.title)
    expect(updatedBlog.author).toBe(validUpdate.author)
    expect(updatedBlog.url).toBe(validUpdate.url)
    expect(updatedBlog.likes).toBe(validUpdate.likes)

    // const titles = blogsAtEnd.map(b => b.title)
    // expect(titles).toContain(validUpdate.title)

    // const authors = blogsAtEnd.map(b => b.author)
    // expect(authors).toContain(validUpdate.author)

    // const urls = blogsAtEnd.map(b => b.url)
    // expect(urls).toContain(validUpdate.url)
  })

  test('retains unchanged properties', async () => {
    const initializedBlogs = await helper.blogsInDb()
    const blogToChange = initializedBlogs[1]

    const partialUpdate = {
      likes: 4,
    }

    await api
      .put(`/api/blogs/${blogToChange.id}`)
      .send(partialUpdate)
      .expect(200)

    const updatedBlog = await Blog.findById(blogToChange.id)

    expect(updatedBlog.title).toBe(blogToChange.title)
    expect(updatedBlog.author).toBe(blogToChange.author)
    expect(updatedBlog.url).toBe(blogToChange.url)
    expect(updatedBlog.likes).toBe(partialUpdate.likes)
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

describe('with one initial user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('huonosalasana', 10)
    const user = new User({ username: 'hyyppä', passwordHash })

    await user.save()
  })

  test('a new user can be created with another username', async () => {
    const initialUsers = await helper.usersInDb()

    const newUser = {
      username: 'heppu',
      name: 'Heppu Hyppönen',
      password: 'h1t0nHYVÄslsn'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersNow = await helper.usersInDb()
    expect(usersNow).toHaveLength(initialUsers.length + 1)

    const usernames = usersNow.map(user => user.username)
    expect(usernames).toContain(newUser.username)
  })

  test('adding user without username and password results in error', async () => {
    const initialUsers = await helper.usersInDb()

    const missingUsername = {
      name: 'Heppu Hyppönen',
      password: 'h1t0nHYVÄslsn'
    }
    const missingPassword = {
      username: 'heppu',
      name: 'Heppu Hoppinen'
    }

    const resultUsername = await api
      .post('/api/users')
      .send(missingUsername)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(resultUsername.body.error).toContain('username missing')

    const resultPassword = await api
      .post('/api/users')
      .send(missingPassword)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(resultPassword.body.error).toContain('password missing')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(initialUsers)
  })

  test('adding user with username or password too short results in error', async () => {
    const initialUsers = await helper.usersInDb()

    const shortUsername = {
      username: 'hh',
      name: 'Heppu Hyppönen',
      password: 'h1t0nHYVÄslsn'
    }
    const shortPassword = {
      username: 'heppu',
      name: 'Heppu Hoppinen',
      password: 'pw'
    }

    const resultUsername = await api
      .post('/api/users')
      .send(shortUsername)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(resultUsername.body.error).toContain('username under 3 characters')

    const resultPassword = await api
      .post('/api/users')
      .send(shortPassword)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(resultPassword.body.error).toContain('password under 3 characters')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(initialUsers)
  })

  test('adding user with already existing username results in error', async () => {
    const initialUsers = await helper.usersInDb()

    const newUser = {
      username: 'hyyppä',
      name: 'Heini Heppunen',
      password: 'hsdhf878dggd((/hfs',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('username must be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(initialUsers)
  })
})

afterAll(() => {
  mongoose.connection.close()
})
