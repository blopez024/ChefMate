import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { recipeAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/RecipeCard.css';

const RecipeCard = ({ recipe, isOwner = false }) => {
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const saveMutation = useMutation({
    mutationFn: recipe.isSavedByUser
      ? () => recipeAPI.unsave(recipe.id)
      : () => recipeAPI.save(recipe.id),
    onSuccess: () => {
      queryClient.invalidateQueries(['recipes']);
      queryClient.invalidateQueries(['dashboard']);
    },
  });

  const cookMutation = useMutation({
    mutationFn: (data) => recipeAPI.cook(recipe.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['recipes']);
      queryClient.invalidateQueries(['dashboard']);
    },
  });

  const handleSave = () => {
    if (!isAuthenticated) return;
    saveMutation.mutate();
  };

  const handleCook = () => {
    if (!isAuthenticated) return;

    const rating = prompt('Rate this recipe (1-5):');
    const notes = prompt('Any notes about cooking this recipe? (optional)');

    if (rating && rating >= 1 && rating <= 5) {
      cookMutation.mutate({
        rating: parseInt(rating),
        notes: notes || null,
      });
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'EASY':
        return '#22c55e';
      case 'MEDIUM':
        return '#f59e0b';
      case 'HARD':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  return (
    <div className="recipe-card">
      {recipe.imageUrl && (
        <div className="recipe-card-image">
          <img src={recipe.imageUrl} alt={recipe.title} />
          <div className="recipe-card-overlay">
            {isAuthenticated && !isOwner && (
              <div className="recipe-actions">
                <button
                  onClick={handleSave}
                  className={`action-btn ${
                    recipe.isSavedByUser ? 'saved' : ''
                  }`}
                  disabled={saveMutation.isLoading}
                  title={recipe.isSavedByUser ? 'Unsave recipe' : 'Save recipe'}
                >
                  {recipe.isSavedByUser ? '❤️' : '🤍'}
                </button>
                <button
                  onClick={handleCook}
                  className="action-btn"
                  disabled={cookMutation.isLoading}
                  title="Mark as cooked"
                >
                  👨‍🍳
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="recipe-card-content">
        <div className="recipe-header">
          <h3 className="recipe-title">{recipe.title}</h3>
          <span
            className="difficulty-badge"
            style={{ backgroundColor: getDifficultyColor(recipe.difficulty) }}
          >
            {recipe.difficulty}
          </span>
        </div>

        {recipe.description && (
          <p className="recipe-description">
            {recipe.description.length > 100
              ? `${recipe.description.substring(0, 100)}...`
              : recipe.description}
          </p>
        )}

        <div className="recipe-meta">
          {recipe.prepTime && (
            <span className="meta-item">⏱️ {recipe.prepTime}m prep</span>
          )}
          {recipe.cookTime && (
            <span className="meta-item">🔥 {recipe.cookTime}m cook</span>
          )}
          {recipe.servings && (
            <span className="meta-item">🍽️ {recipe.servings} servings</span>
          )}
        </div>

        <div className="recipe-author">
          <span>
            By {recipe.user?.firstName} {recipe.user?.lastName}
          </span>
          <span className="recipe-date">
            {new Date(recipe.createdAt).toLocaleDateString()}
          </span>
        </div>

        <div className="recipe-stats">
          <span className="stat">❤️ {recipe.totalSaves || 0} saves</span>
          <span className="stat">👨‍🍳 {recipe.totalCooked || 0} cooked</span>
          {recipe.averageRating && (
            <span className="stat">⭐ {recipe.averageRating}/5</span>
          )}
        </div>

        {recipe.isSavedByUser && (
          <div className="user-interaction">
            <span className="interaction-badge">❤️ Saved</span>
          </div>
        )}

        {recipe.isCookedByUser && (
          <div className="user-interaction">
            <span className="interaction-badge">
              👨‍🍳 Cooked
              {recipe.userRating && ` • ⭐ ${recipe.userRating}/5`}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeCard;
