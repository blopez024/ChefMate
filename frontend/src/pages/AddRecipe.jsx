import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { recipeAPI } from '../services/api';
import '../styles/AddRecipe.css';

const AddRecipe = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    prepTime: '',
    cookTime: '',
    servings: '',
    difficulty: 'EASY',
    isPublic: true,
    ingredients: [''],
    instructions: [''],
  });
  const [error, setError] = useState('');

  const createRecipeMutation = useMutation({
    mutationFn: recipeAPI.create,
    onSuccess: () => {
      navigate('/dashboard');
    },
    onError: (error) => {
      setError(error.response?.data?.error || 'Failed to create recipe');
    },
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleIngredientChange = (index, value) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index] = value;
    setFormData((prev) => ({ ...prev, ingredients: newIngredients }));
  };

  const addIngredient = () => {
    setFormData((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, ''],
    }));
  };

  const removeIngredient = (index) => {
    if (formData.ingredients.length > 1) {
      const newIngredients = formData.ingredients.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, ingredients: newIngredients }));
    }
  };

  const handleInstructionChange = (index, value) => {
    const newInstructions = [...formData.instructions];
    newInstructions[index] = value;
    setFormData((prev) => ({ ...prev, instructions: newInstructions }));
  };

  const addInstruction = () => {
    setFormData((prev) => ({
      ...prev,
      instructions: [...prev.instructions, ''],
    }));
  };

  const removeInstruction = (index) => {
    if (formData.instructions.length > 1) {
      const newInstructions = formData.instructions.filter(
        (_, i) => i !== index,
      );
      setFormData((prev) => ({ ...prev, instructions: newInstructions }));
    }
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      return 'Recipe title is required';
    }

    const validIngredients = formData.ingredients.filter((ing) => ing.trim());
    if (validIngredients.length === 0) {
      return 'At least one ingredient is required';
    }

    const validInstructions = formData.instructions.filter((inst) =>
      inst.trim(),
    );
    if (validInstructions.length === 0) {
      return 'At least one instruction is required';
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    // Clean up the form data
    const cleanedData = {
      ...formData,
      ingredients: formData.ingredients.filter((ing) => ing.trim()),
      instructions: formData.instructions.filter((inst) => inst.trim()),
      prepTime: formData.prepTime ? parseInt(formData.prepTime) : null,
      cookTime: formData.cookTime ? parseInt(formData.cookTime) : null,
      servings: formData.servings ? parseInt(formData.servings) : null,
    };

    createRecipeMutation.mutate(cleanedData);
  };

  return (
    <div className="add-recipe-page">
      <div className="container">
        <div className="page-header">
          <h1>Create New Recipe</h1>
          <p>Share your delicious recipe with the community</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="recipe-form">
          {/* Basic Information */}
          <div className="form-section">
            <h2>Basic Information</h2>

            <div className="form-group">
              <label htmlFor="title">Recipe Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter recipe title"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your recipe..."
                rows="4"
              />
            </div>

            <div className="form-group">
              <label htmlFor="imageUrl">Image URL</label>
              <input
                type="url"
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleInputChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          {/* Recipe Details */}
          <div className="form-section">
            <h2>Recipe Details</h2>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="prepTime">Prep Time (minutes)</label>
                <input
                  type="number"
                  id="prepTime"
                  name="prepTime"
                  value={formData.prepTime}
                  onChange={handleInputChange}
                  placeholder="15"
                  min="0"
                />
              </div>

              <div className="form-group">
                <label htmlFor="cookTime">Cook Time (minutes)</label>
                <input
                  type="number"
                  id="cookTime"
                  name="cookTime"
                  value={formData.cookTime}
                  onChange={handleInputChange}
                  placeholder="30"
                  min="0"
                />
              </div>

              <div className="form-group">
                <label htmlFor="servings">Servings</label>
                <input
                  type="number"
                  id="servings"
                  name="servings"
                  value={formData.servings}
                  onChange={handleInputChange}
                  placeholder="4"
                  min="1"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="difficulty">Difficulty Level</label>
                <select
                  id="difficulty"
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleInputChange}
                >
                  <option value="EASY">Easy</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HARD">Hard</option>
                </select>
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="isPublic"
                    checked={formData.isPublic}
                    onChange={handleInputChange}
                  />
                  Make this recipe public
                </label>
              </div>
            </div>
          </div>

          {/* Ingredients */}
          <div className="form-section">
            <h2>Ingredients *</h2>
            {formData.ingredients.map((ingredient, index) => (
              <div key={index} className="dynamic-input">
                <input
                  type="text"
                  value={ingredient}
                  onChange={(e) =>
                    handleIngredientChange(index, e.target.value)
                  }
                  placeholder={`Ingredient ${index + 1}`}
                />
                {formData.ingredients.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeIngredient(index)}
                    className="btn btn-danger-outline btn-sm"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addIngredient}
              className="btn btn-outline btn-sm"
            >
              Add Ingredient
            </button>
          </div>

          {/* Instructions */}
          <div className="form-section">
            <h2>Instructions *</h2>
            {formData.instructions.map((instruction, index) => (
              <div key={index} className="dynamic-input">
                <textarea
                  value={instruction}
                  onChange={(e) =>
                    handleInstructionChange(index, e.target.value)
                  }
                  placeholder={`Step ${index + 1}`}
                  rows="3"
                />
                {formData.instructions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeInstruction(index)}
                    className="btn btn-danger-outline btn-sm"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addInstruction}
              className="btn btn-outline btn-sm"
            >
              Add Step
            </button>
          </div>

          {/* Submit Button */}
          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="btn btn-outline"
              disabled={createRecipeMutation.isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={createRecipeMutation.isLoading}
            >
              {createRecipeMutation.isLoading ? 'Creating...' : 'Create Recipe'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRecipe;
