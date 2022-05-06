import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  text: 'This is a default notification',
  visible: false
}

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setOn(state, action) {
      return { text: action.payload, visible: true }
    },
    setOff(state) {
      return {...state, visible: false}
    }
  }
})

export const { setOn, setOff } = notificationSlice.actions

export const setNotification = (text, time) => {
  return async dispatch => {
    const delay = time * 1000
    dispatch(setOn(text))
    setTimeout(() => {
      dispatch(setOff())
    }, delay)
  }
}

export default notificationSlice.reducer