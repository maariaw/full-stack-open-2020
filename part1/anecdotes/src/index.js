import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const Header = ({ title }) => <h1>{title}</h1>

const Anecdote = ({ text, votes }) => (
  <p>
    {text}
    <br />
    has {votes} votes
  </p>
)

const BestAnecdote = ({ best }) => {
  if (best.votes === 0) {
    return <p>No votes yet</p>
  }

  return <Anecdote text={best.text} votes={best.votes} />
}

const App = ({ anecdotes }) => {
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(Array(anecdotes.length).fill(0))
  const [best, setBest] = useState({ text: '', votes: 0 })

  const handleClickNext = () => {
    setSelected(Math.floor(Math.random() * 6))
  }
  const handleClickVote = () => {
    const copy = [...votes]
    copy[selected] +=1
    if (copy[selected] > best.votes) {
      setBest({ text: anecdotes[selected], votes: copy[selected] })
    }
    setVotes(copy)
  }

  const day = 'Anecdote of the day'
  const most = 'Anecdote with most votes'

  return (
    <div>
      <Header title={day}/>
      <Anecdote text={anecdotes[selected]} votes={votes[selected]} />
      <button onClick={handleClickVote}>vote</button>
      <button onClick={handleClickNext}>next anecdote</button>
      <Header title={most}/>
      <BestAnecdote best={best} />
    </div>
  )
}

const anecdotes = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

ReactDOM.render(
  <App anecdotes={anecdotes} />,
  document.getElementById('root')
)