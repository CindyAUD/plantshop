import React, { useState } from "react";

// PlantCard displays a single plant's image, name, and price.
// It tracks its own inStock state locally so toggling "sold out"
// does NOT persist to the backend (per requirements).
function PlantCard({ plant }) {
  const { name, image, price } = plant;

  // Local state: starts as in-stock (true).
  const [inStock, setInStock] = useState(true);

  function handleStockToggle() {
    setInStock((prev) => !prev);
  }

  return (
    <li className="card" data-testid="plant-item">
      <img src={image} alt={name} />
      <h4>{name}</h4>
      <p>Price: {price}</p>
      {/* Button label and style change based on inStock state */}
      {inStock ? (
        <button className="primary" onClick={handleStockToggle}>
          In Stock
        </button>
      ) : (
        <button onClick={handleStockToggle}>Out of Stock</button>
      )}
    </li>
  );
}

export default PlantCard;