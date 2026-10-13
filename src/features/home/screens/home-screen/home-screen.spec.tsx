import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { HomeScreen } from './home-screen.tsx'

describe('HomeScreen', () => {
  it('renders the app title', () => {
    render(<HomeScreen />)

    expect(
      screen.getByRole('heading', { name: 'better-management' }),
    ).toBeInTheDocument()
  })
})
