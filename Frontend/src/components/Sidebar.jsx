import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const role = user?.role;

  const getBasePath = () => {
    switch (role) {
      case 'SUPER_ADMIN': return '/super-admin';
      case 'ADMIN': return '/admin';
      case 'TOUR_MANAGER': return '/manager';
      case 'TOUR_GUIDE': return '/guide';
      default: return '';
    }
  };

  const basePath = getBasePath();

  const renderSidebarLinks = () => {
    if (role === 'TOUR_MANAGER') {
      return (
        <ul className="sidebar-list">
          <li><NavLink to={`${basePath}/dashboard`} className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>Dashboard</NavLink></li>
          <li><NavLink to={`${basePath}/bookings`} className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>Bookings</NavLink></li>
          <li><NavLink to={`${basePath}/assignments`} className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>Tour Assignments</NavLink></li>
          <li><NavLink to={`${basePath}/guides`} className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>Guides</NavLink></li>
          <li><NavLink to={`${basePath}/vehicles`} className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>Vehicles</NavLink></li>
          <li><NavLink to={`${basePath}/hotels`} className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>Hotels</NavLink></li>
          <li><NavLink to={`${basePath}/customers`} className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>Customers</NavLink></li>
          <li><NavLink to={`${basePath}/itinerary`} className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>Itinerary</NavLink></li>
          <li><NavLink to={`${basePath}/reports`} className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>Reports</NavLink></li>
          <li><NavLink to={`${basePath}/profile`} className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>Profile</NavLink></li>
          <li>
            <button 
              className="sidebar-link" 
              style={{ width: '100%', textAlign: 'left', background: 'transparent', border: 'none', cursor: 'pointer', color: '#ff4757', fontWeight: 'bold' }}
              onClick={() => {
                localStorage.clear();
                sessionStorage.clear();
                window.location.href = '/login';
              }}
            >
              Logout
            </button>
          </li>
        </ul>
      );
    }
    
    if (role === 'TOUR_GUIDE') {
      return (
        <ul className="sidebar-list">
          <li><NavLink to={`${basePath}/dashboard`} className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>Dashboard</NavLink></li>
          <li><NavLink to={`${basePath}/trips`} className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>Assigned Trips</NavLink></li>
          <li><NavLink to={`${basePath}/schedule`} className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>Trip Schedule</NavLink></li>
          <li><NavLink to={`${basePath}/customers`} className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>Customers</NavLink></li>
          <li><NavLink to={`${basePath}/progress`} className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>Trip Progress</NavLink></li>
          <li><NavLink to={`${basePath}/photos`} className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>Trip Photos</NavLink></li>
          <li><NavLink to={`${basePath}/notifications`} className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>Notifications</NavLink></li>
          <li><NavLink to={`${basePath}/profile`} className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>Profile</NavLink></li>
          <li>
            <button 
              className="sidebar-link" 
              style={{ width: '100%', textAlign: 'left', background: 'transparent', border: 'none', cursor: 'pointer', color: '#ff4757', fontWeight: 'bold' }}
              onClick={() => {
                localStorage.clear();
                sessionStorage.clear();
                window.location.href = '/login';
              }}
            >
              Logout
            </button>
          </li>
        </ul>
      );
    }

    // Default for SUPER_ADMIN & ADMIN
    return (
      <ul className="sidebar-list">
        <li><NavLink to={`${basePath}/dashboard`} className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>Dashboard</NavLink></li>
        <li><NavLink to="/destinations" className="sidebar-link">Destinations</NavLink></li>
        <li><NavLink to="/packages" className="sidebar-link">Packages</NavLink></li>
        <li><NavLink to={`${basePath}/bookings`} className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>Bookings</NavLink></li>
        <li><NavLink to="/profile" className="sidebar-link">Profile</NavLink></li>
      </ul>
    );
  };

  return (
    <aside className="sidebar">
      {renderSidebarLinks()}
    </aside>
  );
};

export default Sidebar;
