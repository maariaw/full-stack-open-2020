import { useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import NewBlogForm from './components/NewBlogForm'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'
import {
  setNotification,
  nullNotification,
} from './reducers/notificationReducer'
import {
  initializeBlogs,
  likeBlog,
  deleteBlog,
  createBlog,
} from './reducers/blogReducer'
import { setUser } from './reducers/userReducer'
import { useSelector, useDispatch } from 'react-redux'

const App = () => {
  const blogFormRef = useRef()

  const dispatch = useDispatch()
  const notification = useSelector((state) => state.notification)
  const blogs = useSelector((state) => state.blogs)
  const user = useSelector((state) => state.user)

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogsUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(setUser(user))
      blogService.setToken(user.token)
    }
  }, [dispatch])

  const handleLogin = async (event) => {
    event.preventDefault()
    const username = event.target.username.value
    const password = event.target.password.value
    try {
      const user = await loginService.login({
        username,
        password,
      })

      window.localStorage.setItem('loggedBlogsUser', JSON.stringify(user))

      blogService.setToken(user.token)
      dispatch(setUser(user))
    } catch (exception) {
      dispatch(setNotification('Error: Username or password incorrect'))
      setTimeout(() => {
        dispatch(nullNotification())
      }, 5000)
    }
  }

  const handleLogout = () => {
    dispatch(setUser(null))
    window.localStorage.removeItem('loggedBlogsUser')
    dispatch(setNotification('Logged out'))
    setTimeout(() => {
      dispatch(nullNotification())
    }, 5000)
  }

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

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        <label>
          Username:
          <input type='text' name='username' data-cy='username' />
        </label>
      </div>
      <div>
        <label>
          Password:
          <input type='password' name='password' data-cy='password' />
        </label>
      </div>
      <button type='submit' data-cy='login'>
        Login
      </button>
    </form>
  )

  const giveLike = async (id) => {
    try {
      dispatch(likeBlog(id))
    } catch (exception) {
      dispatch(setNotification('Error: Failed to add like'))
      setTimeout(() => {
        dispatch(nullNotification())
      }, 5000)
    }
  }

  const handleRemove = async (id) => {
    const blogToDelete = blogs.find((b) => b.id === id)
    const confirmText = `Are you sure you want to remove this blog:
    "${blogToDelete.title}" by ${blogToDelete.author}`
    if (window.confirm(confirmText)) {
      try {
        dispatch(deleteBlog(id))
        dispatch(
          setNotification(
            `Removed blog "${blogToDelete.title}" by ${blogToDelete.author}`
          )
        )
        setTimeout(() => {
          dispatch(nullNotification())
        }, 5000)
      } catch (exception) {
        dispatch(setNotification('Error: Failed to remove blog'))
        setTimeout(() => {
          dispatch(nullNotification())
        }, 5000)
      }
    }
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to Blogs application</h2>
        <Notification message={notification} />
        {loginForm()}
      </div>
    )
  }

  return (
    <div>
      <h2>Blogs</h2>
      <Notification message={notification} />
      <p>{user.name} logged in</p>
      <button onClick={handleLogout} data-cy='logout'>
        Logout
      </button>
      {newBlogForm()}
      <br />
      <div>
        {blogs.map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            handleLike={() => giveLike(blog.id)}
            isCreator={user.username === blog.user.username}
            handleRemove={() => handleRemove(blog.id)}
          />
        ))}
      </div>
    </div>
  )
}

export default App
