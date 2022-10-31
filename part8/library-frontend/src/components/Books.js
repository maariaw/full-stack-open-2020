import { ALL_BOOKS } from '../queries'
import { useQuery } from '@apollo/client'
import Select from 'react-select'
import { useState } from 'react'

const Books = (props) => {
  const [genre, setGenre] = useState('all')
  const allBooks = useQuery(ALL_BOOKS)
  const genreBooks = useQuery(ALL_BOOKS, {
    variables: { genre },
    skip: genre === 'all'
  })

  if (!props.show) {
    return null
  }

  if (allBooks.loading || genreBooks.loading) {
    return <div>loading...</div>
  }

  let books = allBooks.data.allBooks

  const extractGenre = (set, book) => {
    book.genres.map((g) => set.add(g))
    return set
  }
  const genres = ['all', ...books.reduce(extractGenre, new Set())]
  const options = genres.map((g) => ({ value: g, label: g}))
  const onChange = (selection) => setGenre(selection.value)

  if (genre !== 'all') {
    books = genreBooks.data.allBooks
  }

  return (
    <div>
      <h2>books</h2>

      <div>
        Show:
        <Select
          defaultValue={{label: genre, value: genre}}
          onChange={onChange}
          options={options}
        />
      </div>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((b) => (
            <tr key={b.title}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Books
