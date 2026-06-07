import React from "react";
import PlantCard from "./PlantCard";

// PlantList maps over the plants array and renders one PlantCard per plant.
// It receives the already-filtered list from PlantPage so it has no
// filtering logic of its own.
function PlantList({ plants }) {
  return (
    <ul className="cards">
      {plants.map((plant) => (
        <PlantCard key={plant.id} plant={plant} />
      ))}
    </ul>
  );
}

export default PlantList;