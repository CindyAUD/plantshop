import React from "react";

// Search is a controlled component: it holds no state itself.
// The parent (PlantPage) owns the searchQuery value and passes
// the setter via onSearch, keeping a single source of truth.
function Search({ searchQuery, onSearch }) {
  function handleChange(e) {
    onSearch(e.target.value);
  }

  return (
    <div className="searchbar">
      <label htmlFor="search">Search Plants:</label>
      <input
        type="text"
        id="search"
        placeholder="Type a name to search..."
        value={searchQuery}
        onChange={handleChange}
      />
    </div>
  );
}

export default Search;