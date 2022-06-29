import { createSlice } from '@reduxjs/toolkit'

const loggedSlice = createSlice({
  name: 'logged',
  initialState: null,
  reducers: {
    setLoggedUser(state, action) {
      return action.payload
    },
  },
})

export const { setLoggedUser } = loggedSlice.actions

export default loggedSlice.reducer
