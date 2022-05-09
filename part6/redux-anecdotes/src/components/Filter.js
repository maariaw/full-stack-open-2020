import { connect } from 'react-redux'
import { setFilter } from "../reducers/filterReducer"

const Filter = (props) => {
  const style = {
    marginBottom: 10
  }

  return (
    <div style={style}>
      Filter: <input onChange={
        (event) => props.setFilter(event.target.value)
      } />
    </div>
  )
}

const ConnectedFilter = connect(
  null,
  { setFilter }
)(Filter)
export default ConnectedFilter