import { useSelector, useDispatch } from 'react-redux'
import { addVote } from '../reducers/anecdoteReducer'
import { setText, setOn, setOff } from '../reducers/notificationReducer'

const AnecdoteList = (props) => {
  const unsortedAnecdotes = useSelector(state =>
    state.anecdotes
  )
  const anecdotes =  [...unsortedAnecdotes].sort((a, b) => b.votes - a.votes)
  const dispatch = useDispatch()

  const vote = (id) => {
    const anecdote = anecdotes.find(a => (a.id === id))
    dispatch(addVote(id))
    dispatch(setText(`You gave a vote to: "${anecdote.content}"`))
    dispatch(setOn())
    setTimeout(() => {
      dispatch(setOff())
    }, 5000)
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