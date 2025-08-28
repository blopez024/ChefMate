import { useState } from 'react';
import '../../styles/SearchFilter.css';

const SearchFilter = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    search: '',
    difficulty: '',
    maxPrepTime: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      search: '',
      difficulty: '',
      maxPrepTime: '',
      sortBy: 'createdAt',
      sortOrder: 'desc',
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <div className="search-filter">
      <div className="filter-row">
        <div className="search-group">
          <input
            type="text"
            name="search"
            placeholder="Search recipes..."
            value={filters.search}
            onChange={handleInputChange}
            className="search-input"
          />
        </div>

        <div className="filter-group">
          <select
            name="difficulty"
            value={filters.difficulty}
            onChange={handleInputChange}
            className="filter-select"
          >
            <option value="">All Difficulties</option>
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
          </select>
        </div>

        <div className="filter-group">
          <input
            type="number"
            name="maxPrepTime"
            placeholder="Max prep time (min)"
            value={filters.maxPrepTime}
            onChange={handleInputChange}
            className="filter-input"
            min="0"
          />
        </div>

        <div className="filter-group">
          <select
            name="sortBy"
            value={filters.sortBy}
            onChange={handleInputChange}
            className="filter-select"
          >
            <option value="createdAt">Date Created</option>
            <option value="title">Title</option>
            <option value="prepTime">Prep Time</option>
            <option value="cookTime">Cook Time</option>
            <option value="difficulty">Difficulty</option>
          </select>
        </div>

        <div className="filter-group">
          <select
            name="sortOrder"
            value={filters.sortOrder}
            onChange={handleInputChange}
            className="filter-select"
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="btn btn-outline btn-sm"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default SearchFilter;
