import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import NewBlogForm from './components/NewBlogForm'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogsUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password
      })

      window.localStorage.setItem(
        'loggedBlogsUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setNotification('Error: Username or password incorrect')
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('loggedBlogsUser')
    setNotification('Logged out')
      setTimeout(() => {
        setNotification(null)
      }, 5000)
  }

  const addBlog = async (blogObject) => {
    // Add try-catch
    const newBlog = await blogService.create(blogObject)
    setBlogs(blogs.concat(newBlog))
    blogFormRef.current.toggleVisibility()
    setNotification(`Added new blog: "${blogObject.title}" by ${blogObject.author}`)
      setTimeout(() => {
        setNotification(null)
      }, 5000)
  }

  const newBlogForm = () => (
    <Togglable buttonLabel="Add new blog" ref={blogFormRef}>
      <NewBlogForm addNewBlog={addBlog} />
    </Togglable>
  )

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        <label>Username:
          <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
          />
        </label>
      </div>
      <div>
        <label>Password:
          <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
          />
        </label>
      </div>
      <button type="submit">Login</button>
    </form>
  )

  const giveLike = async (id) => {
    const indexOfBlogToLike = blogs.findIndex(b => b.id === id)
    const blogToLike = blogs[indexOfBlogToLike]
    const newLikes = blogToLike.likes + 1
    const change = { likes: newLikes }
    try {
      await blogService.update(id, change)
      const newBlogs = [
        ...blogs.slice(0, indexOfBlogToLike),
        { ...blogToLike, likes: newLikes },
        ...blogs.slice(indexOfBlogToLike + 1)
      ]
      setBlogs(newBlogs)
    } catch (exception) {
      setNotification('Error: Failed to add like')
      setTimeout(() => {
        setNotification(null)
      }, 5000)
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
      <button onClick={handleLogout}>Logout</button>
      {newBlogForm()}
      <br/>
      <div>
        {blogs.map(blog =>
          <Blog
            key={blog.id}
            blog={blog}
            handleLike={() => giveLike(blog.id)}
          />
        )}
      </div>
      
    </div>
  )
}

export default App
