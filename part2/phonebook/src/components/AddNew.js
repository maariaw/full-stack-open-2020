import React from 'react'

const AddNew = (props) => (
    <form onSubmit={props.onFormSubmit}>
        <div>
            name:
            <input
                value={props.nameValue}
                onChange={props.onNameChange}
            />
            <div>
                number:
              <input
                    value={props.numberValue}
                    onChange={props.onNumberChange}
                />
            </div>
        </div>
        <div>
            <button type="submit">add</button>
        </div>
    </form>
)

export default AddNew