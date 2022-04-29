import { useState } from 'react'

const Blog = ({blog}) => {
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
    marginLeft: 10
  }

  if (!viewDetails) {
    return (
      <div style={blogStyle}>
      <p>
      <b>{blog.title}</b> by {blog.author}
      <button onClick={toggleDetail} style={buttonStyle}>View</button>
      </p>
    </div>
    )
  }

  return (
    <div style={blogStyle}>
      <p>
        <b>{blog.title}</b> by {blog.author}
      <button onClick={toggleDetail} style={buttonStyle}>Hide</button>
      </p>
      <p>{blog.url}</p>
      <p>{blog.likes} <button style={buttonStyle}>Like</button></p>
      <p>{blog.user.name}</p>
    </div>
  )
}

export default Blog