
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-primary-dark shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-2xl font-bold text-white hover:text-primary-light transition-colors">
            Laptop Store Deluxe
          </Link>
          <div className="space-x-4 flex items-center">
            <Link to="/" className="text-gray-200 hover:text-white transition-colors">Home</Link>
            <Link to="/laptops" className="text-gray-200 hover:text-white transition-colors">Laptops</Link>
            {user ? (
              <>
                {user.role === 'admin' && (
                  <Link to="/admin/dashboard" className="text-gray-200 hover:text-white transition-colors">Admin</Link>
                )}
                <Link to="/profile" className="text-gray-200 hover:text-white transition-colors">Profile</Link>
                <button 
                  onClick={handleLogout} 
                  className="bg-accent hover:bg-amber-600 text-white font-semibold py-2 px-4 rounded transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-200 hover:text-white transition-colors">Login</Link>
                <Link to="/register" className="bg-secondary hover:bg-emerald-600 text-white font-semibold py-2 px-4 rounded transition-colors">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
    