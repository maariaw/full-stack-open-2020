import { useSelector, useDispatch } from 'react-redux'
import { addVote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const AnecdoteList = (props) => {
  const unsortedAnecdotes = useSelector(state => state.anecdotes)
  const filter = useSelector(state => state.filter)
  const anecdotes = filter
    ? unsortedAnecdotes.filter(
        a => a.content.toLowerCase().includes(filter.toLowerCase())
      )
    : [...unsortedAnecdotes]
  anecdotes.sort((a, b) => b.votes - a.votes)

  const dispatch = useDispatch()

  const vote = (id) => {
    dispatch(addVote(id))
    const anecdote = anecdotes.find(a => (a.id === id))
    dispatch(setNotification(`You gave a vote to: "${anecdote.content}"`, 5))
  }

  return (
    <div>
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes} votes
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnecdoteList