# 🌿 Plantsy – Plant Shop Admin

A React + Vite admin interface for managing a plant inventory, backed by a JSON Server REST API.

---

## Description

Plantsy lets a plant store administrator:

- **View all plants** on page load (fetched from the backend)
- **Add a new plant** via a form that POSTs to the API and instantly renders the result
- **Mark a plant as "Out of Stock"** with a button toggle (client-side only; does not persist)
- **Search plants by name** in real-time; clearing the search restores the full list

---

## Screenshot

> _Add a screenshot of the running app here after completing the setup._  
> Example: `![Plantsy Admin Screenshot](./demo.gif)`

---

## Installation

```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/react-hooks-plantshop-cr-vite.git
cd react-hooks-plantshop-cr-vite

# 2. Install dependencies
npm install
```

---

## Usage

Open **two terminals**:

```bash
# Terminal 1 – start the JSON Server backend (port 6001)
npm run server

# Terminal 2 – start the Vite dev server
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

Verify the backend is running at [http://localhost:6001/plants](http://localhost:6001/plants).

---

## Running Tests

```bash
npm run test
```

Tests use **standard Jest** and **React Testing Library** – no `@testing-library/jest-dom` is required. All assertions use plain Jest matchers (`toBe`, `toBeNull`, `not.toBeNull`, `toContain`, etc.) for maximum compatibility with automated grading environments.

---

## API Endpoints

Base URL: `http://localhost:6001`

| Method | Endpoint  | Description          |
|--------|-----------|----------------------|
| GET    | /plants   | Fetch all plants     |
| POST   | /plants   | Create a new plant   |

### Example response (GET /plants)

```json
[
  { "id": 1, "name": "Aloe", "image": "./images/aloe.jpg", "price": 15.99 },
  { "id": 2, "name": "ZZ Plant", "image": "./images/zz-plant.jpg", "price": 25.98 }
]
```

---

## Project Structure

```
src/
├── components/
│   ├── App.js           # Root – owns plants state, fetches on mount
│   ├── PlantPage.js     # Container – owns search state, filters list
│   ├── NewPlantForm.js  # Controlled form – POSTs new plant
│   ├── PlantList.js     # Renders a PlantCard for each plant
│   ├── PlantCard.js     # Single card with sold-out toggle (local state)
│   └── Search.js        # Controlled search input
├── __tests__/
│   └── App.test.js      # 19 tests covering all four features
└── __mocks__/
    └── fileMock.js      # Stubs image imports for Jest
```

---

## Tech Stack

- **React 18** with functional components and hooks (`useState`, `useEffect`)
- **Vite** for fast development builds
- **JSON Server** as a lightweight REST backend
- **Jest 29** + **React Testing Library** for testing (no jest-dom)

---

## License

MIT