import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import Loader from '../../components/Loader';

const CancelledTours = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // DataGrid State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortField, setSortField] = useState('updatedAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await axiosInstance.get('/manager/cancelled');
      if (res.data.success) {
        setBookings(res.data.data);
      }
    } catch (err) {
      setError('Failed to fetch cancelled tours');
    } finally {
      setLoading(false);
    }
  };

  // Filter
  const filteredBookings = bookings.filter(b => {
    const matchesSearch = 
      (b.customerName && b.customerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (b.bookingNumber && b.bookingNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (b.packageName && b.packageName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter ? b.bookingStatus === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  // Sort
  const sortedBookings = [...filteredBookings].sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];
    if (sortField === 'travelDate' || sortField === 'updatedAt') {
      valA = new Date(valA).getTime();
      valB = new Date(valB).getTime();
    }
    if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedBookings.length / itemsPerPage);
  const currentItems = sortedBookings.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getStatusBadge = (status) => {
    if (status === 'REJECTED') return 'badge-warning';
    return 'badge-danger';
  };

  if (loading) return <Loader />;

  return (
    <div className="page-container">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h2>Cancelled & Rejected Tours</h2>
          <p>Trips that were cancelled or rejected by operations.</p>
        </div>
        <button className="btn-secondary" onClick={fetchData}>↻ Refresh Data</button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div style={{ background: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
        
        {/* Toolbar */}
        <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <input 
            type="text" 
            placeholder="Search by ID, Customer, or Package..." 
            className="form-control" 
            style={{ maxWidth: '300px' }} 
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
          <select 
            className="form-control" 
            style={{ maxWidth: '200px' }}
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
          >
            <option value="">All Statuses</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="REJECTED">Rejected</option>
          </select>
          <select 
            className="form-control" 
            style={{ maxWidth: '200px' }}
            value={`${sortField}-${sortOrder}`}
            onChange={(e) => { 
              const [field, order] = e.target.value.split('-');
              setSortField(field); setSortOrder(order);
            }}
          >
            <option value="updatedAt-desc">Cancellation Date (Latest)</option>
            <option value="travelDate-desc">Travel Date (Latest)</option>
          </select>
        </div>

        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Customer Name</th>
                <th>Package</th>
                <th>Travel Date</th>
                <th>Cancellation Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? currentItems.map(b => (
                <tr key={b.id}>
                  <td><strong>{b.bookingNumber || `#${b.id}`}</strong></td>
                  <td>{b.customerName}</td>
                  <td>{b.packageName}</td>
                  <td>{new Date(b.travelDate).toLocaleDateString()}</td>
                  <td>{new Date(b.updatedAt).toLocaleDateString()}</td>
                  <td><span className={`badge ${getStatusBadge(b.bookingStatus)}`}>{b.bookingStatus}</span></td>
                  <td>
                    <Link to={`/admin/bookings/${b.id}`} className="btn-secondary btn-sm" style={{ padding: '5px 10px' }}>View Details</Link>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>No cancelled tours found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', gap: '10px' }}>
            <button className="btn-secondary" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>Prev</button>
            <span style={{ padding: '8px 15px', background: '#f8f9fa', borderRadius: '4px' }}>Page {currentPage} of {totalPages}</span>
            <button className="btn-secondary" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>Next</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CancelledTours;
