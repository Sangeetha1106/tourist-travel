import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createDestination } from '../api/destinationApi';

const CreateDestination = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: ''
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('location', formData.location);
    if (image) {
      data.append('image', image);
    }

    try {
      const res = await createDestination(data);
      if (res.success) {
        navigate('/destinations');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create destination.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Add New Destination</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit} className="custom-form">
        <div className="form-group">
          <label>Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Location</label>
          <input type="text" name="location" value={formData.location} onChange={handleChange} required />
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
          {loading ? 'Creating...' : 'Create Destination'}
        </button>
      </form>
    </div>
  );
};

export default CreateDestination;
