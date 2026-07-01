import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import Loader from '../../components/Loader';

const TripDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTripDetails();
  }, [id]);

  const fetchTripDetails = async () => {
    try {
      const res = await axiosInstance.get(`/guide/trips/${id}`);
      if (res.data.success) {
        setTrip(res.data.data);
      }
    } catch (err) {
      setError('Failed to load trip details.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;
  if (error) return <div className="error-message">{error}</div>;
  if (!trip) return <div>Trip not found.</div>;

  return (
    <div className="page-container" style={{ maxWidth: '1000px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Trip Details - {trip.bookingNumber || `#${trip.id}`}</h2>
        <button className="btn-secondary" onClick={() => navigate(-1)}>Back</button>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        
        {/* Customer Details */}
        <div style={{ background: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
          <h3 style={{ borderBottom: '2px solid #f1f2f6', paddingBottom: '10px', marginTop: 0 }}>Customer Info</h3>
          <p><strong>Name:</strong> {trip.customerName}</p>
          <p><strong>Mobile:</strong> {trip.phone}</p>
          <p><strong>Email:</strong> {trip.email}</p>
          <p><strong>Emergency Contact:</strong> {trip.emergencyContactName} ({trip.emergencyContactNumber})</p>
          <p><strong>Persons:</strong> {trip.totalPersons}</p>
          <p><strong>Special Requests:</strong> {trip.specialRequests || 'None'}</p>
        </div>

        {/* Tour Details */}
        <div style={{ background: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
          <h3 style={{ borderBottom: '2px solid #f1f2f6', paddingBottom: '10px', marginTop: 0 }}>Tour Info</h3>
          <p><strong>Destination:</strong> {trip.Package?.Destination?.name}</p>
          <p><strong>Package:</strong> {trip.packageName}</p>
          <p><strong>Travel Date:</strong> {new Date(trip.travelDate).toLocaleDateString()}</p>
          <p><strong>Booking Status:</strong> <span className="badge badge-primary">{trip.bookingStatus.replace(/_/g, ' ')}</span></p>
          <p><strong>Payment Status:</strong> <span className="badge badge-success">Completed</span></p>
        </div>

        {/* Logistics */}
        <div style={{ background: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', gridColumn: '1 / -1' }}>
          <h3 style={{ borderBottom: '2px solid #f1f2f6', paddingBottom: '10px', marginTop: 0 }}>Logistics & Operations</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
            <div>
              <p style={{ color: '#7f8c8d', margin: '0 0 5px 0' }}>Hotel Name</p>
              <strong>{trip.hotelName || 'Not Assigned'}</strong>
            </div>
            <div>
              <p style={{ color: '#7f8c8d', margin: '0 0 5px 0' }}>Driver Name</p>
              <strong>{trip.driverName || 'Not Assigned'}</strong>
            </div>
            <div>
              <p style={{ color: '#7f8c8d', margin: '0 0 5px 0' }}>Vehicle Number</p>
              <strong>{trip.vehicleNumber || 'Not Assigned'}</strong>
            </div>
            <div>
              <p style={{ color: '#7f8c8d', margin: '0 0 5px 0' }}>Pickup Point</p>
              <strong>{trip.pickupLocation || 'Not Assigned'}</strong>
            </div>
            <div>
              <p style={{ color: '#7f8c8d', margin: '0 0 5px 0' }}>Pickup Time</p>
              <strong>{trip.pickupTime || 'Not Assigned'}</strong>
            </div>
            <div>
              <p style={{ color: '#7f8c8d', margin: '0 0 5px 0' }}>Guide ID</p>
              <strong>{trip.guideId}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripDetails;
