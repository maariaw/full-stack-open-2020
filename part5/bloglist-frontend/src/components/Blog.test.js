import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import Blog from './Blog'

test('renders author and title, not url or likes', () => {
  const blog = {
    author: 'T. Ester',
    id: '626a6a39e3f66637e0140cd2',
    likes:'3',
    title:'Only title and author should be rendered',
    url:'this is a website',
    user:{
      id: '62645ce7f97fb0021797e689',
      name: 'Kalle Kupari',
      username: 'copper'
    }
  }

  render(<Blog
    blog={blog}
    isCreator={true}
  />)

  const titleElement = screen.getByText(
    'Only title and author should be rendered',
    { exact: false }
  )
  expect(titleElement).toBeDefined()
  const authorElement = screen.getByText('T. Ester', { exact: false })
  expect(authorElement).toBeDefined()
  const urlElement = screen.queryByText('this is a website')
  expect(urlElement).toBeNull()
  const likesEelement = screen.queryByTestId('likes')
  expect(likesEelement).toBeNull()
})