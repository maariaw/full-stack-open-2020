import { useEffect } from 'react'
import Blogs from './components/Blogs'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import {
  setNotification,
  nullNotification,
} from './reducers/notificationReducer'
import { setUser } from './reducers/userReducer'
import { useSelector, useDispatch } from 'react-redux'

const App = () => {
  const dispatch = useDispatch()
  const notification = useSelector((state) => state.notification)
  const blogs = useSelector((state) => state.blogs)
  const user = useSelector((state) => state.user)

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
      <Blogs />
    </div>
  )
}

export default App
