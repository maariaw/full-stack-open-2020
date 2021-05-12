import React from 'react'

const Notification = ({type, message}) => {
    if (message === null) {
        return null
    }
    console.log(message)
    const style = {
        background: 'gainsboro',
        borderStyle: 'solid',
        borderRadius: 5,
        fontSize: 18,
        padding: 10,
        marginBottom: 10
    }
    if(type === 'error') {
        style['color'] = 'red'
    } else if (type === 'success') {
        style['color'] = 'green'
    }
    return (
        <div style={style}>
            <strong>{message}</strong>
        </div>
    )
}

export default Notification