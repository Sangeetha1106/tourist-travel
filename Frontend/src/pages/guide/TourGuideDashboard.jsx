import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import Loader from '../../components/Loader';

const TourGuideDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axiosInstance.get('/guide/dashboard');
        if (res.data.success) {
          setStats(res.data.data);
        }
      } catch (err) {
        setError('Failed to load dashboard statistics.');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="page-container" style={{ maxWidth: '1400px' }}>
      <div className="page-header">
        <h2>Tour Guide Dashboard</h2>
        <p>Welcome back, {user?.firstName}! Here is your overview.</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="stats-grid" style={{ marginBottom: '40px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
        <div onClick={() => navigate('/guide/assigned')} className="stat-card" style={{ cursor: 'pointer', borderLeft: '4px solid #f1c40f', background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
          <h3 style={{ fontSize: '1.2rem', color: '#7f8c8d', marginBottom: '10px' }}>Assigned Tours</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: '#f1c40f' }}>{stats?.assignedTours || 0}</p>
        </div>
        <div onClick={() => navigate('/guide/today')} className="stat-card" style={{ cursor: 'pointer', borderLeft: '4px solid #f39c12', background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
          <h3 style={{ fontSize: '1.2rem', color: '#7f8c8d', marginBottom: '10px' }}>Today's Tours</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: '#f39c12' }}>{stats?.todaysTrips || 0}</p>
        </div>
        <div onClick={() => navigate('/guide/upcoming')} className="stat-card" style={{ cursor: 'pointer', borderLeft: '4px solid #3498db', background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
          <h3 style={{ fontSize: '1.2rem', color: '#7f8c8d', marginBottom: '10px' }}>Upcoming Tours</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: '#3498db' }}>{stats?.upcomingTrips || 0}</p>
        </div>
        <div onClick={() => navigate('/guide/in-progress')} className="stat-card" style={{ cursor: 'pointer', borderLeft: '4px solid #9b59b6', background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
          <h3 style={{ fontSize: '1.2rem', color: '#7f8c8d', marginBottom: '10px' }}>In Progress</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: '#9b59b6' }}>{stats?.inProgressTours || 0}</p>
        </div>
        <div onClick={() => navigate('/guide/completed')} className="stat-card" style={{ cursor: 'pointer', borderLeft: '4px solid #2ecc71', background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
          <h3 style={{ fontSize: '1.2rem', color: '#7f8c8d', marginBottom: '10px' }}>Completed Tours</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: '#2ecc71' }}>{stats?.completedTrips || 0}</p>
        </div>
        <div onClick={() => navigate('/guide/cancelled')} className="stat-card" style={{ cursor: 'pointer', borderLeft: '4px solid #e74c3c', background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
          <h3 style={{ fontSize: '1.2rem', color: '#7f8c8d', marginBottom: '10px' }}>Cancelled Tours</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: '#e74c3c' }}>{stats?.cancelledTours || 0}</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div style={{ background: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
          <h3 style={{ borderBottom: '2px solid #f1f2f6', paddingBottom: '10px' }}>Quick Actions</h3>
          <ul style={{ listStyle: 'none', padding: 0, marginTop: '20px' }}>
            <li style={{ marginBottom: '10px' }}><Link to="/guide/assigned" style={{ color: '#3498db', textDecoration: 'none', fontWeight: 'bold' }}>→ View Assigned Trips</Link></li>
            <li style={{ marginBottom: '10px' }}><Link to="/guide/today" style={{ color: '#3498db', textDecoration: 'none', fontWeight: 'bold' }}>→ Manage Today's Tours</Link></li>
            <li style={{ marginBottom: '10px' }}><Link to="/guide/customers" style={{ color: '#3498db', textDecoration: 'none', fontWeight: 'bold' }}>→ View Customers ({stats?.travellersCount || 0})</Link></li>
          </ul>
        </div>
        <div style={{ background: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
          <h3 style={{ borderBottom: '2px solid #f1f2f6', paddingBottom: '10px' }}>Recent Notifications</h3>
          <p style={{ marginTop: '20px', color: '#7f8c8d' }}>
            {stats?.unreadNotifications > 0 ? `You have ${stats.unreadNotifications} new messages.` : 'No new notifications at this time.'}
          </p>
          <Link to="/guide/notifications" className="btn-secondary" style={{ display: 'inline-block', marginTop: '10px' }}>Go to Inbox</Link>
        </div>
      </div>
    </div>
  );
};

export default TourGuideDashboard;
