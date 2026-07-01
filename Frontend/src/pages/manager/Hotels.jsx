import { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import Loader from '../../components/Loader';

const Hotels = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/hotels');
      if (res.data.success) {
        setHotels(res.data.data);
      }
    } catch (err) {
      setError('Failed to fetch hotels');
    } finally {
      setLoading(false);
    }
  };

  const filteredHotels = hotels.filter(h => 
    h.hotelName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    h.destination?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Loader />;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="page-container">
      <div className="page-header" style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>Hotels</h2>
          <p>Manage all hotels</p>
        </div>
        <input 
          type="text" 
          placeholder="Search by name or destination..." 
          className="form-control" 
          style={{ width: '300px' }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div style={{ background: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
        <div className="table-responsive">
          <table className="custom-table" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th>Hotel Name</th>
                <th>Destination</th>
                <th>Stars</th>
                <th>Rooms</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredHotels.length > 0 ? filteredHotels.map(h => (
                <tr key={h.hotelId}>
                  <td><strong>{h.hotelName}</strong></td>
                  <td>{h.destination} ({h.city})</td>
                  <td>{h.starRating} ⭐</td>
                  <td>{h.availableRooms}</td>
                  <td>{h.phone}</td>
                  <td>
                    <span className={`badge ${h.status === 'AVAILABLE' ? 'badge-success' : 'badge-warning'}`}>
                      {h.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <button className="btn-secondary" style={{ padding: '4px 8px', fontSize: '0.8rem' }} onClick={() => alert('View Hotel: ' + h.hotelId)}>View</button>
                      <button className="btn-primary" style={{ padding: '4px 8px', fontSize: '0.8rem' }} onClick={() => alert('Edit Hotel: ' + h.hotelId)}>Edit</button>
                      <button className="btn-danger" style={{ padding: '4px 8px', fontSize: '0.8rem' }} onClick={() => alert('Delete Hotel: ' + h.hotelId)}>Delete</button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>No hotels available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Hotels;
