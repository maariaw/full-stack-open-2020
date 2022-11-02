import { ALL_BOOKS, ME } from '../queries'
import { useQuery } from '@apollo/client'

const Recommendations = (props) => {
  const user = useQuery(ME)
  const allBooks = useQuery(ALL_BOOKS)
  if (!props.show) {
    return null
  }
  if (user.loading || allBooks.loading) {
    return <div>loading...</div>
  }
  const genre = user.data.me.favouriteGenre
  const books = allBooks.data.allBooks.filter(
    (b) => b.genres.find((g) => g === genre)
  )

  return (
    <div>
      <h2>Recommended books by your favourite genre: {genre}</h2>

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

export default Recommendations
