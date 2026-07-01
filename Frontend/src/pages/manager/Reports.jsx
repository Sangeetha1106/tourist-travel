import { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import Loader from '../../components/Loader';

const Reports = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/manager/dashboard-stats');
      if (res.data.success) {
        setStats(res.data.data);
      }
    } catch (err) {
      setError('Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="page-container">
      <div className="page-header" style={{ marginBottom: '30px' }}>
        <h2>Reports</h2>
        <p>Operational reports and analytics</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
        <div style={{ background: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
          <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '20px' }}>Tour Operations Report</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px dashed #eee' }}>
              <span>Upcoming Tours</span>
              <strong>{stats?.upcomingTours || 0}</strong>
            </li>
            <li style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px dashed #eee' }}>
              <span>Ongoing Tours</span>
              <strong>{stats?.ongoingTours || 0}</strong>
            </li>
            <li style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px dashed #eee' }}>
              <span>Completed Tours</span>
              <strong>{stats?.completedTours || 0}</strong>
            </li>
            <li style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0' }}>
              <span>Cancelled Tours</span>
              <strong>{stats?.cancelledTours || 0}</strong>
            </li>
          </ul>
          <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
             <button className="btn-secondary" onClick={() => window.print()}>Print Report</button>
          </div>
        </div>

        <div style={{ background: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
          <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '20px' }}>Logistics Report</h3>
          <p style={{ color: '#7f8c8d' }}>Pending Assignments: <strong>{stats?.pendingAssignments || 0}</strong></p>
          <p style={{ color: '#7f8c8d' }}>Guide Assigned: <strong>{stats?.guideAssigned || 0}</strong></p>
          
          <div style={{ marginTop: '20px', padding: '15px', background: '#f8fafc', borderRadius: '8px' }}>
            <strong>Note:</strong> Comprehensive revenue and performance metrics are currently available in the Admin dashboard.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
