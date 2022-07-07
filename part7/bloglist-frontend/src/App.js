import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Routes, Route, useMatch } from 'react-router-dom'
import Blogs from './components/Blogs'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import {
  setNotification,
  nullNotification,
} from './reducers/notificationReducer'
import { initializeUsers } from './reducers/usersReducer'
import { initializeBlogs, likeBlog, deleteBlog } from './reducers/blogReducer'
import { setLoggedUser } from './reducers/loggedReducer'
import Users from './components/Users'
import User from './components/User'
import Blogview from './components/Blogview'
import Navigation from './components/Navigation'
import Header from './components/Header'

const App = () => {
  const dispatch = useDispatch()
  const notification = useSelector((state) => state.notification)
  const user = useSelector((state) => state.logged)
  const blogs = useSelector((state) => state.blogs)
  const users = useSelector((state) => state.users)

  useEffect(() => {
    dispatch(initializeUsers())
  }, [dispatch])

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogsUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(setLoggedUser(user))
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
      dispatch(setLoggedUser(user))
    } catch (exception) {
      dispatch(setNotification('Error: Username or password incorrect'))
      setTimeout(() => {
        dispatch(nullNotification())
      }, 5000)
    }
  }

  const handleLogout = () => {
    dispatch(setLoggedUser(null))
    window.localStorage.removeItem('loggedBlogsUser')
    dispatch(setNotification('Logged out'))
    setTimeout(() => {
      dispatch(nullNotification())
    }, 5000)
  }

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
    const blogToDelete = await blogs.find((b) => b.id === id)
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

  const userMatch = useMatch('/users/:id')
  const userByID = userMatch
    ? users.find((u) => u.id === userMatch.params.id)
    : null

  const blogMatch = useMatch('/blogs/:id')
  const blogByID = blogMatch
    ? blogs.find((b) => b.id === blogMatch.params.id)
    : null
  let isCreator
  if (blogByID && user) {
    isCreator = blogByID.user.username === user.username
  } else {
    isCreator = false
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
      <Header user={user} logout={handleLogout} />
      <Notification message={notification} />

      <Routes>
        <Route
          path='/blogs/:id'
          element={
            <Blogview
              blogByID={blogByID}
              giveLike={giveLike}
              isCreator={isCreator}
              handleRemove={handleRemove}
            />
          }
        />
        <Route path='/users/:id' element={<User userByID={userByID} />} />
        <Route path='/users' element={<Users users={users} />} />
        <Route path='/' element={<Blogs />} />
      </Routes>
    </div>
  )
}

export default App
