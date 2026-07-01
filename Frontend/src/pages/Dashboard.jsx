import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDashboardStats } from '../api/dashboardApi';
import Loader from '../components/Loader';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const canViewStats = user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN';

  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (canViewStats) {
          const res = await getDashboardStats();
          if (res.success) setStats(res.data);
        }
      } catch (err) {
        setError('Failed to load dashboard stats.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [canViewStats]);

  if (loading) return <Loader />;

  if (canViewStats) {
    return (
      <div className="page-container" style={{ maxWidth: '1400px' }}>
        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2>Admin Analytics Dashboard</h2>
            <p>Click on any card to view detailed records.</p>
          </div>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="stats-grid" style={{ marginBottom: '40px' }}>
          <div className="stat-card" style={{ borderLeft: '4px solid #3498db', cursor: 'pointer' }} onClick={() => navigate('/admin/bookings')}>
            <h3>View Bookings</h3>
            <p style={{ color: '#3498db', fontSize: '2rem', margin: '10px 0 0' }}>{stats?.totalBookings || 0}</p>
          </div>
          <div className="stat-card" style={{ borderLeft: '4px solid #f39c12', cursor: 'pointer' }} onClick={() => navigate('/admin/bookings')}>
            <h3>Pending Bookings</h3>
            <p style={{ color: '#f39c12', fontSize: '2rem', margin: '10px 0 0' }}>{stats?.pendingBookings || 0}</p>
          </div>
          <div className="stat-card" style={{ borderLeft: '4px solid #2ecc71', cursor: 'pointer' }} onClick={() => navigate('/admin/destinations')}>
            <h3>View Destinations</h3>
            <p style={{ color: '#2ecc71', fontSize: '2rem', margin: '10px 0 0' }}>{stats?.totalDestinations || 0}</p>
          </div>
          <div className="stat-card" style={{ borderLeft: '4px solid #1abc9c', cursor: 'pointer' }} onClick={() => navigate('/admin/packages')}>
            <h3>View Packages</h3>
            <p style={{ color: '#1abc9c', fontSize: '2rem', margin: '10px 0 0' }}>{stats?.totalPackages || 0}</p>
          </div>
          <div className="stat-card" style={{ borderLeft: '4px solid #9b59b6', cursor: 'pointer' }} onClick={() => navigate('/admin/users')}>
            <h3>View Customers</h3>
            <p style={{ color: '#9b59b6', fontSize: '2rem', margin: '10px 0 0' }}>{stats?.totalUsers || 0}</p>
          </div>
          <div className="stat-card" style={{ borderLeft: '4px solid #e74c3c', cursor: 'pointer' }} onClick={() => navigate('/admin/payments')}>
            <h3>View Payments</h3>
            <p style={{ color: '#e74c3c', fontSize: '2rem', margin: '10px 0 0' }}>₹{stats?.totalRevenue?.toLocaleString('en-IN') || 0}</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
          <div style={{ background: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #f1f2f6', paddingBottom: '10px', marginBottom: '20px' }}>
              <h3 style={{ margin: 0 }}>Recent Bookings</h3>
              <button className="btn-secondary" style={{ padding: '5px 15px', fontSize: '0.8rem' }} onClick={() => navigate('/admin/bookings')}>See All</button>
            </div>
            <div style={{ padding: '20px', background: '#f8f9fa', borderRadius: '8px', textAlign: 'center', color: '#7f8c8d' }}>
              Detailed recent bookings have been moved to the View Bookings page.
            </div>
          </div>
          
          <div style={{ background: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #f1f2f6', paddingBottom: '10px', marginBottom: '20px' }}>
              <h3 style={{ margin: 0 }}>Recent Payments</h3>
              <button className="btn-secondary" style={{ padding: '5px 15px', fontSize: '0.8rem' }} onClick={() => navigate('/admin/payments')}>See All</button>
            </div>
            <div style={{ padding: '20px', background: '#f8f9fa', borderRadius: '8px', textAlign: 'center', color: '#7f8c8d' }}>
              Payment history has been moved to the View Payments page.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="dashboard-welcome">
        <h2>Unauthorized</h2>
        <p>You do not have permission to view this dashboard.</p>
      </div>
    </div>
  );
};

export default Dashboard;
