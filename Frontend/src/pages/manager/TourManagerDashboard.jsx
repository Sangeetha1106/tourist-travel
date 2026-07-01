import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import Loader from '../../components/Loader';

const TourManagerDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, bookingsRes] = await Promise.all([
        axiosInstance.get('/manager/dashboard-stats'),
        axiosInstance.get('/manager/bookings')
      ]);
      if (statsRes.data.success) setStats(statsRes.data.data);
      if (bookingsRes.data.success) {
        setRecentBookings(bookingsRes.data.data.slice(0, 10)); // Just recent ones
      }
    } catch (err) {
      setError('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="page-container">
      <div className="page-header" style={{ marginBottom: '30px' }}>
        <h2>Tour Manager Dashboard</h2>
        <p>Overview of operations and assignments</p>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <div onClick={() => navigate('/manager/bookings?status=CONFIRMED')} style={{ cursor: 'pointer', background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', borderLeft: '4px solid #f39c12' }}>
          <h3 style={{ fontSize: '2rem', margin: '0 0 10px', color: '#f39c12' }}>{stats?.pendingAssignments || 0}</h3>
          <p style={{ margin: 0, color: '#7f8c8d' }}>Pending Assignments</p>
        </div>
        <div onClick={() => navigate('/manager/assignments?status=GUIDE_ASSIGNED')} style={{ cursor: 'pointer', background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', borderLeft: '4px solid #3498db' }}>
          <h3 style={{ fontSize: '2rem', margin: '0 0 10px', color: '#3498db' }}>{stats?.guideAssigned || 0}</h3>
          <p style={{ margin: 0, color: '#7f8c8d' }}>Guide Assigned</p>
        </div>
        <div onClick={() => navigate('/manager/upcoming-tours')} style={{ cursor: 'pointer', background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', borderLeft: '4px solid #9b59b6' }}>
          <h3 style={{ fontSize: '2rem', margin: '0 0 10px', color: '#9b59b6' }}>{stats?.upcomingTours || 0}</h3>
          <p style={{ margin: 0, color: '#7f8c8d' }}>Upcoming Tours</p>
        </div>
        <div onClick={() => navigate('/manager/ongoing-tours')} style={{ cursor: 'pointer', background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', borderLeft: '4px solid #f1c40f' }}>
          <h3 style={{ fontSize: '2rem', margin: '0 0 10px', color: '#f1c40f' }}>{stats?.ongoingTours || 0}</h3>
          <p style={{ margin: 0, color: '#7f8c8d' }}>Ongoing Tours</p>
        </div>
        <div onClick={() => navigate('/manager/completed-tours')} style={{ cursor: 'pointer', background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', borderLeft: '4px solid #2ecc71' }}>
          <h3 style={{ fontSize: '2rem', margin: '0 0 10px', color: '#2ecc71' }}>{stats?.completedTours || 0}</h3>
          <p style={{ margin: 0, color: '#7f8c8d' }}>Completed Tours</p>
        </div>
        <div onClick={() => navigate('/manager/cancelled-tours')} style={{ cursor: 'pointer', background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', borderLeft: '4px solid #e74c3c' }}>
          <h3 style={{ fontSize: '2rem', margin: '0 0 10px', color: '#e74c3c' }}>{stats?.cancelledTours || 0}</h3>
          <p style={{ margin: 0, color: '#7f8c8d' }}>Cancelled Tours</p>
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div style={{ background: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
        <h3 style={{ marginBottom: '20px' }}>Recent Bookings</h3>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Customer</th>
                <th>Destination</th>
                <th>Travel Date</th>
                <th>Guide</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.length > 0 ? recentBookings.map(b => (
                <tr key={b.id}>
                  <td>{b.bookingNumber || `#${b.id}`}</td>
                  <td>{b.customerName}</td>
                  <td>{b.packageName}</td>
                  <td>{new Date(b.travelDate).toLocaleDateString()}</td>
                  <td>{b.guideId ? `Assigned (${b.guideId})` : 'Pending'}</td>
                  <td><span className="badge badge-primary">{b.bookingStatus}</span></td>
                  <td>
                    <Link to={`/manager/bookings`} className="btn-secondary btn-sm" style={{ padding: '5px 10px' }}>View / Assign</Link>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>No recent bookings found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TourManagerDashboard;
