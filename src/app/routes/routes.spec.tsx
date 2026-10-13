import { render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { describe, expect, it } from 'vitest'
import { routes } from './routes.tsx'

function renderRoute(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] })
  render(<RouterProvider router={router} />)
}

describe('routes', () => {
  it('renders the home screen at /', () => {
    renderRoute('/')

    expect(
      screen.getByRole('heading', { name: 'better-management' }),
    ).toBeInTheDocument()
  })
})
