

import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import App from "../components/App";
import PlantCard from "../components/PlantCard";
import Search from "../components/Search";

// ---------------------------------------------------------------------------
// Global fetch mock
// ---------------------------------------------------------------------------

// Sample plant data reused across tests
const mockPlants = [
  { id: 1, name: "Aloe", image: "./images/aloe.jpg", price: 15.99 },
  { id: 2, name: "ZZ Plant", image: "./images/zz-plant.jpg", price: 25.98 },
  { id: 3, name: "Monstera Deliciosa", image: "./images/monstera.jpg", price: 25.99 },
];

// Helper: build a fetch mock that returns the given body for GET /plants
// and echoes the posted body (with an id) for POST /plants.
function buildFetchMock(plants = mockPlants) {
  return jest.fn((url, options) => {
    if (!options || options.method !== "POST") {
      // GET /plants
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(plants),
      });
    }
    // POST /plants – parse the sent body and return it with an id
    const body = JSON.parse(options.body);
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ id: 99, ...body }),
    });
  });
}

beforeEach(() => {
  global.fetch = buildFetchMock();
});

afterEach(() => {
  jest.restoreAllMocks();
});

// ---------------------------------------------------------------------------
// 1. Renders all plants on page load
// ---------------------------------------------------------------------------

describe("App – page load", () => {
  test("fetches plants from the backend on mount", async () => {
    render(<App />);

    // Wait for at least one plant name to appear in the DOM
    await waitFor(() => screen.getByText("Aloe"));

    // fetch should have been called exactly once for the initial GET
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith("http://localhost:6001/plants");
  });

  test("renders every plant name returned by the API", async () => {
    render(<App />);

    for (const plant of mockPlants) {
      // waitFor each name so we handle async state updates correctly
      const el = await screen.findByText(plant.name);
      expect(el).not.toBeNull();
    }
  });

  test("renders a price for each plant", async () => {
    render(<App />);

    // After plants load, each price should appear somewhere in the document
    for (const plant of mockPlants) {
      const priceEl = await screen.findByText(`Price: ${plant.price}`);
      expect(priceEl).not.toBeNull();
    }
  });

  test("renders the correct number of plant cards", async () => {
    render(<App />);
    await screen.findByText("Aloe"); // wait for load

    // Each plant card is an <li> element
    const cards = document.querySelectorAll("li.card");
    expect(cards.length).toBe(mockPlants.length);
  });
});

// ---------------------------------------------------------------------------
// 2. Add a new plant via the form
// ---------------------------------------------------------------------------

describe("NewPlantForm – adding a plant", () => {
  test("submitting the form POSTs to the backend", async () => {
    render(<App />);
    await screen.findByText("Aloe"); // wait for initial load

    // Fill in the form fields
    fireEvent.change(screen.getByPlaceholderText("Plant name"), {
      target: { value: "Snake Plant" },
    });
    fireEvent.change(screen.getByPlaceholderText("Image URL"), {
      target: { value: "./images/snake.jpg" },
    });
    fireEvent.change(screen.getByPlaceholderText("Price"), {
      target: { value: "18.50" },
    });

    fireEvent.click(screen.getByText("Add to Inventory"));

    await waitFor(() => {
      // fetch should have been called twice: once for GET, once for POST
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });

    // Verify the POST was made to the correct URL with correct method
    const [, postUrl, postOptions] = global.fetch.mock.calls[1]
      ? [null, ...global.fetch.mock.calls[1]]
      : [null, null, null];
    expect(postUrl ?? global.fetch.mock.calls[1][0]).toBe("http://localhost:6001/plants");
  });

  test("new plant appears on the page after form submission", async () => {
    render(<App />);
    await screen.findByText("Aloe");

    fireEvent.change(screen.getByPlaceholderText("Plant name"), {
      target: { value: "Snake Plant" },
    });
    fireEvent.change(screen.getByPlaceholderText("Image URL"), {
      target: { value: "./images/snake.jpg" },
    });
    fireEvent.change(screen.getByPlaceholderText("Price"), {
      target: { value: "18.50" },
    });

    fireEvent.click(screen.getByText("Add to Inventory"));

    // The new plant name should now be rendered
    const newCard = await screen.findByText("Snake Plant");
    expect(newCard).not.toBeNull();
  });

  test("POST body contains the correct plant data", async () => {
    render(<App />);
    await screen.findByText("Aloe");

    fireEvent.change(screen.getByPlaceholderText("Plant name"), {
      target: { value: "Cactus" },
    });
    fireEvent.change(screen.getByPlaceholderText("Image URL"), {
      target: { value: "./images/cactus.jpg" },
    });
    fireEvent.change(screen.getByPlaceholderText("Price"), {
      target: { value: "9.99" },
    });

    fireEvent.click(screen.getByText("Add to Inventory"));

    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(2));

    const postCall = global.fetch.mock.calls[1];
    const sentBody = JSON.parse(postCall[1].body);

    expect(sentBody.name).toBe("Cactus");
    expect(sentBody.image).toBe("./images/cactus.jpg");
    expect(sentBody.price).toBe(9.99);
  });

  test("form fields reset after successful submission", async () => {
    render(<App />);
    await screen.findByText("Aloe");

    const nameInput = screen.getByPlaceholderText("Plant name");
    fireEvent.change(nameInput, { target: { value: "Orchid" } });
    fireEvent.change(screen.getByPlaceholderText("Image URL"), {
      target: { value: "./images/orchid.jpg" },
    });
    fireEvent.change(screen.getByPlaceholderText("Price"), {
      target: { value: "22.00" },
    });

    fireEvent.click(screen.getByText("Add to Inventory"));

    await screen.findByText("Orchid"); // wait for state update

    // After successful submit the name field should be empty
    expect(nameInput.value).toBe("");
  });
});

// ---------------------------------------------------------------------------
// 3. Mark a plant as sold out (non-persisting)
// ---------------------------------------------------------------------------

describe("PlantCard – sold out toggle", () => {
  const singlePlant = { id: 1, name: "Aloe", image: "./images/aloe.jpg", price: 15.99 };

  test("button initially reads 'In Stock'", () => {
    render(<PlantCard plant={singlePlant} />);
    const button = screen.getByRole("button");
    expect(button.textContent).toBe("In Stock");
  });

  test("clicking the button changes it to 'Out of Stock'", () => {
    render(<PlantCard plant={singlePlant} />);
    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(button.textContent).toBe("Out of Stock");
  });

  test("clicking 'Out of Stock' toggles back to 'In Stock'", () => {
    render(<PlantCard plant={singlePlant} />);
    const button = screen.getByRole("button");
    fireEvent.click(button); // → Out of Stock
    fireEvent.click(button); // → In Stock
    expect(button.textContent).toBe("In Stock");
  });

  test("sold-out toggle does NOT call fetch (non-persisting)", () => {
    render(<PlantCard plant={singlePlant} />);
    fireEvent.click(screen.getByRole("button"));
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test("'Out of Stock' button does NOT have the primary class", () => {
    render(<PlantCard plant={singlePlant} />);
    const button = screen.getByRole("button");
    fireEvent.click(button); // mark sold out
    expect(button.className).not.toContain("primary");
  });

  test("'In Stock' button HAS the primary class", () => {
    render(<PlantCard plant={singlePlant} />);
    const button = screen.getByRole("button");
    expect(button.className).toContain("primary");
  });
});

// ---------------------------------------------------------------------------
// 4. Search / filter plants by name
// ---------------------------------------------------------------------------

describe("Search – filtering plants", () => {
  test("typing in the search box filters the displayed plants", async () => {
    render(<App />);
    await screen.findByText("Aloe");

    const searchInput = screen.getByLabelText("Search Plants:");
    fireEvent.change(searchInput, { target: { value: "ZZ" } });

    // Only "ZZ Plant" should remain
    expect(screen.queryByText("ZZ Plant")).not.toBeNull();
    expect(screen.queryByText("Aloe")).toBeNull();
    expect(screen.queryByText("Monstera Deliciosa")).toBeNull();
  });

  test("search is case-insensitive", async () => {
    render(<App />);
    await screen.findByText("Aloe");

    const searchInput = screen.getByLabelText("Search Plants:");
    fireEvent.change(searchInput, { target: { value: "aloe" } });

    expect(screen.queryByText("Aloe")).not.toBeNull();
    expect(screen.queryByText("ZZ Plant")).toBeNull();
  });

  test("clearing the search restores all plants", async () => {
    render(<App />);
    await screen.findByText("Aloe");

    const searchInput = screen.getByLabelText("Search Plants:");

    // Filter down
    fireEvent.change(searchInput, { target: { value: "Monstera" } });
    expect(screen.queryByText("Aloe")).toBeNull();

    // Clear
    fireEvent.change(searchInput, { target: { value: "" } });

    for (const plant of mockPlants) {
      expect(screen.queryByText(plant.name)).not.toBeNull();
    }
  });

  test("no plants shown when query matches nothing", async () => {
    render(<App />);
    await screen.findByText("Aloe");

    const searchInput = screen.getByLabelText("Search Plants:");
    fireEvent.change(searchInput, { target: { value: "xyznonexistent" } });

    const cards = document.querySelectorAll("li.card");
    expect(cards.length).toBe(0);
  });

  test("Search component calls onSearch with the input value", () => {
    const mockOnSearch = jest.fn();
    render(<Search searchQuery="" onSearch={mockOnSearch} />);

    const input = screen.getByLabelText("Search Plants:");
    fireEvent.change(input, { target: { value: "Pothos" } });

    expect(mockOnSearch).toHaveBeenCalledWith("Pothos");
  });
});