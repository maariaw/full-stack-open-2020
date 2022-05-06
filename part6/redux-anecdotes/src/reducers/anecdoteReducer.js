import { createSlice } from '@reduxjs/toolkit'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    addVote(state, action) {
      const id = action.payload
      const anecdoteToVote = state.find(a => a.id === id)
      const votedAnecdote = {
        ...anecdoteToVote,
        votes: anecdoteToVote.votes + 1
      }
      return state.map(anecdote =>
        anecdote.id !== id ? anecdote : votedAnecdote
      )
    },
    addAnecdote(state, action) {
      state.push(action.payload)
    },
    initAnecdotes(state, action) {
      return action.payload
    }
  }
})

export const { addVote, addAnecdote, initAnecdotes } = anecdoteSlice.actions
export default anecdoteSlice.reducer