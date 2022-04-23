const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body
  if (body.title === undefined) {
    return response.status(400).json({
      error: 'title missing'
    })
  }
  if (body.url === undefined) {
    return response.status(400).json({
      error: 'url missing'
    })
  }
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes === undefined
      ? 0
      : body.likes
  })

  const savedBlog = await blog.save()
  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
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
    likes: body.likes || oldBlog.likes
  }

  const updatedBlog = await Blog
    .findByIdAndUpdate(request.params.id, blog, { new: true })

  response.status(200).json(updatedBlog)
})

module.exports = blogsRouter
