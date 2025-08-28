import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          RecipeApp
        </Link>

        <div className="navbar-menu">
          <div className="navbar-nav">
            <Link
              to="/"
              className={`nav-link ${
                location.pathname === '/' ? 'active' : ''
              }`}
            >
              Home
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className={`nav-link ${
                    location.pathname === '/dashboard' ? 'active' : ''
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/add-recipe"
                  className={`nav-link ${
                    location.pathname === '/add-recipe' ? 'active' : ''
                  }`}
                >
                  Add Recipe
                </Link>
              </>
            ) : null}
          </div>

          <div className="navbar-actions">
            {isAuthenticated ? (
              <div className="user-menu">
                <span className="user-greeting">
                  Hello, {user?.firstName || user?.username}
                </span>
                <button onClick={handleLogout} className="btn btn-outline">
                  Logout
                </button>
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="btn btn-outline">
                  Login
                </Link>
                <Link to="/signup" className="btn btn-primary">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
