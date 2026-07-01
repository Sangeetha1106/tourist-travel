import { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import Loader from '../../components/Loader';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/manager/customers');
      if (res.data.success) {
        setCustomers(res.data.data);
      }
    } catch (err) {
      setError('Failed to fetch customers');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="page-container">
      <div className="page-header" style={{ marginBottom: '30px' }}>
        <h2>Customers</h2>
        <p>Display all customers with confirmed bookings</p>
      </div>

      <div style={{ background: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Travel Date</th>
                <th>Payment Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.length > 0 ? customers.map(c => (
                <tr key={c.id}>
                  <td>{c.customerName}</td>
                  <td>{c.phone}</td>
                  <td>{c.email}</td>
                  <td>{new Date(c.travelDate).toLocaleDateString()}</td>
                  <td><span className="badge badge-success">{c.paymentStatus}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <a href={`mailto:${c.email}`} className="btn-secondary btn-sm" style={{ padding: '5px 10px' }}>Send Email</a>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>No customers available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Customers;
