import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import Loader from '../components/Loader';

const TripSchedule = () => {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSchedule();
  }, []);

  const fetchSchedule = async () => {
    try {
      const res = await axiosInstance.get('/guide/trips');
      if (res.data.success) {
        // Collect itineraries from active trips
        const activeTrips = res.data.data.filter(t => t.bookingStatus === 'READY_FOR_TOUR' || t.bookingStatus === 'IN_PROGRESS' || t.bookingStatus === 'GUIDE_ASSIGNED');
        
        const allSchedule = [];
        activeTrips.forEach(trip => {
          if (trip.itinerary && Array.isArray(trip.itinerary)) {
            trip.itinerary.forEach(item => {
              allSchedule.push({
                ...item,
                bookingNumber: trip.bookingNumber || `#${trip.id}`,
                customerName: trip.customerName
              });
            });
          }
        });
        setSchedule(allSchedule);
      }
    } catch (err) {
      setError('Failed to load schedule.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Trip Schedule</h2>
        <p>Your upcoming itinerary timeline for assigned tours.</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div style={{ marginTop: '30px', background: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        {schedule.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#7f8c8d' }}>No schedule found for active trips.</div>
        ) : (
          <div style={{ borderLeft: '3px solid #3498db', paddingLeft: '20px', marginLeft: '10px' }}>
            {schedule.map((item, index) => (
              <div key={index} style={{ marginBottom: '25px', position: 'relative' }}>
                <div style={{ 
                  position: 'absolute', 
                  left: '-28px', 
                  top: '0', 
                  width: '12px', 
                  height: '12px', 
                  borderRadius: '50%', 
                  background: '#3498db',
                  border: '3px solid white'
                }}></div>
                <div style={{ fontSize: '0.9em', color: '#7f8c8d', fontWeight: 'bold' }}>{item.day || 'Day'} • {item.bookingNumber}</div>
                <h3 style={{ margin: '5px 0' }}>{item.place || item.activity || 'Activity'}</h3>
                {item.customerName && <div style={{ fontSize: '0.85em', color: '#95a5a6', marginBottom: '5px' }}>Guest: {item.customerName}</div>}
                <span style={{ 
                  display: 'inline-block',
                  padding: '2px 8px', 
                  borderRadius: '12px', 
                  fontSize: '0.8em',
                  background: '#f1f2f6',
                  color: '#2f3542'
                }}>
                  {item.time || item.remarks || 'Scheduled'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TripSchedule;
