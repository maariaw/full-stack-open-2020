const notificationReducer = (state = null, action) => {
  switch (action.type) {
    case 'SET_NOTIFICATION':
      return action.data
    case 'SET_NULL':
      return null
    default:
      return state
  }
}

export const setNotification = (message) => {
  return {
    type: 'SET_NOTIFICATION',
    data: message,
  }
}

export const nullNotification = () => {
  return {
    type: 'SET_NULL',
  }
}

export default notificationReducer
