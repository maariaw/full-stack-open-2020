import { useDispatch } from 'react-redux'
import { commentBlog } from '../reducers/blogReducer'
import {
  nullNotification,
  setNotification,
} from '../reducers/notificationReducer'

const Comments = ({ blog }) => {
  const dispatch = useDispatch()

  const postComment = async (event) => {
    event.preventDefault()
    const comment = {
      content: event.target.comment.value,
    }
    event.target.comment.value = ''
    try {
      dispatch(commentBlog(blog.id, comment))
      dispatch(setNotification(`Added new comment: "${comment.content}`))
      setTimeout(() => {
        dispatch(nullNotification())
      }, 5000)
    } catch (exception) {
      dispatch(setNotification('Error: Failed to add comment'))
      setTimeout(() => {
        dispatch(nullNotification())
      }, 5000)
    }
  }

  return (
    <div>
      <h4>Comments</h4>
      <form onSubmit={postComment}>
        <input type='text' name='comment' />
        <button type='submit'>Add comment</button>
      </form>
      <ul>
        {blog.comments.map((comment) => (
          <li key={comment.id}>{comment.content}</li>
        ))}
      </ul>
    </div>
  )
}

export default Comments
