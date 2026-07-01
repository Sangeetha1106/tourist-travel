import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../api/authApi';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  let user = null;
  
  try {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      user = JSON.parse(userStr);
    }
  } catch (err) {
    console.error('Failed to parse user', err);
  }

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const isAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN' || user?.role === 'TOUR_MANAGER' || user?.role === 'TOUR_GUIDE';
  const isCustomer = user?.role === 'CUSTOMER';

  const getAdminLink = () => {
    switch (user?.role) {
      case 'SUPER_ADMIN': return '/super-admin/dashboard';
      case 'ADMIN': return '/admin/dashboard';
      case 'TOUR_MANAGER': return '/manager/dashboard';
      case 'TOUR_GUIDE': return '/guide/dashboard';
      default: return '/';
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand" style={{ flex: 1 }}>
        <Link to="/">
          GT<span>Holidays</span>
        </Link>
      </div>
      
      <div className="navbar-links" style={{ flex: 2, display: 'flex', justifyContent: 'center', gap: '30px' }}>
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/destinations" className="nav-link">Destinations</Link>
        
        <div className="nav-dropdown">
          <Link to="/packages" className="nav-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            Packages <span style={{ fontSize: '0.8em' }}>▼</span>
          </Link>
          <div className="dropdown-content">
            <Link to="/packages/india" className="dropdown-item">India Tours</Link>
            <Link to="/packages/international" className="dropdown-item">International Tours</Link>
            <Link to="/packages/honeymoon" className="dropdown-item">Honeymoon Packages</Link>
            <Link to="/packages/europe" className="dropdown-item">Europe Tours</Link>
          </div>
        </div>

        <Link to="/about" className="nav-link">About Us</Link>
        <Link to="/contact" className="nav-link">Contact Us</Link>
      </div>

      <div className="navbar-menu" style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', gap: '15px' }}>
        {token ? (
          <>
            {isAdmin && <Link to={getAdminLink()} className="nav-link" style={{ color: 'var(--primary-color)' }}>Admin Panel</Link>}
            {isCustomer && <Link to="/my-trips" className="nav-link">My Trips</Link>}
            <Link to="/profile" className="nav-link">Profile</Link>
            <button className="btn-logout" onClick={handleLogout} style={{ marginLeft: '10px' }}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link" style={{ alignSelf: 'center' }}>Login</Link>
            <Link to="/register" className="btn-primary gt-red" style={{ padding: '10px 24px' }}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
