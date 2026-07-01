import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import Loader from '../../components/Loader';

const Itinerary = () => {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('bookingId');
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(bookingId || '');
  const [itinerary, setItinerary] = useState([{ day: 1, title: '', description: '' }]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    if (selectedBooking) {
      const booking = bookings.find(b => b.id.toString() === selectedBooking);
      if (booking && booking.itinerary && booking.itinerary.length > 0) {
        setItinerary(booking.itinerary);
      } else {
        setItinerary([{ day: 1, title: '', description: '' }]);
      }
    }
  }, [selectedBooking, bookings]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/manager/bookings');
      if (res.data.success) {
        setBookings(res.data.data.filter(b => b.bookingStatus === 'CONFIRMED' || b.bookingStatus === 'GUIDE_ASSIGNED'));
      }
    } catch (err) {
      setError('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleAddDay = () => {
    setItinerary([...itinerary, { day: itinerary.length + 1, title: '', description: '' }]);
  };

  const handleChange = (index, field, value) => {
    const newItinerary = [...itinerary];
    newItinerary[index][field] = value;
    setItinerary(newItinerary);
  };

  const handleSave = async () => {
    if (!selectedBooking) return alert('Please select a booking first');
    try {
      setSaving(true);
      const res = await axiosInstance.patch(`/manager/bookings/${selectedBooking}/itinerary`, { itinerary });
      if (res.data.success) {
        alert('Itinerary saved successfully');
      }
    } catch (err) {
      alert('Failed to save itinerary');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="page-container">
      <div className="page-header" style={{ marginBottom: '30px' }}>
        <h2>Generate Itinerary</h2>
        <p>Create day-by-day itineraries for bookings</p>
      </div>

      <div style={{ background: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Select Booking:</label>
          <select 
            className="form-control" 
            value={selectedBooking} 
            onChange={(e) => setSelectedBooking(e.target.value)}
          >
            <option value="">-- Select a Booking --</option>
            {bookings.map(b => (
              <option key={b.id} value={b.id}>{b.bookingNumber || `#${b.id}`} - {b.customerName} ({b.packageName})</option>
            ))}
          </select>
        </div>

        {selectedBooking && (
          <div>
            <h3 style={{ marginBottom: '15px' }}>Itinerary Details</h3>
            {itinerary.map((day, index) => (
              <div key={index} style={{ marginBottom: '20px', padding: '15px', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                <h4 style={{ margin: '0 0 10px 0' }}>Day {day.day}</h4>
                <div style={{ marginBottom: '10px' }}>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Day Title (e.g., Arrival & Check-in)" 
                    value={day.title}
                    onChange={(e) => handleChange(index, 'title', e.target.value)}
                  />
                </div>
                <div>
                  <textarea 
                    className="form-control" 
                    rows="3" 
                    placeholder="Activities and description..." 
                    value={day.description}
                    onChange={(e) => handleChange(index, 'description', e.target.value)}
                  ></textarea>
                </div>
              </div>
            ))}
            
            <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
              <button className="btn-secondary" onClick={handleAddDay}>+ Add Day</button>
              <button className="btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : 'Save Itinerary'}
              </button>
              <button className="btn-secondary" onClick={() => window.print()}>Print PDF</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Itinerary;
