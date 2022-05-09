import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  text: 'This is a default notification',
  visible: false,
  lastTimer: null
}

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setOn(state, action) {
      clearTimeout(state.lastTimer)
      return {
        text: action.payload.text,
        visible: true,
        lastTimer: action.payload.timeoutID
      }
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
    const timeoutID = setTimeout(() => {
      dispatch(setOff())
    }, delay)
    dispatch(setOn({ text, timeoutID }))
  }
}

export default notificationSlice.reducer