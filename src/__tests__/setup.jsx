import { jest } from '@jest/globals'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom'

const fetchResponseQueue = [];

global.basePlants = [
  { id: 1, name: 'Aloe Plant', image: './images/aloe.jpg', price: 15.99 },
  { id: 2, name: 'ZZ Plant', image: './images/zz-plant.jpg', price: 25.98 },
  { id: 3, name: 'Peperomia', image: './images/monstera.jpg', price: 25.99 },
];

global.alternatePlants = [
  { id: 4, name: 'Snake Plant', image: './images/snake-plant.jpg', price: 18.5 },
  { id: 5, name: 'Cactus', image: './images/cactus.jpg', price: 9.99 },
  { id: 6, name: 'Fiddle Leaf Fig', image: './images/fiddle-leaf-fig.jpg', price: 29.99 },
];

function buildFetchMock() {
  return jest.fn(() => {
    const response = fetchResponseQueue.shift();
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(response),
    });
  });
}

global.setFetchResponse = (response) => {
  fetchResponseQueue.push(response);
};

beforeEach(() => {
  fetchResponseQueue.length = 0;
  global.fetch = buildFetchMock();
});

afterEach(() => {
  cleanup();
  jest.restoreAllMocks();
});