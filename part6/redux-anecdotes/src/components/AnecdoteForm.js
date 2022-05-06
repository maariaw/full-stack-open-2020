import { useDispatch } from 'react-redux'
import { addAnecdote } from '../reducers/anecdoteReducer'
import { setText, setOn, setOff } from '../reducers/notificationReducer'

const AnecdoteForm = (props) => {
  const dispatch = useDispatch()

  const addNew = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    dispatch(addAnecdote(content))
    dispatch(setText(`You added anecdote: "${content}"`))
    dispatch(setOn())
    setTimeout(() => {
      dispatch(setOff())
    }, 5000)
  }

  return (
    <div>
      <h2>Create new</h2>
      <form onSubmit={addNew}>
        <div><input name='anecdote'/></div>
        <button type='submit'>create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm