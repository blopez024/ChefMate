import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { dashboardAPI } from '../services/api';
import RecipeCard from '../components/ui/RecipeCard';
import StatsCard from '../components/ui/StatsCard';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('public');

  const { data: dashboardData, isLoading: isDashboardLoading } = useQuery({
    queryKey: ['dashboard', user?.id],
    queryFn: () => dashboardAPI.getDashboard(user.id),
    enabled: !!user?.id,
  });

  const { data: myRecipesData, isLoading: isMyRecipesLoading } = useQuery({
    queryKey: ['myRecipes', user?.id],
    queryFn: () => dashboardAPI.getMyRecipes(user.id),
    enabled: !!user?.id && activeTab === 'my-recipes',
  });

  if (isDashboardLoading) {
    return (
      <div className="dashboard">
        <div className="container">
          <div className="loading">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  const publicRecipes = dashboardData?.data?.data?.items || [];
  const myRecipes = myRecipesData?.data?.data?.items || [];
  const userStats = dashboardData?.data?.data?.userStats || {};

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>Welcome back, {user?.firstName}!</h1>
          <p>Here's what's happening in your recipe world</p>
        </div>

        {/* Stats Section */}
        <div className="stats-grid">
          <StatsCard
            title="Recipes Created"
            value={userStats.recipesCreated || 0}
            icon="📝"
          />
          <StatsCard
            title="Recipes Saved"
            value={userStats.recipesSaved || 0}
            icon="❤️"
          />
          <StatsCard
            title="Recipes Cooked"
            value={userStats.recipesCooked || 0}
            icon="👨‍🍳"
          />
        </div>

        {/* Tab Navigation */}
        <div className="dashboard-tabs">
          <button
            className={`tab ${activeTab === 'public' ? 'active' : ''}`}
            onClick={() => setActiveTab('public')}
          >
            Discover Recipes
          </button>
          <button
            className={`tab ${activeTab === 'my-recipes' ? 'active' : ''}`}
            onClick={() => setActiveTab('my-recipes')}
          >
            My Recipes
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'public' && (
            <div className="tab-panel">
              <div className="panel-header">
                <h2>Discover New Recipes</h2>
                <p>Popular recipes from the community</p>
              </div>
              <div className="recipes-grid">
                {publicRecipes.length > 0 ? (
                  publicRecipes.map((recipe) => (
                    <RecipeCard key={recipe.id} recipe={recipe} />
                  ))
                ) : (
                  <div className="empty-state">
                    <h3>No recipes available</h3>
                    <p>Check back later for new recipes from the community</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'my-recipes' && (
            <div className="tab-panel">
              <div className="panel-header">
                <h2>My Recipes</h2>
                <p>Recipes you've created</p>
              </div>
              {isMyRecipesLoading ? (
                <div className="loading">Loading your recipes...</div>
              ) : (
                <div className="recipes-grid">
                  {myRecipes.length > 0 ? (
                    myRecipes.map((recipe) => (
                      <RecipeCard key={recipe.id} recipe={recipe} isOwner />
                    ))
                  ) : (
                    <div className="empty-state">
                      <h3>No recipes yet</h3>
                      <p>Start by creating your first recipe!</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
