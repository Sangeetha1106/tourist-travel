import { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import Loader from '../../components/Loader';

const TripPhotos = () => {
  const [activeTrips, setActiveTrips] = useState([]);
  const [selectedTripId, setSelectedTripId] = useState('');
  const [loading, setLoading] = useState(true);
  
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchActiveTrips();
  }, []);

  const fetchActiveTrips = async () => {
    try {
      const res = await axiosInstance.get('/guide/trips');
      if (res.data.success) {
        setActiveTrips(res.data.data.filter(t => t.bookingStatus === 'TRIP_STARTED' || t.bookingStatus === 'TRIP_IN_PROGRESS' || t.bookingStatus === 'COMPLETED'));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    
    // Validate Max 10MB and type
    const validFiles = files.filter(f => {
      if (f.size > 10 * 1024 * 1024) {
        alert(`${f.name} exceeds the 10MB limit.`);
        return false;
      }
      if (!f.type.startsWith('image/')) {
        alert(`${f.name} is not a valid image format.`);
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      setSelectedFiles(prev => [...prev, ...validFiles]);
      const urls = validFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => [...prev, ...urls]);
    }
  };

  const removePhoto = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (!selectedTripId) return alert('Please select a trip first.');
    if (selectedFiles.length === 0) return alert('Please select photos to upload.');

    const formData = new FormData();
    formData.append('tripId', selectedTripId);
    selectedFiles.forEach(file => {
      formData.append('photos', file);
    });

    setUploading(true);
    try {
      await axiosInstance.post('/guide/photos', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Photos uploaded successfully!');
      setSelectedFiles([]);
      setPreviewUrls([]);
    } catch (err) {
      alert('Failed to upload photos.');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="page-container" style={{ maxWidth: '1000px' }}>
      <div className="page-header">
        <h2>Trip Photos</h2>
        <p>Upload sightseeing and customer group photos for your trips.</p>
      </div>

      <div style={{ background: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
        
        <div className="form-group" style={{ marginBottom: '30px' }}>
          <label style={{ fontWeight: 'bold' }}>Select Trip for Upload *</label>
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

        {selectedTripId && (
          <div>
            <div style={{ border: '2px dashed #bdc3c7', padding: '40px', textAlign: 'center', borderRadius: '8px', cursor: 'pointer', background: '#f8f9fa' }} onClick={() => document.getElementById('photo-upload').click()}>
              <h3 style={{ margin: '0 0 10px 0', color: '#7f8c8d' }}>Click to Browse or Drag & Drop</h3>
              <p style={{ margin: 0, color: '#95a5a6' }}>Supports JPEG, JPG, PNG (Max 10 MB per file)</p>
              <input 
                type="file" 
                id="photo-upload" 
                multiple 
                accept="image/jpeg, image/png, image/jpg" 
                style={{ display: 'none' }} 
                onChange={handleFileSelect} 
              />
            </div>

            {previewUrls.length > 0 && (
              <div style={{ marginTop: '30px' }}>
                <h4 style={{ borderBottom: '1px solid #ecf0f1', paddingBottom: '10px' }}>Selected Photos ({previewUrls.length})</h4>
                <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginTop: '15px' }}>
                  {previewUrls.map((url, idx) => (
                    <div key={idx} style={{ position: 'relative', width: '150px', height: '150px', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                      <img src={url} alt={`Preview ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button 
                        onClick={() => removePhoto(idx)}
                        style={{ position: 'absolute', top: '5px', right: '5px', background: 'rgba(231, 76, 60, 0.9)', color: '#fff', border: 'none', borderRadius: '50%', width: '25px', height: '25px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                
                <div style={{ marginTop: '30px', textAlign: 'right' }}>
                  <button 
                    className="btn-primary" 
                    onClick={handleUpload} 
                    disabled={uploading}
                    style={{ background: '#2ecc71', border: 'none', padding: '10px 30px', fontSize: '1rem' }}
                  >
                    {uploading ? 'Uploading...' : 'Upload Photos'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default TripPhotos;
