import { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import Loader from '../../components/Loader';
import { useNavigate } from 'react-router-dom';

const AssignedTrips = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const res = await axiosInstance.get('/guide/trips');
      if (res.data.success) {
        setTrips(res.data.data);
      }
    } catch (err) {
      setError('Failed to load trips.');
    } finally {
      setLoading(false);
    }
  };

  const handleStartTrip = async (id) => {
    if (!window.confirm('Are you sure you want to start this trip?')) return;
    try {
      await axiosInstance.patch(`/guide/trips/${id}/start`);
      alert('Trip Started!');
      fetchTrips();
    } catch (err) {
      alert('Failed to start trip.');
    }
  };

  const handleCompleteTrip = async (id) => {
    if (!window.confirm('Are you sure you want to complete this trip?')) return;
    try {
      await axiosInstance.patch(`/guide/trips/${id}/complete`);
      alert('Trip Completed!');
      fetchTrips();
    } catch (err) {
      alert('Failed to complete trip.');
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="page-container" style={{ maxWidth: '1400px' }}>
      <div className="page-header">
        <h2>Assigned Trips</h2>
        <p>Manage all your assigned itineraries.</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="trips-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
        {trips.length === 0 ? (
          <div style={{ padding: '30px', textAlign: 'center', background: '#fff', borderRadius: '8px' }}>
            No trips assigned yet.
          </div>
        ) : (
          trips.map(trip => (
            <div key={trip.id} style={{ background: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
              
              <div style={{ flex: 1, minWidth: '250px' }}>
                <h3 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>{trip.bookingNumber || `#${trip.id}`} - {trip.Package?.Destination?.name}</h3>
                <div style={{ color: '#7f8c8d', fontSize: '0.9rem', marginBottom: '5px' }}><strong>Package:</strong> {trip.Package?.name || trip.packageName}</div>
                <div style={{ color: '#7f8c8d', fontSize: '0.9rem', marginBottom: '5px' }}><strong>Customer:</strong> {trip.customerName} ({trip.phone})</div>
                <div style={{ color: '#7f8c8d', fontSize: '0.9rem', marginBottom: '5px' }}><strong>Travel Date:</strong> {new Date(trip.travelDate).toLocaleDateString()}</div>
              </div>

              <div style={{ flex: 1, minWidth: '250px', borderLeft: '1px solid #ecf0f1', paddingLeft: '20px' }}>
                <div style={{ color: '#7f8c8d', fontSize: '0.9rem', marginBottom: '5px' }}><strong>Pickup Loc:</strong> {trip.pickupLocation || 'N/A'}</div>
                <div style={{ color: '#7f8c8d', fontSize: '0.9rem', marginBottom: '5px' }}><strong>Pickup Time:</strong> {trip.pickupTime || 'N/A'}</div>
                <div style={{ color: '#7f8c8d', fontSize: '0.9rem', marginBottom: '5px' }}><strong>Vehicle:</strong> {trip.vehicleNumber || 'N/A'}</div>
                <div style={{ color: '#7f8c8d', fontSize: '0.9rem', marginBottom: '5px' }}><strong>Driver:</strong> {trip.driverName || 'N/A'}</div>
              </div>

              <div style={{ flex: 1, minWidth: '200px', textAlign: 'right' }}>
                <div style={{ marginBottom: '15px' }}>
                  <span className={`badge ${trip.bookingStatus === 'COMPLETED' ? 'badge-success' : trip.bookingStatus.includes('IN_PROGRESS') ? 'badge-primary' : 'badge-warning'}`}>
                    {trip.bookingStatus.replace(/_/g, ' ')}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                  <button className="btn-secondary" onClick={() => navigate(`/guide/trips/${trip.id}`)}>View Details</button>
                  
                  {trip.bookingStatus === 'GUIDE_ASSIGNED' && (
                    <button className="btn-primary" onClick={() => handleStartTrip(trip.id)}>Start Trip</button>
                  )}
                  
                  {trip.bookingStatus === 'IN_PROGRESS' && (
                    <>
                      <button className="btn-primary" style={{ backgroundColor: '#f39c12', border: 'none' }} onClick={() => navigate('/guide/progress', { state: { tripId: trip.id } })}>Update Progress</button>
                      <button className="btn-primary" style={{ backgroundColor: '#2ecc71', border: 'none' }} onClick={() => handleCompleteTrip(trip.id)}>Complete Trip</button>
                    </>
                  )}
                </div>
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AssignedTrips;
