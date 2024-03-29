import { useState } from 'react'

const Blog = ({ blog, handleLike, isCreator, handleRemove }) => {
  const [viewDetails, setViewDetails] = useState(false)

  const toggleDetail = () => {
    setViewDetails(!viewDetails)
  }

  const blogStyle = {
    paddingTop: 5,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const buttonStyle = {
    marginLeft: 10,
    marginBottom: 5
  }

  if (!viewDetails) {
    return (
      <div style={blogStyle} data-cy='blog'>
        <p>
          <b>{blog.title}</b> by {blog.author}
          <button onClick={toggleDetail} style={buttonStyle}>View</button>
        </p>
      </div>
    )
  }

  const details = (
    <div style={blogStyle} data-cy='blog'>
      <p>
        <b>{blog.title}</b> by {blog.author}
        <button onClick={toggleDetail} style={buttonStyle}>Hide</button>
      </p>
      <p>{blog.url}</p>
      <p data-testid='likes'>
        Likes: {blog.likes}
        <button style={buttonStyle} onClick={handleLike}>
            Like
        </button>
      </p>
      <p>{blog.user.name}</p>
      { isCreator &&
        <button style={buttonStyle} onClick={handleRemove} data-cy='delete'>
          Remove
        </button>
      }
    </div>
  )


  return details
}

export default Blog