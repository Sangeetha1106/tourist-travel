import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import Loader from '../../components/Loader';

const OngoingTours = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // DataGrid State
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('travelDate');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await axiosInstance.get('/manager/ongoing');
      if (res.data.success) {
        setBookings(res.data.data);
      }
    } catch (err) {
      setError('Failed to fetch ongoing tours');
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
    
    return matchesSearch;
  });

  // Sort
  const sortedBookings = [...filteredBookings].sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];
    if (sortField === 'travelDate') {
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

  if (loading) return <Loader />;

  return (
    <div className="page-container">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h2>Ongoing Tours</h2>
          <p>Trips that are currently in progress.</p>
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
            value={`${sortField}-${sortOrder}`}
            onChange={(e) => { 
              const [field, order] = e.target.value.split('-');
              setSortField(field); setSortOrder(order);
            }}
          >
            <option value="travelDate-desc">Travel Date (Latest First)</option>
            <option value="travelDate-asc">Travel Date (Earliest First)</option>
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
                <th>Guide Assigned</th>
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
                  <td>{b.guideId ? `Guide #${b.guideId}` : 'None'}</td>
                  <td><span className="badge badge-primary">IN PROGRESS</span></td>
                  <td>
                    <Link to={`/admin/bookings/${b.id}`} className="btn-secondary btn-sm" style={{ padding: '5px 10px' }}>View Details</Link>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>No ongoing tours right now.</td>
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

export default OngoingTours;
