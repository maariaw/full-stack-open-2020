import { useState } from 'react'

const NewBlogForm = ({ addNewBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [blogUrl, setBlogUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    addNewBlog({
      title: title,
      author: author,
      url: blogUrl
    })
    setTitle('')
    setAuthor('')
    setBlogUrl('')
  }

  return (
    <div>
      <h3>Add a new blog</h3>
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
    </div>
  )
}

export default NewBlogForm
