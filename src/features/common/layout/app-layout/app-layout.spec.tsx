import { render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { describe, expect, it } from 'vitest'
import { AppLayout } from './app-layout.tsx'

function renderLayout() {
  const router = createMemoryRouter(
    [
      {
        path: '/',
        Component: AppLayout,
        children: [{ index: true, Component: () => <p>Page content</p> }],
      },
    ],
    { initialEntries: ['/'] },
  )
  render(<RouterProvider router={router} />)
}

describe('AppLayout', () => {
  it('renders the top bar with the app name and user avatar', () => {
    renderLayout()

    expect(screen.getByRole('banner')).toHaveTextContent('better-management')
    expect(screen.getByText('U')).toBeInTheDocument()
  })

  it('renders the main navigation with the active link marked', () => {
    renderLayout()

    const nav = screen.getByRole('navigation', { name: 'Main' })
    expect(nav).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute(
      'aria-current',
      'page',
    )
  })

  it('renders the matched child route inside the main area', () => {
    renderLayout()

    expect(screen.getByRole('main')).toHaveTextContent('Page content')
  })
})
