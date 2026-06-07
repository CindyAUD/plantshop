import React, { useState, useEffect } from "react";
import PlantPage from "./PlantPage";

// Root application component.
// Owns the top-level plants state so it can be shared between
// the plant list (display) and the new-plant form (mutation).
function App() {
  const [plants, setPlants] = useState([]);

  // Fetch all plants from the backend on initial page load.
  // The empty dependency array ensures this only runs once.
  useEffect(() => {
    fetch("http://localhost:6001/plants")
      .then((res) => res.json())
      .then((data) => setPlants(data))
      .catch((err) => console.error("Error fetching plants:", err));
  }, []);

  // Callback passed to NewPlantForm; adds a newly created plant to state
  // so the UI updates immediately without a full re-fetch.
  function handleAddPlant(newPlant) {
    setPlants((prev) => [...prev, newPlant]);
  }

  return (
    <div className="app">
      <PlantPage plants={plants} onAddPlant={handleAddPlant} />
    </div>
  );
}

export default App;