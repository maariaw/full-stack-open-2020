import { gql } from '@apollo/client'

export const ALL_AUTHORS = gql`
query {
  allAuthors {
    name
    born
  }
}
`

export const ALL_BOOKS = gql`
query booksByGenre($genre: String) {
  allBooks(genre: $genre) {
    title
    author {
      name
    }
    published
    genres
  }
}
`

export const ME = gql`
query {
  me {
    username
    favouriteGenre
  }
}
`
