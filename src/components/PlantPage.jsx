import React, { useState } from "react";
import NewPlantForm from "./NewPlantForm";
import PlantList from "./PlantList";
import Search from "./Search";

// PlantPage ties together the search bar, the add-plant form,
// and the plant list.  Search state lives here so it can filter
// the list passed down to PlantList.
function PlantPage({ plants, onAddPlant }) {
  // Tracks the current text entered in the search input.
  const [searchQuery, setSearchQuery] = useState("");

  // Filter plants whose names contain the search string (case-insensitive).
  // When the query is empty every plant is shown.
  const filteredPlants = plants.filter((plant) =>
    plant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main>
      <NewPlantForm onAddPlant={onAddPlant} />
      <Search searchQuery={searchQuery} onSearch={setSearchQuery} />
      <PlantList plants={filteredPlants} />
    </main>
  );
}

export default PlantPage;