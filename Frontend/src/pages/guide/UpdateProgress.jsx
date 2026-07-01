import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import Loader from '../../components/Loader';
import TripTimeline from './TripTimeline';

const UpdateProgress = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialTripId = location.state?.tripId || '';

  const [activeTrips, setActiveTrips] = useState([]);
  const [selectedTripId, setSelectedTripId] = useState(initialTripId);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    day: '',
    place: '',
    arrivalTime: '',
    departureTime: '',
    remarks: ''
  });

  useEffect(() => {
    fetchActiveTrips();
  }, []);

  useEffect(() => {
    if (selectedTripId) {
      const trip = activeTrips.find(t => t.id.toString() === selectedTripId.toString());
      setSelectedTrip(trip || null);
    } else {
      setSelectedTrip(null);
    }
  }, [selectedTripId, activeTrips]);

  const fetchActiveTrips = async () => {
    try {
      const res = await axiosInstance.get('/guide/trips');
      if (res.data.success) {
        // Only show trips that are ready or in progress
        const active = res.data.data.filter(t => t.bookingStatus === 'READY_FOR_TOUR' || t.bookingStatus === 'IN_PROGRESS' || t.bookingStatus === 'GUIDE_ASSIGNED');
        setActiveTrips(active);
        if (initialTripId && !active.find(t => t.id.toString() === initialTripId.toString())) {
          setSelectedTripId('');
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTripId) return alert('Please select a trip first.');

    try {
      await axiosInstance.patch(`/guide/trips/${selectedTripId}/progress`, formData);
      alert('Progress saved successfully!');
      setFormData({ day: '', place: '', arrivalTime: '', departureTime: '', remarks: '' });
      fetchActiveTrips(); // Refresh timeline
    } catch (err) {
      alert('Failed to save progress.');
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="page-container" style={{ maxWidth: '1200px' }}>
      <div className="page-header">
        <h2>Log Trip Progress</h2>
        <p>Update the itinerary timeline for your active trips.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        
        {/* Form Section */}
        <div style={{ background: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
          <div className="form-group">
            <label>Select Active Trip *</label>
            <select 
              className="form-control" 
              value={selectedTripId} 
              onChange={(e) => setSelectedTripId(e.target.value)}
            >
              <option value="">-- Choose a Trip --</option>
              {activeTrips.map(t => (
                <option key={t.id} value={t.id}>{t.bookingNumber || `#${t.id}`} - {t.customerName}</option>
              ))}
            </select>
          </div>

          {selectedTrip && (
            <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div className="form-group">
                  <label>Day Number *</label>
                  <input type="number" name="day" className="form-control" value={formData.day} onChange={handleChange} required min="1" placeholder="e.g. 1" />
                </div>
                <div className="form-group">
                  <label>Visited Place *</label>
                  <input type="text" name="place" className="form-control" value={formData.place} onChange={handleChange} required placeholder="e.g. Botanical Garden" />
                </div>
                <div className="form-group">
                  <label>Arrival Time</label>
                  <input type="time" name="arrivalTime" className="form-control" value={formData.arrivalTime} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Departure Time</label>
                  <input type="time" name="departureTime" className="form-control" value={formData.departureTime} onChange={handleChange} />
                </div>
              </div>
              <div className="form-group" style={{ marginTop: '15px' }}>
                <label>Remarks / Notes *</label>
                <textarea name="remarks" className="form-control" rows="3" value={formData.remarks} onChange={handleChange} required placeholder="Customer feedback or specific events during the day..."></textarea>
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1, background: '#3498db', border: 'none' }}>Save Progress</button>
              </div>
            </form>
          )}

          {!selectedTrip && (
            <div style={{ padding: '20px', background: '#f8f9fa', borderRadius: '8px', textAlign: 'center', color: '#7f8c8d', marginTop: '20px' }}>
              Please select an active trip from the dropdown to log progress.
            </div>
          )}
        </div>

        {/* Timeline Section */}
        <div style={{ background: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
          {selectedTrip ? (
            <TripTimeline status={selectedTrip.bookingStatus} progressLogs={selectedTrip.tripProgress} />
          ) : (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: '#7f8c8d' }}>
              Timeline preview will appear here when a trip is selected.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default UpdateProgress;
