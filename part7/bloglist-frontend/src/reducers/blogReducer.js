import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    setBlogs(state, action) {
      return sortByLikes(action.payload)
    },
    appendBlog(state, action) {
      state.push(action.payload)
    },
    updateBlog(state, action) {
      const blogToUpdate = action.payload
      const blogUpdated = state.map((blog) =>
        blog.id !== blogToUpdate.id ? blog : blogToUpdate
      )
      return sortByLikes(blogUpdated)
    },
    removeBlog(state, action) {
      const id = action.payload
      return state.filter((b) => b.id !== id)
    },
  },
})

const sortByLikes = (bloglist) => {
  return bloglist.sort((a, b) => b.likes - a.likes)
}

export const { setBlogs, appendBlog, updateBlog, removeBlog } =
  blogSlice.actions

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll()
    dispatch(setBlogs(blogs))
  }
}

export const createBlog = (blog, user) => {
  return async (dispatch) => {
    const newBlog = await blogService.create(blog)
    newBlog.user = user
    dispatch(appendBlog(newBlog))
  }
}

export const likeBlog = (id) => {
  return async (dispatch, getState) => {
    const blogToLike = getState().blogs.find((b) => b.id === id)
    const change = { likes: blogToLike.likes + 1 }
    await blogService.update(id, change)
    const likedBlog = {
      ...blogToLike,
      likes: blogToLike.likes + 1,
    }
    dispatch(updateBlog(likedBlog))
  }
}

export const deleteBlog = (id) => {
  return async (dispatch) => {
    await blogService.remove(id)
    dispatch(removeBlog(id))
  }
}

export const commentBlog = (id, comment) => {
  return async (dispatch, getState) => {
    comment = await blogService.addComment(id, comment)
    const blogToComment = getState().blogs.find((b) => b.id === id)
    const commentedBlog = {
      ...blogToComment,
      comments: blogToComment.comments.concat(comment),
    }
    dispatch(updateBlog(commentedBlog))
  }
}

export default blogSlice.reducer
