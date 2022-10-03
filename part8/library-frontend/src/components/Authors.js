import { ALL_AUTHORS } from '../queries'
import { useMutation, useQuery } from '@apollo/client'
import { useState } from 'react'
import { EDIT_AUTHOR } from '../mutations'
import Select from 'react-select'

const Authors = (props) => {
  const [name, setName] = useState('')
  const [year, setYear] = useState('')

  const result = useQuery(ALL_AUTHORS)
  const [ editAuthor ] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [ { query: ALL_AUTHORS } ]
  })

  if (!props.show) {
    return null
  }

  if (result.loading) {
    return <div>loading...</div>
  }

  const authors = result.data.allAuthors
  const options = authors.map((a) => ({ value: a.name, label: a.name }))

  const submit = async (event) => {
    event.preventDefault()
    editAuthor({ variables: { name:name.value, setBornTo:year } })

    setName('')
    setYear('')
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Set birthyear</h3>
      <form onSubmit={submit}>
        <div>
          Name
          <Select
            defaultValue={name}
            onChange={setName}
            options={options}
          />
        </div>
        <div>
          Born
          <input
          value={year}
          onChange={({ target }) => setYear(parseInt(target.value))}
          />
        </div>
        <button type="submit">Update author</button>
      </form>
    </div>
  )
}

export default Authors
