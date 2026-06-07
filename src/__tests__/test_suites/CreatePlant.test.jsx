import React from 'react'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import App from '../../components/App'
import '@testing-library/jest-dom'

const basePlants = [
  { id: '1', name: 'Aloe', image: './images/aloe.jpg', price: 15.99 },
  { id: '2', name: 'ZZ Plant', image: './images/zz-plant.jpg', price: 25.98 },
  { id: '3', name: 'Monstera Deliciosa', image: './images/monstera.jpg', price: 25.99 },
]

beforeEach(() => {
  global.fetch = jest.fn((url, options) => {
    if (!options || options.method !== 'POST') {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(basePlants),
      })
    }

    const body = JSON.parse(options.body)
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ id: '184298qfhquhf92', ...body }),
    })
  })
})

afterEach(() => {
  jest.resetAllMocks()
})

test('adds a new plant when the form is submitted', async () => {
  render(<App />)
  await screen.findByText('Aloe')

  fireEvent.change(screen.getByPlaceholderText('Plant name'), {
    target: { value: 'foo' },
  })
  fireEvent.change(screen.getByPlaceholderText('Image URL'), {
    target: { value: 'foo_plant_image_url' },
  })
  fireEvent.change(screen.getByPlaceholderText('Price'), {
    target: { value: '10' },
  })

  fireEvent.click(screen.getByText('Add Plant')) // match your component

  await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(2))

  expect(global.fetch).toHaveBeenLastCalledWith(
    'http://localhost:6001/plants',
    expect.objectContaining({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'foo',
        image: 'foo_plant_image_url',
        price: 10,
      }),
    }),
  )

  expect(await screen.findByText('foo')).toBeInTheDocument()
})