import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NewBlogForm from './NewBlogForm'

test('<NewBlogForm /> calls event handler with correct details', async () => {
  const mockAddBlog = jest.fn()
  const user = userEvent.setup()

  render(<NewBlogForm addNewBlog={mockAddBlog} />)

  const titleInput = screen.getByLabelText('Blog title:')
  const authorInput = screen.getByLabelText('Author:')
  const urlInput = screen.getByLabelText('Blog url:')
  const submitButton = screen.getByText('Add blog')

  await user.type(titleInput, 'Testing the blog form')
  await user.type(authorInput, 'T. Ester')
  await user.type(urlInput, 'this be website')
  await user.click(submitButton)

  expect(mockAddBlog.mock.calls).toHaveLength(1)
  expect(mockAddBlog.mock.calls[0][0].title).toBe('Testing the blog form')
  expect(mockAddBlog.mock.calls[0][0].author).toBe('T. Ester')
  expect(mockAddBlog.mock.calls[0][0].url).toBe('this be website')
})