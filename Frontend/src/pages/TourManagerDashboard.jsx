import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import Loader from '../components/Loader';

const TourManagerDashboard = () => {
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Modals state
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [activeBooking, setActiveBooking] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  
  const [guidesList, setGuidesList] = useState([]);
  const [vehiclesList, setVehiclesList] = useState([]);
  const [hotelsList, setHotelsList] = useState([]);
  
  const [assignmentData, setAssignmentData] = useState({
    guideId: '',
    driverName: '',
    vehicleNumber: '',
    hotelName: '',
    pickupLocation: '',
    pickupTime: ''
  });

  const [activeTab, setActiveTab] = useState('CONFIRMED');

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, bookingsRes, guidesRes, vehiclesRes, hotelsRes] = await Promise.all([
        axiosInstance.get('/tour-managers/dashboard').catch(() => ({ data: { success: false }})),
        axiosInstance.get('/manager/bookings'),
        axiosInstance.get('/guides').catch(() => ({ data: { success: false, data: [] }})),
        axiosInstance.get('/vehicles').catch(() => ({ data: { success: false, data: [] }})),
        axiosInstance.get('/hotels').catch(() => ({ data: { success: false, data: [] }}))
      ]);
      
      if (statsRes.data?.success) {
        setStats(statsRes.data.data);
      }
      if (bookingsRes.data?.success) {
        setBookings(bookingsRes.data.data);
      }
      if (guidesRes.data?.success) setGuidesList(guidesRes.data.data || []);
      if (vehiclesRes.data?.success) setVehiclesList(vehiclesRes.data.data || []);
      if (hotelsRes.data?.success) setHotelsList(hotelsRes.data.data || []);
    } catch (err) {
      setError('Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    if(window.confirm('Approve this booking?')) {
      try {
        await axiosInstance.patch(`/manager/bookings/${id}/approve`);
        alert('Booking Approved! Status changed to CONFIRMED.');
        fetchData();
      } catch(err) {
        alert('Failed to approve booking');
      }
    }
  };

  const handleRejectSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.patch(`/manager/bookings/${activeBooking.id}/reject`, { rejectionReason });
      alert('Booking Rejected successfully.');
      setShowRejectModal(false);
      setRejectionReason('');
      fetchData();
    } catch(err) {
      alert('Failed to reject booking');
    }
  };

  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.patch(`/manager/bookings/${activeBooking.id}/assign-logistics`, assignmentData);
      alert('Guide and logistics assigned successfully!');
      setShowAssignModal(false);
      setAssignmentData({ guideId: '', driverName: '', vehicleNumber: '', hotelName: '', pickupLocation: '', pickupTime: '' });
      fetchData();
    } catch(err) {
      alert('Failed to assign details');
    }
  };

  if (loading) return <Loader />;

  // Grouping bookings
  const confirmedBookings = bookings.filter(b => b.bookingStatus === 'CONFIRMED');
  const assignedBookings = bookings.filter(b => b.bookingStatus === 'GUIDE_ASSIGNED' || b.bookingStatus === 'IN_PROGRESS');
  const rejectedBookings = bookings.filter(b => b.bookingStatus === 'REJECTED');

  const displayedBookings = 
    activeTab === 'CONFIRMED' ? confirmedBookings :
    activeTab === 'GUIDE_ASSIGNED' ? assignedBookings : rejectedBookings;

  return (
    <div className="page-container" style={{ maxWidth: '1400px' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <h2>Tour Manager Operations Dashboard</h2>
          <p>Welcome back, {user?.firstName}!</p>
        </div>
        <button className="btn-secondary" onClick={fetchData}>Refresh</button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="stats-grid" style={{ marginBottom: '40px' }}>
        <div className="stat-card" style={{ borderLeft: '4px solid #3498db' }}>
          <h3>Confirmed (Needs Assignment)</h3>
          <p style={{ color: '#3498db' }}>{confirmedBookings.length}</p>
        </div>
        <div className="stat-card" style={{ borderLeft: '4px solid #9b59b6' }}>
          <h3>Currently Assigned</h3>
          <p style={{ color: '#9b59b6' }}>{assignedBookings.length}</p>
        </div>
        <div className="stat-card" style={{ borderLeft: '4px solid #e74c3c' }}>
          <h3>Rejected</h3>
          <p style={{ color: '#e74c3c' }}>{rejectedBookings.length}</p>
        </div>
      </div>

      <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '25px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
        
        {/* Tabs */}
        <div style={{ display: 'flex', gap: '20px', borderBottom: '2px solid #f1f2f6', marginBottom: '20px' }}>
          {['CONFIRMED', 'GUIDE_ASSIGNED', 'REJECTED'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{ 
                padding: '10px 15px', 
                background: 'none', 
                border: 'none', 
                borderBottom: activeTab === tab ? '3px solid #3498db' : '3px solid transparent',
                color: activeTab === tab ? '#3498db' : '#7f8c8d',
                fontWeight: activeTab === tab ? 'bold' : 'normal',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              {tab.replace('_', ' ')}
            </button>
          ))}
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
              {displayedBookings.map(b => (
                <tr key={b.id}>
                  <td><strong>{b.bookingNumber || `#${b.id}`}</strong></td>
                  <td>
                    <div style={{ fontWeight: 'bold' }}>{b.customerName}</div>
                    <div style={{ fontSize: '0.8rem', color: '#7f8c8d' }}>{b.phone}</div>
                  </td>
                  <td>{b.packageName || b.Package?.packageName}</td>
                  <td>{new Date(b.travelDate).toLocaleDateString()}</td>
                  <td>₹{b.totalAmount}</td>
                  <td>
                    <span className={`badge ${b.bookingStatus === 'PENDING' ? 'badge-warning' : b.bookingStatus === 'REJECTED' ? 'badge-danger' : 'badge-confirmed'}`}>
                      {b.bookingStatus.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <button className="btn-secondary" onClick={() => navigate(`/manager/bookings/${b.id}`)} style={{ padding: '6px 12px', fontSize: '0.8rem', border: '1px solid #bdc3c7' }}>View Booking</button>
                      
                      {b.bookingStatus === 'CONFIRMED' && (
                        <>
                          <button className="btn-primary" onClick={() => { setActiveBooking(b); setShowAssignModal(true); }} style={{ padding: '6px 12px', fontSize: '0.8rem', backgroundColor: '#3498db', border: 'none' }}>Assign Logistics</button>
                          <button className="btn-danger" onClick={() => { setActiveBooking(b); setShowRejectModal(true); }} style={{ padding: '6px 12px', fontSize: '0.8rem', backgroundColor: '#ff4757', color: 'white', border: 'none', borderRadius: '4px' }}>Reject</button>
                        </>
                      )}
                      {(b.bookingStatus === 'GUIDE_ASSIGNED' || b.bookingStatus === 'IN_PROGRESS') && (
                        <button className="btn-primary" onClick={() => { 
                          setActiveBooking(b); 
                          setAssignmentData({
                            guideId: b.guideId || '',
                            driverName: b.driverName || '',
                            vehicleNumber: b.vehicleNumber || '',
                            hotelName: b.hotelName || '',
                            pickupLocation: b.pickupLocation || '',
                            pickupTime: b.pickupTime || ''
                          });
                          setShowAssignModal(true); 
                        }} style={{ padding: '6px 12px', fontSize: '0.8rem', backgroundColor: '#f39c12', border: 'none' }}>Edit Logistics</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {displayedBookings.length === 0 && (
                <tr><td colSpan="7" style={{ textAlign: 'center', padding: '30px' }}>No bookings found for this category.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', padding: '30px', borderRadius: '12px', width: '400px' }}>
            <h3 style={{ marginTop: 0, color: '#e74c3c' }}>Reject Booking #{activeBooking?.id}</h3>
            <form onSubmit={handleRejectSubmit}>
              <div className="form-group">
                <label>Reason for Rejection *</label>
                <select className="form-control" value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} required>
                  <option value="">Select Reason</option>
                  <option value="Seats Full">Seats Full</option>
                  <option value="Invalid Document / ID Proof">Invalid Document / ID Proof</option>
                  <option value="Travel Date Not Available">Travel Date Not Available</option>
                  <option value="Payment Verification Failed">Payment Verification Failed</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowRejectModal(false)} style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="btn-danger" style={{ flex: 1, backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px' }}>Confirm Reject</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Logistics Modal */}
      {showAssignModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', padding: '30px', borderRadius: '12px', width: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ marginTop: 0, color: '#3498db' }}>Assign Logistics for Booking #{activeBooking?.id}</h3>
            <form onSubmit={handleAssignSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div className="form-group">
                  <label>Assign Guide *</label>
                  <select 
                    className="form-control" 
                    value={assignmentData.guideId} 
                    onChange={e => setAssignmentData({...assignmentData, guideId: e.target.value})} 
                    required
                  >
                    <option value="">Select a Guide</option>
                    {guidesList.map(g => (
                      <option key={g.guideId} value={g.guideId}>{g.fullName} (Exp: {g.experience} yrs)</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Assign Vehicle *</label>
                  <select 
                    className="form-control" 
                    value={assignmentData.vehicleNumber} 
                    onChange={e => {
                      const selectedVehicle = vehiclesList.find(v => v.vehicleNumber === e.target.value);
                      setAssignmentData({
                        ...assignmentData, 
                        vehicleNumber: e.target.value,
                        driverName: selectedVehicle ? selectedVehicle.driverName : ''
                      });
                    }} 
                    required
                  >
                    <option value="">Select a Vehicle</option>
                    {vehiclesList.map(v => (
                      <option key={v.vehicleId} value={v.vehicleNumber}>{v.vehicleName} - {v.vehicleNumber}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Driver Name</label>
                  <input type="text" className="form-control" value={assignmentData.driverName} readOnly style={{ backgroundColor: '#f8f9fa' }} />
                </div>
                <div className="form-group">
                  <label>Assigned Hotel *</label>
                  <select 
                    className="form-control" 
                    value={assignmentData.hotelName} 
                    onChange={e => setAssignmentData({...assignmentData, hotelName: e.target.value})} 
                    required
                  >
                    <option value="">Select a Hotel</option>
                    {hotelsList.map(h => (
                      <option key={h.hotelId} value={h.hotelName}>{h.hotelName} - {h.destination}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label>Pickup Location *</label>
                  <input type="text" className="form-control" value={assignmentData.pickupLocation} onChange={e => setAssignmentData({...assignmentData, pickupLocation: e.target.value})} required />
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label>Pickup Time *</label>
                  <input type="time" className="form-control" value={assignmentData.pickupTime} onChange={e => setAssignmentData({...assignmentData, pickupTime: e.target.value})} required />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowAssignModal(false)} style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ flex: 2, backgroundColor: '#3498db', border: 'none' }}>Save Assignments</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TourManagerDashboard;
