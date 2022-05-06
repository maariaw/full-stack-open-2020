import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  text: 'This is a default notification',
  visible: false
}

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setText(state, action) {
      return { ...state, text: action.payload }
    },
    setOn(state) {
      return {...state, visible: true}
    },
    setOff(state) {
      return {...state, visible: false}
    }
  }
})

export const { setText, setOn, setOff } = notificationSlice.actions
export default notificationSlice.reducer