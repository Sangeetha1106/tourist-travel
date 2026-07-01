import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import Loader from '../../components/Loader';

const AdminEditBooking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    travelDate: '',
    totalPersons: '',
    specialRequests: '',
    hotelName: '',
    pickupTime: ''
  });

  useEffect(() => {
    fetchBooking();
  }, [id]);

  const fetchBooking = async () => {
    try {
      const res = await axiosInstance.get(`/admin/bookings/${id}`);
      if (res.data.success) {
        const b = res.data.data;
        // format date for input field yyyy-mm-dd
        const formattedDate = b.travelDate ? new Date(b.travelDate).toISOString().split('T')[0] : '';
        setFormData({
          travelDate: formattedDate,
          totalPersons: b.totalPersons || '',
          specialRequests: b.specialRequests || '',
          hotelName: b.hotelName || '',
          pickupTime: b.pickupTime || ''
        });
      }
    } catch (err) {
      alert('Failed to load booking details.');
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axiosInstance.put(`/admin/bookings/${id}`, formData);
      alert('Booking updated successfully!');
      navigate(-1);
    } catch (err) {
      alert('Failed to update booking.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="page-container" style={{ maxWidth: '800px' }}>
      <div className="page-header">
        <h2>Edit Booking #{id}</h2>
        <p>Modify specific booking attributes.</p>
      </div>

      <div style={{ background: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
        <form onSubmit={handleSubmit}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group">
              <label>Travel Date</label>
              <input type="date" name="travelDate" className="form-control" value={formData.travelDate} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Total Persons</label>
              <input type="number" name="totalPersons" className="form-control" value={formData.totalPersons} onChange={handleChange} required min="1" />
            </div>
            <div className="form-group">
              <label>Hotel Name</label>
              <input type="text" name="hotelName" className="form-control" value={formData.hotelName} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Pickup Time</label>
              <input type="time" name="pickupTime" className="form-control" value={formData.pickupTime} onChange={handleChange} />
            </div>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label>Special Requests</label>
              <textarea name="specialRequests" className="form-control" rows="3" value={formData.specialRequests} onChange={handleChange}></textarea>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
            <button type="button" className="btn-secondary" onClick={() => navigate(-1)} style={{ flex: 1 }}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={saving} style={{ flex: 2, background: '#2ecc71', border: 'none' }}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminEditBooking;
