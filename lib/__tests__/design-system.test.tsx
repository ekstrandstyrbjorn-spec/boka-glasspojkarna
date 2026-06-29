import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

test('Button renders with label and handles click', async () => {
  const onClick = vi.fn()
  render(<Button onClick={onClick}>Boka nu</Button>)
  expect(screen.getByRole('button', { name: 'Boka nu' })).toBeInTheDocument()
  await userEvent.click(screen.getByRole('button'))
  expect(onClick).toHaveBeenCalledTimes(1)
})

test('Button is disabled when disabled prop is true', () => {
  render(<Button disabled>Boka nu</Button>)
  expect(screen.getByRole('button')).toBeDisabled()
})

test('Badge renders children', () => {
  render(<Badge>Populärt</Badge>)
  expect(screen.getByText('Populärt')).toBeInTheDocument()
})
