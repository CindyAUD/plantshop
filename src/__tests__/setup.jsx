import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom'

afterEach(() => {
  cleanup()
})

global.basePlants = [
  { id: 1, name: "Aloe", image: "./images/aloe.jpg", price: 15.99 },
  { id: 2, name: "ZZ Plant", image: "./images/zz-plant.jpg", price: 25.98 },
]

global.alternatePlants = [
  { id: 3, name: "Monstera", image: "./images/monstera.jpg", price: 25.99 },
]

global.setFetchResponse = (plants = global.basePlants) => {
  global.fetch = (url, options) => {
    if (!options || options.method !== "POST") {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(plants),
      })
    }
    const body = JSON.parse(options.body)
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ id: Date.now(), ...body }),
    })
  }
}

beforeEach(() => {
  global.setFetchResponse()
})