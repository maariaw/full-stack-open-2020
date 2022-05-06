import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    replaceAnecdote(state, action) {
      const id = action.payload.id
      return state.map(anecdote =>
        anecdote.id !== id ? anecdote : action.payload
      )
    },
    appendAnecdote(state, action) {
      state.push(action.payload)
    },
    setAnecdotes(state, action) {
      return action.payload
    }
  }
})

export const { replaceAnecdote, appendAnecdote, setAnecdotes } = anecdoteSlice.actions

export const initAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const addAnecdote = content => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(appendAnecdote(newAnecdote))
  }
}

export const addVote = id => {
  return async dispatch => {
    const response = await anecdoteService.get(id)
    const object = {...response, votes: response.votes + 1}
    const votedAnecdote = await anecdoteService.update(id, object)
    dispatch(replaceAnecdote(votedAnecdote))
  }
}

export default anecdoteSlice.reducer