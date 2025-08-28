import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { recipeAPI } from '../services/api';
import RecipeCard from '../components/ui/RecipeCard';
import SearchFilter from '../components/ui/SearchFilter';
import '../styles/HomePage.css';

const HomePage = () => {
  const [filters, setFilters] = useState({
    search: '',
    difficulty: '',
    maxPrepTime: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  const [page, setPage] = useState(1);

  const queryParams = useMemo(
    () => ({
      ...filters,
      page,
      limit: 12,
    }),
    [filters, page],
  );

  const {
    data: recipesData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['recipes', queryParams],
    queryFn: () => recipeAPI.getAll(queryParams),
    keepPreviousData: true,
  });

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPage(1); // Reset to first page when filtering
  };

  if (error) {
    return (
      <div className="error-container">
        <h2>Error loading recipes</h2>
        <p>{error.response?.data?.error || 'Something went wrong'}</p>
      </div>
    );
  }

  const recipes = recipesData?.data?.data?.items || [];
  const pagination = recipesData?.data?.data?.pagination || {};

  return (
    <div className="homepage">
      <div className="hero-section">
        <div className="hero-content">
          <h1>Discover Amazing Recipes</h1>
          <p>Share, save, and cook delicious recipes from our community</p>
        </div>
      </div>

      <div className="content-section">
        <div className="container">
          <SearchFilter onFilterChange={handleFilterChange} />

          {isLoading ? (
            <div className="loading-grid">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="recipe-card-skeleton">
                  <div className="skeleton-image"></div>
                  <div className="skeleton-content">
                    <div className="skeleton-title"></div>
                    <div className="skeleton-text"></div>
                    <div className="skeleton-text"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="recipes-grid">
                {recipes.length > 0 ? (
                  recipes.map((recipe) => (
                    <RecipeCard key={recipe.id} recipe={recipe} />
                  ))
                ) : (
                  <div className="no-results">
                    <h3>No recipes found</h3>
                    <p>Try adjusting your search criteria</p>
                  </div>
                )}
              </div>

              {pagination.totalPages > 1 && (
                <div className="pagination">
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={!pagination.hasPreviousPage}
                    className="btn btn-outline"
                  >
                    Previous
                  </button>

                  <span className="pagination-info">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </span>

                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={!pagination.hasNextPage}
                    className="btn btn-outline"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
