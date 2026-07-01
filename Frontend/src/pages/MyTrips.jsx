import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getMyBookings } from '../api/bookingApi';
import Loader from '../components/Loader';

const MyTrips = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await getMyBookings();
        if (res.success) {
          // Sort by newest first
          setBookings(res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        }
      } catch (err) {
        setError('Failed to load bookings.');
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  if (loading) return <Loader />;

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'PENDING': return 'badge-warning';
      case 'CONFIRMED': return 'badge-confirmed';
      case 'GUIDE_ASSIGNED': return 'badge-info';
      case 'IN_PROGRESS': return 'badge-primary';
      case 'COMPLETED': return 'badge-success';
      case 'REJECTED': return 'badge-danger';
      default: return 'badge-secondary';
    }
  };

  const getStatusDisplay = (status) => {
    return status.replace(/_/g, ' ');
  };

  return (
    <div className="page-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
      <div className="page-header" style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '2rem', color: '#2d3436' }}>My Trips</h2>
        <p style={{ color: '#636e72' }}>Manage your upcoming and past adventures.</p>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      {bookings.length === 0 && !error ? (
        <div style={{ textAlign: 'center', padding: '80px 20px', background: '#f8f9fa', borderRadius: '12px' }}>
          <h3 style={{ fontSize: '1.5rem', color: '#2d3436', marginBottom: '10px' }}>You have no active trips booked.</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>Ready for an adventure? Check out our tour packages!</p>
          <Link to="/" className="btn-primary" style={{ padding: '12px 25px' }}>Explore Packages</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '30px' }}>
          {bookings.map(b => (
            <div key={b.id} style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', overflow: 'hidden', border: '1px solid #edf2f7' }}>
              
              {/* Card Header */}
              <div style={{ padding: '20px 25px', borderBottom: '1px solid #edf2f7', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc', flexWrap: 'wrap', gap: '15px' }}>
                <div>
                  <h3 style={{ margin: '0 0 5px 0', fontSize: '1.3rem', color: '#1e293b' }}>{b.Package?.Destination?.name || 'Unknown Destination'} - {b.packageName}</h3>
                  <div style={{ color: '#64748b', fontSize: '0.9rem', display: 'flex', gap: '15px' }}>
                    <span><strong>{b.bookingNumber || `Booking #${b.id}`}</strong></span>
                    <span>Travel Date: {new Date(b.travelDate).toLocaleDateString()}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                  <span className={`badge ${getStatusBadgeClass(b.bookingStatus)}`} style={{ padding: '6px 12px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                    {getStatusDisplay(b.bookingStatus)}
                  </span>
                  {b.bookingStatus === 'PENDING' && (
                    <span style={{ color: '#e74c3c', fontSize: '0.85rem', fontWeight: '600' }}>Payment Pending</span>
                  )}
                  {b.Payment?.paymentStatus === 'COMPLETED' && (
                    <span style={{ color: '#2ecc71', fontSize: '0.85rem', fontWeight: '600' }}>Payment Successful</span>
                  )}
                </div>
              </div>

              {/* Card Body */}
              <div style={{ padding: '25px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
                
                {/* Left Side: Booking Details */}
                <div>
                  <h4 style={{ fontSize: '1.1rem', color: '#334155', marginBottom: '15px', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px' }}>Trip Summary</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: '10px', fontSize: '0.95rem', color: '#475569' }}>
                    <span style={{ fontWeight: '600' }}>Primary Guest:</span> <span>{b.customerName}</span>
                    <span style={{ fontWeight: '600' }}>Total Travellers:</span> <span>{b.totalPersons} (Adults), {b.childrenCount} (Children)</span>
                    <span style={{ fontWeight: '600' }}>Total Amount:</span> <span style={{ fontWeight: '700', color: '#0f172a' }}>₹{parseFloat(b.totalAmount).toLocaleString('en-IN')}</span>
                    <span style={{ fontWeight: '600' }}>Booking Date:</span> <span>{new Date(b.createdAt).toLocaleDateString()}</span>
                  </div>
                  
                  {b.rejectionReason && (
                    <div style={{ marginTop: '15px', padding: '15px', background: '#fef2f2', borderLeft: '4px solid #ef4444', borderRadius: '4px' }}>
                      <strong style={{ color: '#b91c1c' }}>Rejection Reason:</strong>
                      <p style={{ margin: '5px 0 0 0', color: '#991b1b', fontSize: '0.9rem' }}>{b.rejectionReason}</p>
                    </div>
                  )}
                </div>

                {/* Right Side: Assignment & Tracking */}
                <div>
                  <h4 style={{ fontSize: '1.1rem', color: '#334155', marginBottom: '15px', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px' }}>Logistics & Operations</h4>
                  {b.bookingStatus === 'PENDING' ? (
                    <div style={{ color: '#64748b', fontSize: '0.95rem', padding: '20px', background: '#f8fafc', borderRadius: '8px', textAlign: 'center' }}>
                      Your trip logistics are currently being organized. Tour Manager approval is pending.
                    </div>
                  ) : b.bookingStatus === 'REJECTED' ? (
                    <div style={{ color: '#64748b', fontSize: '0.95rem', padding: '20px', background: '#fef2f2', borderRadius: '8px', textAlign: 'center', color: '#b91c1c' }}>
                      This trip is no longer active.
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: '10px', fontSize: '0.95rem', color: '#475569' }}>
                      <span style={{ fontWeight: '600' }}>Driver Name:</span> <span>{b.driverName || 'TBA'}</span>
                      <span style={{ fontWeight: '600' }}>Vehicle Info:</span> <span>{b.vehicleNumber || 'TBA'}</span>
                      <span style={{ fontWeight: '600' }}>Hotel:</span> <span>{b.hotelName || 'TBA'}</span>
                      <span style={{ fontWeight: '600' }}>Pickup Loc:</span> <span>{b.pickupLocation || 'TBA'}</span>
                      <span style={{ fontWeight: '600' }}>Pickup Time:</span> <span>{b.pickupTime || 'TBA'}</span>
                    </div>
                  )}
                </div>

              </div>

              {/* Progress Tracking Section */}
              {(b.bookingStatus === 'IN_PROGRESS' || b.bookingStatus === 'COMPLETED') && b.tripProgress && b.tripProgress.length > 0 && (
                <div style={{ padding: '0 25px 20px', borderTop: '1px dashed #e2e8f0' }}>
                  <h4 style={{ fontSize: '1rem', color: '#334155', margin: '20px 0 15px' }}>Live Trip Progress</h4>
                  <ul style={{ listStyleType: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {b.tripProgress.map((note, index) => (
                      <li key={index} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: '#0f172a' }}>
                        <span style={{ color: '#10b981', fontWeight: 'bold' }}>✓</span> {note}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Actions Footer */}
              <div style={{ padding: '15px 25px', backgroundColor: '#f8fafc', borderTop: '1px solid #edf2f7', display: 'flex', gap: '15px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                {b.bookingStatus === 'PENDING' && (
                  <Link to={`/payment/${b.id}`} className="btn-primary" style={{ padding: '8px 20px' }}>Pay Now</Link>
                )}
                
                {b.bookingStatus !== 'PENDING' && (
                  <Link to={`/payment/success?bookingId=${b.id}`} className="btn-secondary" style={{ padding: '8px 20px', border: '1px solid #cbd5e1', background: '#fff', color: '#334155' }}>
                    View Receipt
                  </Link>
                )}
                
                {b.bookingStatus === 'COMPLETED' && (
                  <button className="btn-primary" style={{ padding: '8px 20px', background: '#f59e0b', border: 'none' }}>
                    ★ Write a Review
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTrips;
