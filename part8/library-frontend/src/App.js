import { BOOK_ADDED, AUTHOR_ADDED } from './mutations'
import { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Login from './components/Login'
import Recommendations from './components/Recommendations'
import { useApolloClient, useSubscription } from '@apollo/client'
import { ALL_AUTHORS, ALL_BOOKS } from './queries'

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)
  const client = useApolloClient()

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      const addedBook = data.data.bookAdded
      client.cache.updateQuery({ query: ALL_BOOKS }, ({ allBooks }) => {
        return {
          allBooks: allBooks.concat(addedBook)
        }
      })
    }
  })

  useSubscription(AUTHOR_ADDED, {
    onData: ({ data }) => {
      const addedAuthor = data.data.authorAdded
      client.cache.updateQuery({ query: ALL_AUTHORS }, ({ allAuthors }) => {
        return {
          allAuthors: allAuthors.concat(addedAuthor)
        }
      })
    }
  })

  const logout = () => {
    setPage('login')
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  let logButton
  if (!token) {
    logButton = <button onClick={() => setPage('login')}>login</button>
  } else {
    logButton = <button onClick={logout}>logout</button>
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token &&
        <>
          <button onClick={() => setPage('add')}>add book</button>
          <button onClick={() => setPage('recommendations')}>recommendations</button>
        </>
        }
        {logButton}
      </div>

      <Authors show={page === 'authors'} token={token} />

      <Books show={page === 'books'} token={token} />

      <NewBook show={page === 'add'} token={token} />

      <Recommendations show={page === 'recommendations'} />

      <Login show={page === 'login'} token={token} setToken={setToken} />
    </div>
  )
}

export default App
