import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  let blog

  beforeEach(() => {
    blog = {
      author: 'T. Ester',
      id: '626a6a39e3f66637e0140cd2',
      likes:'3',
      title:'This is a test blog',
      url:'this is a website',
      user:{
        id: '62645ce7f97fb0021797e689',
        name: 'Kalle Kupari',
        username: 'copper'
      }
    }
  })

  test('renders author and title, not url or likes', () => {
    render(<Blog
      blog={blog}
      isCreator={true}
    />)

    const titleElement = screen.getByText(
      'This is a test blog',
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

  test('renders url and likes after pressing "View"', async () => {
    render(<Blog
      blog={blog}
      isCreator={true}
    />)

    const user = userEvent.setup()
    const button = screen.getByText('View')
    await user.click(button)

    const urlElement = screen.queryByText('this is a website')
    expect(urlElement).not.toBeNull()
    const likesElement = screen.queryByTestId('likes')
    expect(likesElement).not.toBeNull()
  })

  test('calls event handler twice when pressing "Like" button twice', async () => {
    const mockHandler = jest.fn()

    render(<Blog
      blog={blog}
      handleLike={mockHandler}
      isCreator={true}
    />)

    const user = userEvent.setup()
    const viewButton = screen.getByText('View')
    await user.click(viewButton)
    const likeButton = screen.getByText('Like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})
