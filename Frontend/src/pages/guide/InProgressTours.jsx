import { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import Loader from '../../components/Loader';
import { Link } from 'react-router-dom';

const InProgressTours = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTours = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/guide/in-progress');
      if (res.data.success) {
        setTours(res.data.data);
      }
    } catch (err) {
      setError('Failed to fetch in-progress tours.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTours();
  }, []);

  const handleAction = async (bookingId, action) => {
    try {
      const res = await axiosInstance.put(`/guide/${bookingId}/${action}`);
      if (res.data.success) {
        alert(`Tour ${action}d successfully!`);
        fetchTours();
      }
    } catch (err) {
      alert(`Failed to ${action} tour.`);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="page-container">
      <div className="page-header" style={{ marginBottom: '30px' }}>
        <h2>In Progress Tours</h2>
        <p>Tours you are currently guiding</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div style={{ background: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Customer</th>
                <th>Package / Dest</th>
                <th>Travel Date</th>
                <th>Logistics</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tours.length > 0 ? tours.map(t => (
                <tr key={t.id}>
                  <td><strong>{t.bookingNumber || `#${t.id}`}</strong></td>
                  <td>
                    <div>{t.customerName}</div>
                    <div style={{ fontSize: '0.85em', color: '#666' }}>{t.phone}</div>
                  </td>
                  <td>
                    <div>{t.Package?.packageName}</div>
                    <div style={{ fontSize: '0.85em', color: '#666' }}>{t.Package?.Destination?.name}</div>
                  </td>
                  <td>{new Date(t.travelDate).toLocaleDateString()}</td>
                  <td>
                    <div style={{ fontSize: '0.9em' }}>V: {t.vehicleNumber || 'N/A'}</div>
                    <div style={{ fontSize: '0.9em' }}>H: {t.hotelName || 'N/A'}</div>
                  </td>
                  <td><span className="badge badge-success">{t.bookingStatus}</span></td>
                  <td>
                    <button className="btn-primary btn-sm" style={{ padding: '5px 10px', marginRight: '5px' }} onClick={() => handleAction(t.id, 'complete')}>Complete Tour</button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>No records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InProgressTours;
