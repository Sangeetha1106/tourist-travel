import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPackage } from '../api/packageApi';
import { getAllDestinations } from '../api/destinationApi';
import { getAllPlaces } from '../api/placeApi';

const CreatePackage = () => {
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState([]);
  const [places, setPlaces] = useState([]);
  const [selectedPlaces, setSelectedPlaces] = useState([]);
  const [formData, setFormData] = useState({
    destinationId: '',
    packageName: '',
    duration: '',
    price: '',
    description: ''
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const res = await getAllDestinations();
        if (res.success) setDestinations(res.data);
      } catch (err) {
        console.error('Failed to load destinations');
      }
    };
    fetchDestinations();
  }, []);

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Fetch places when destination changes
    if (name === 'destinationId') {
      try {
        const res = await getAllPlaces({ destinationId: value });
        if (res.success) setPlaces(res.data);
      } catch (err) {
        setPlaces([]);
      }
      setSelectedPlaces([]); // Reset selected places
    }
  };

  const handlePlaceToggle = (placeId) => {
    setSelectedPlaces(prev => 
      prev.includes(placeId) ? prev.filter(id => id !== placeId) : [...prev, placeId]
    );
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const data = new FormData();
    data.append('destinationId', formData.destinationId);
    data.append('packageName', formData.packageName);
    data.append('duration', formData.duration);
    data.append('price', formData.price);
    data.append('description', formData.description);
    if (selectedPlaces.length > 0) {
      data.append('placeIds', JSON.stringify(selectedPlaces));
    }
    if (image) {
      data.append('image', image);
    }

    try {
      const res = await createPackage(data);
      if (res.success) {
        navigate('/packages');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create package.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Add New Package</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit} className="custom-form">
        <div className="form-group">
          <label>Destination</label>
          <select name="destinationId" value={formData.destinationId} onChange={handleChange} required>
            <option value="">Select Destination</option>
            {destinations.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>
        
        {places.length > 0 && (
          <div className="form-group">
            <label>Included Places (Select multiple)</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px', background: '#f8f9fa', padding: '15px', borderRadius: '8px', border: '1px solid #d1d8e0' }}>
              {places.map(place => (
                <label key={place.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', margin: 0, fontWeight: 'normal' }}>
                  <input 
                    type="checkbox" 
                    checked={selectedPlaces.includes(place.id)}
                    onChange={() => handlePlaceToggle(place.id)}
                    style={{ width: 'auto', marginBottom: 0 }}
                  />
                  {place.name}
                </label>
              ))}
            </div>
          </div>
        )}

        <div className="form-group">
          <label>Package Name</label>
          <input type="text" name="packageName" value={formData.packageName} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Duration (e.g. 3 Days 2 Nights)</label>
          <input type="text" name="duration" value={formData.duration} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Price</label>
          <input type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea name="description" rows="4" value={formData.description} onChange={handleChange} required></textarea>
        </div>
        <div className="form-group">
          <label>Image</label>
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </div>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Creating...' : 'Create Package'}
        </button>
      </form>
    </div>
  );
};

export default CreatePackage;
