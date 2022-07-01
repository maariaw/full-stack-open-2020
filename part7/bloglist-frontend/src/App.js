import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Routes, Route, Link, useMatch } from 'react-router-dom'
import Blogs from './components/Blogs'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import {
  setNotification,
  nullNotification,
} from './reducers/notificationReducer'
import { initializeUsers } from './reducers/usersReducer'
import { setLoggedUser } from './reducers/loggedReducer'
import Users from './components/Users'
import User from './components/User'

const App = () => {
  const dispatch = useDispatch()
  const notification = useSelector((state) => state.notification)
  const user = useSelector((state) => state.logged)
  const users = useSelector((state) => state.users)

  useEffect(() => {
    dispatch(initializeUsers())
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

  const match = useMatch('/users/:id')
  const userByID = match ? users.find((u) => u.id === match.params.id) : null

  const padding = {
    padding: 5,
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
      <div>
        <Link style={padding} to='/'>
          Blogs
        </Link>
        <Link style={padding} to='/users'>
          Users
        </Link>
      </div>
      <Notification message={notification} />
      <p>{user.name} logged in</p>
      <button onClick={handleLogout} data-cy='logout'>
        Logout
      </button>

      <Routes>
        <Route path='/users/:id' element={<User userByID={userByID} />} />
        <Route path='/users' element={<Users users={users} />} />
        <Route path='/' element={<Blogs />} />
      </Routes>
    </div>
  )
}

export default App
