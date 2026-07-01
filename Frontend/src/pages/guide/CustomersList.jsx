import { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import Loader from '../../components/Loader';

const CustomersList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await axiosInstance.get('/guide/customers');
      if (res.data.success) {
        setCustomers(res.data.data);
      }
    } catch (err) {
      setError('Failed to load customers.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="page-container" style={{ maxWidth: '1200px' }}>
      <div className="page-header">
        <h2>Assigned Customers</h2>
        <p>View details of all travellers assigned to you.</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="table-container" style={{ background: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
        <table className="custom-table">
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Contact Info</th>
              <th>Emergency Contact</th>
              <th>Package</th>
              <th>Travel Date</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c, idx) => (
              <tr key={idx}>
                <td style={{ fontWeight: 'bold', color: '#2c3e50' }}>{c.name}</td>
                <td>
                  <div style={{ fontSize: '0.85rem' }}>{c.email}</div>
                  <div style={{ fontSize: '0.85rem' }}>{c.phone}</div>
                </td>
                <td>
                  <div style={{ fontSize: '0.85rem' }}>{c.emergencyContactName}</div>
                  <div style={{ fontSize: '0.85rem', color: '#e74c3c' }}>{c.emergencyContactNumber}</div>
                </td>
                <td>{c.package}</td>
                <td>{new Date(c.travelDate).toLocaleDateString()}</td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: '#7f8c8d' }}>
                  No customers assigned to you currently.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomersList;
