import { createSlice } from '@reduxjs/toolkit'

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
    likeBlog(state, action) {
      const id = action.payload
      const blogToLike = state.find((b) => b.id === id)

      const likedBlog = {
        ...blogToLike,
        likes: blogToLike.likes + 1,
      }

      const blogReplaced = state.map((blog) =>
        blog.id !== id ? blog : likedBlog
      )
      return sortByLikes(blogReplaced)
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

export const { setBlogs, appendBlog, likeBlog, removeBlog } = blogSlice.actions

export default blogSlice.reducer
