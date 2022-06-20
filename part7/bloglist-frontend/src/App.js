import { useState, useEffect, useRef } from 'react'
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
import { useSelector, useDispatch } from 'react-redux'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const blogFormRef = useRef()

  const dispatch = useDispatch()
  const notification = useSelector((state) => state)

  useEffect(() => {
    blogService
      .getAll()
      .then((blogs) => blogs.sort(sortByLikes))
      .then((blogs) => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogsUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const sortByLikes = (a, b) => b.likes - a.likes

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username,
        password,
      })

      window.localStorage.setItem('loggedBlogsUser', JSON.stringify(user))

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      dispatch(setNotification('Error: Username or password incorrect'))
      setTimeout(() => {
        dispatch(nullNotification())
      }, 5000)
    }
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('loggedBlogsUser')
    dispatch(setNotification('Logged out'))
    setTimeout(() => {
      dispatch(nullNotification())
    }, 5000)
  }

  const addBlog = async (blogObject) => {
    try {
      const newBlog = await blogService.create(blogObject)
      newBlog.user = user
      setBlogs(blogs.concat(newBlog))
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
          <input
            type='text'
            value={username}
            data-cy='username'
            onChange={({ target }) => setUsername(target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Password:
          <input
            type='password'
            value={password}
            data-cy='password'
            onChange={({ target }) => setPassword(target.value)}
          />
        </label>
      </div>
      <button type='submit' data-cy='login'>
        Login
      </button>
    </form>
  )

  const giveLike = async (id) => {
    const indexOfBlogToLike = blogs.findIndex((b) => b.id === id)
    const blogToLike = blogs[indexOfBlogToLike]
    const newLikes = blogToLike.likes + 1
    const change = { likes: newLikes }
    try {
      await blogService.update(id, change)
      const newBlogs = [
        ...blogs.slice(0, indexOfBlogToLike),
        { ...blogToLike, likes: newLikes },
        ...blogs.slice(indexOfBlogToLike + 1),
      ]
      newBlogs.sort(sortByLikes)
      setBlogs(newBlogs)
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
        await blogService.remove(id)
        setBlogs(blogs.filter((b) => b.id !== id))
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