import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [blogUrl, setBlogUrl] = useState('')
  const [notification, setNotification] = useState(null)

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

  const addBlog = async (event) => {
    event.preventDefault()
    const blogObject = {
      title: title,
      author: author,
      url: blogUrl
    }

    const newBlog = await blogService.create(blogObject)
    setBlogs(blogs.concat(newBlog))
    setNotification(`Added new blog: "${title}" by ${author}`)
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    setTitle('')
    setAuthor('')
    setBlogUrl('')
  }

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

  const newBlogForm = () => (
    <form onSubmit={addBlog}>
      <div>
        <label>Blog title:
          <input
          type="text"
          value={title}
          name="Title"
          onChange={({ target }) => setTitle(target.value)}
        />
        </label>
      </div>
      <div>
        <label>Author:
          <input
          type="text"
          value={author}
          name="Author"
          onChange={({ target }) => setAuthor(target.value)}
        />
        </label>
      </div>
      <div>
        <label>Blog url:
          <input
          type="text"
          value={blogUrl}
          name="Url"
          onChange={({ target }) => setBlogUrl(target.value)}
        />
        </label>
      </div>
      <button type="submit">Add blog</button>
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
      <button onClick={handleLogout}>Logout</button>
      <h3>Add a new blog</h3>
      {newBlogForm()}
      <br/>
      <div>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}
      </div>
      
    </div>
  )
}

export default App
