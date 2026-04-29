import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ProfileModal from './ProfileModal';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-brand">
          <span className="logo-icon">✦</span>
          <span className="logo-text">TaskFlow</span>
        </div>
        <div className="navbar-right">
          <div className="user-badge" onClick={() => setProfileModalOpen(true)} style={{ cursor: 'pointer' }}>
            <div className="user-avatar">{user?.username?.[0]?.toUpperCase() || '?'}</div>
            <span className="user-name">{user?.username}</span>
          </div>
          <button id="logout-btn" className="btn-logout" onClick={handleLogout}>
            Sign Out
          </button>
        </div>
      </nav>

      <ProfileModal 
        isOpen={profileModalOpen} 
        onClose={() => setProfileModalOpen(false)} 
      />
    </>
  );
};

export default Navbar;
