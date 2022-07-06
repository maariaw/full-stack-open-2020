const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const Comment = require('../models/comment')
const userExtractor = require('../utils/middleware').userExtractor

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
    .populate('user', { username: 1, name: 1 })
    .populate('comments', { content: 1 })

  response.json(blogs)
})

blogsRouter.post('/', userExtractor, async (request, response) => {
  const body = request.body
  if (!request.user) {
    return response.status(401).json({ error: 'missing or invalid token' })
  }
  const user = await User.findById(request.user)

  if (body.title === undefined) {
    return response.status(400).json({
      error: 'title missing',
    })
  }
  if (body.url === undefined) {
    return response.status(400).json({
      error: 'url missing',
    })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes === undefined ? 0 : body.likes,
    user: user._id,
    comments: [],
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(204).end()
  }

  const userId = request.user
  if (!(userId && blog.user.toString() === userId.toString())) {
    return response.status(401).json({ error: 'missing or invalid token' })
  }

  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body
  const oldBlog = await Blog.findById(request.params.id)

  const blog = {
    author: body.author || oldBlog.author,
    title: body.title || oldBlog.title,
    url: body.url || oldBlog.url,
    likes: body.likes || oldBlog.likes,
    user: oldBlog.user,
    comments: body.comments || oldBlog.comments,
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
  })

  response.status(200).json(updatedBlog)
})

blogsRouter.post('/:id/comments', userExtractor, async (request, response) => {
  if (!request.user) {
    return response.status(401).json({ error: 'missing or invalid token' })
  }
  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(401).json({ error: 'invalid blog id' })
  }

  const body = request.body
  if (body.content === undefined) {
    return response.status(400).json({
      error: 'content missing',
    })
  }

  const comment = new Comment({
    content: body.content,
  })
  const savedComment = await comment.save()

  blog.comments = blog.comments.concat(savedComment._id)
  await blog.save()

  response.status(201).json(comment)
})

module.exports = blogsRouter
