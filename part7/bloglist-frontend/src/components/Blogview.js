import Comments from './Comments'

const Blogview = ({ blogByID, giveLike, isCreator, handleRemove }) => {
  const buttonStyle = {
    marginLeft: 10,
    marginBottom: 5,
  }

  if (!blogByID) {
    return null
  }

  return (
    <div>
      <h3>{blogByID.title}</h3>
      <h4>by {blogByID.author}</h4>
      <a href={blogByID.url}>{blogByID.url}</a>
      <p data-testid='likes'>
        Likes: {blogByID.likes}
        <button style={buttonStyle} onClick={() => giveLike(blogByID.id)}>
          Like
        </button>
      </p>
      <p>Added by {blogByID.user.name}</p>
      {isCreator && (
        <button
          style={buttonStyle}
          onClick={() => handleRemove(blogByID.id)}
          data-cy='delete'
        >
          Remove
        </button>
      )}
      <Comments blog={blogByID} />
    </div>
  )
}

export default Blogview
