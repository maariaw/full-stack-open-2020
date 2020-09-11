import React from 'react'

const Filter = (props) => {
    return (
      <label htmlFor="filter">
        Filter shown with: 
        <input
          id="filter"
          value={props.value}
          onChange={props.onChange}
        />
      </label>
    )
  }

export default Filter