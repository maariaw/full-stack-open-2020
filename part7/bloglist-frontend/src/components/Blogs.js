import { useEffect, useRef } from 'react'
import NewBlogForm from './NewBlogForm'
import Togglable from './Togglable'
import { useSelector, useDispatch } from 'react-redux'
import { initializeBlogs, createBlog } from '../reducers/blogReducer'
import {
  setNotification,
  nullNotification,
} from '../reducers/notificationReducer'
import { Link } from 'react-router-dom'
import { StyledBlogs } from './styles/Blogs.styled'
import { StyledBlogview } from './styles/Blogview.styled'

const Blogs = () => {
  const blogFormRef = useRef()
  const dispatch = useDispatch()
  const blogs = useSelector((state) => state.blogs)
  const user = useSelector((state) => state.logged)

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

  const addBlog = async (blogObject) => {
    try {
      dispatch(createBlog(blogObject, user))
      blogFormRef.current.toggleVisibility()
      dispatch(
        setNotification(
          `Added new blog: "${blogObject.title}" by ${blogObject.author}`
        )
      )
      setTimeout(() => {
        dispatch(nullNotification())
      }, 5000)
    } catch (exception) {
      dispatch(setNotification('Error: Failed to add blog'))
      setTimeout(() => {
        dispatch(nullNotification())
      }, 5000)
    }
  }

  const newBlogForm = () => (
    <Togglable buttonLabel='Add new blog' ref={blogFormRef}>
      <NewBlogForm addNewBlog={addBlog} />
    </Togglable>
  )

  return (
    <StyledBlogs>
      {newBlogForm()}
      <br />
      <div>
        {blogs.map((blog) => (
          <StyledBlogview
            as={Link}
            to={`/blogs/${blog.id}`}
            key={blog.id}
            data-cy='blog'
          >
            <strong>{blog.title}</strong>
            <br />
            by {blog.author}
          </StyledBlogview>
        ))}
      </div>
    </StyledBlogs>
  )
}

export default Blogs
