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
              type='text'
              value={title}
              data-cy='title'
              onChange={({ target }) => setTitle(target.value)}
            />
          </label>
        </div>
        <div>
          <label>Author:
            <input
              type='text'
              value={author}
              data-cy='author'
              onChange={({ target }) => setAuthor(target.value)}
            />
          </label>
        </div>
        <div>
          <label>Blog url:
            <input
              type='text'
              value={blogUrl}
              data-cy='url'
              onChange={({ target }) => setBlogUrl(target.value)}
            />
          </label>
        </div>
        <button type='submit' data-cy='createblog'>Add blog</button>
      </form>
    </div>
  )
}

export default NewBlogForm
