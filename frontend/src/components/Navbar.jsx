import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <div className="navbar">
      <h1>
        <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
          TaskFlow
        </Link>
      </h1>
      <nav>
        {isAuthenticated ? (
          <>
            <span>
              {user.name} <span className="role-badge">{user.role}</span>
            </span>
            <Link to="/dashboard">Dashboard</Link>
            <button className="btn-secondary" onClick={logout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </div>
  );
}

export default Navbar;
