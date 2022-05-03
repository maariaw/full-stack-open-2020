const Notification = ({ message }) => {
  if (message == null) {
    return null
  }

  const redStyle = {
    color: 'Red'
  }
  const greenstyle = {
    color: 'Green'
  }
  const style = message.includes('Error')
    ? redStyle
    : greenstyle

  return (
    <div>
      <p style={style}>{message}</p>
    </div>
  )
}

export default Notification
