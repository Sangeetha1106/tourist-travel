import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import Loader from '../components/Loader';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Search, Filter, Pagination state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const endpoint = user?.role === 'TOUR_MANAGER' ? '/manager/bookings' : '/admin/bookings';
      const res = await axiosInstance.get(endpoint);
      if (res.data.success) {
        setBookings(res.data.data);
      }
    } catch (err) {
      setError('Failed to load bookings.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if(!window.confirm(`Are you sure you want to cancel this booking?`)) return;
    try {
      await axiosInstance.patch(`/admin/bookings/${id}/cancel`);
      alert('Booking cancelled successfully.');
      fetchBookings();
    } catch (err) {
      alert('Failed to cancel booking.');
    }
  };

  const handleApprove = async (id) => {
    if(!window.confirm('Approve this booking?')) return;
    try {
      await axiosInstance.patch(`/admin/bookings/${id}/approve`);
      alert('Booking approved successfully.');
      fetchBookings();
    } catch (err) {
      alert('Failed to approve booking.');
    }
  };

  const handleReject = async (id) => {
    const reason = window.prompt('Enter reason for rejection:');
    if(reason === null) return;
    try {
      await axiosInstance.patch(`/admin/bookings/${id}/reject`, { rejectionReason: reason || 'Admin rejected' });
      alert('Booking rejected.');
      fetchBookings();
    } catch (err) {
      alert('Failed to reject booking.');
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm('Are you sure you want to completely delete this booking from the database? This cannot be undone.')) return;
    try {
      await axiosInstance.delete(`/admin/bookings/${id}`);
      alert('Booking deleted.');
      fetchBookings();
    } catch (err) {
      alert('Failed to delete booking.');
    }
  };

  const handleExportCSV = () => {
    // Generate CSV string
    const headers = ['Booking ID', 'Customer Name', 'Package', 'Travel Date', 'Amount', 'Status'];
    const csvRows = [headers.join(',')];
    
    filteredBookings.forEach(b => {
      const row = [
        b.bookingNumber || b.id,
        `"${b.customerName}"`,
        `"${b.packageName || b.Package?.packageName}"`,
        new Date(b.travelDate).toLocaleDateString(),
        b.totalAmount,
        b.bookingStatus
      ];
      csvRows.push(row.join(','));
    });

    const csvData = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const csvUrl = URL.createObjectURL(csvData);
    
    const link = document.createElement('a');
    link.href = csvUrl;
    link.download = `bookings_export_${new Date().getTime()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Derived state for filtering and pagination
  const filteredBookings = bookings.filter(b => {
    const matchesSearch = (b.bookingNumber && b.bookingNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (b.customerName && b.customerName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter ? b.bookingStatus === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const currentBookings = filteredBookings.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (loading) return <Loader />;

  return (
    <div className="page-container" style={{ maxWidth: '1400px' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>Admin Booking Management</h2>
          <p>Full control over all platform bookings.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-secondary" onClick={fetchBookings}>Refresh</button>
          <button className="btn-primary" onClick={handleExportCSV} style={{ background: '#27ae60', border: 'none' }}>Export Report</button>
        </div>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      {/* Controls */}
      <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', background: '#fff', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <input 
          type="text" 
          placeholder="Search by ID or Customer..." 
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
          <option value="PENDING">Pending</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="GUIDE_ASSIGNED">Guide Assigned</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      <div className="table-container">
        <table className="custom-table" style={{ fontSize: '0.9rem' }}>
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Customer</th>
              <th>Package</th>
              <th>Travel Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentBookings.map(b => (
              <tr key={b.id}>
                <td><strong>{b.bookingNumber || `#${b.id}`}</strong></td>
                <td>
                  <div><strong>{b.customerName}</strong></div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{b.phone}</div>
                </td>
                <td>{b.packageName || b.Package?.packageName}</td>
                <td>{new Date(b.travelDate).toLocaleDateString()}</td>
                <td style={{ fontWeight: 700, color: 'var(--primary-dark)' }}>₹{b.totalAmount}</td>
                <td>
                  <span className={`badge badge-${b.bookingStatus === 'COMPLETED' ? 'success' : b.bookingStatus === 'REJECTED' ? 'danger' : 'warning'}`}>
                    {b.bookingStatus.replace(/_/g, ' ')}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                    <button className="btn-secondary" style={{ padding: '5px 10px', fontSize: '0.8rem', border: '1px solid #bdc3c7' }} onClick={() => {
                      const user = JSON.parse(localStorage.getItem('user'));
                      const prefix = user?.role === 'TOUR_MANAGER' ? '/manager' : '/admin';
                      navigate(`${prefix}/bookings/${b.id}`);
                    }}>View</button>
                    {JSON.parse(localStorage.getItem('user'))?.role !== 'TOUR_MANAGER' && (
                      <button className="btn-primary" style={{ padding: '5px 10px', fontSize: '0.8rem', background: '#f39c12', border: 'none' }} onClick={() => navigate(`/admin/bookings/${b.id}/edit`)}>Edit</button>
                    )}
                    {JSON.parse(localStorage.getItem('user'))?.role !== 'TOUR_MANAGER' && b.bookingStatus === 'PENDING' && (
                      <>
                        <button className="btn-primary" style={{ padding: '5px 10px', fontSize: '0.8rem', backgroundColor: '#2ed573', border: 'none' }} onClick={() => handleApprove(b.id)}>Approve</button>
                        <button className="btn-danger" style={{ padding: '5px 10px', fontSize: '0.8rem', backgroundColor: '#ff4757', color: 'white', border: 'none' }} onClick={() => handleReject(b.id)}>Reject</button>
                      </>
                    )}
                    {JSON.parse(localStorage.getItem('user'))?.role !== 'TOUR_MANAGER' && b.bookingStatus !== 'REJECTED' && b.bookingStatus !== 'COMPLETED' && (
                      <button className="btn-danger" style={{ padding: '5px 10px', fontSize: '0.8rem', backgroundColor: '#e67e22', color: 'white', border: 'none' }} onClick={() => handleCancel(b.id)}>Cancel</button>
                    )}
                    {JSON.parse(localStorage.getItem('user'))?.role === 'SUPER_ADMIN' && (
                      <button className="btn-danger" style={{ padding: '5px 10px', fontSize: '0.8rem', backgroundColor: '#c0392b', color: 'white', border: 'none' }} onClick={() => handleDelete(b.id)}>Delete</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {currentBookings.length === 0 && (
              <tr><td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>No bookings found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', gap: '10px' }}>
          <button className="btn-secondary" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>Prev</button>
          <span style={{ padding: '8px 15px', background: '#fff', border: '1px solid #ddd', borderRadius: '4px' }}>Page {currentPage} of {totalPages}</span>
          <button className="btn-secondary" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>Next</button>
        </div>
      )}

    </div>
  );
};

export default AdminBookings;
