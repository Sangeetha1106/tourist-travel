import React, { useRef, useState } from 'react';
import { uploadIdProof } from '../api/uploadApi';

const FileUpload = ({ label, onUploadSuccess, fileData, onRemove }) => {
  const fileInputRef = useRef(null);
  const [error, setError] = useState('');

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setError('');
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      setError('Only JPG, PNG, and PDF files are allowed.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File size exceeds 5MB limit.');
      return;
    }

    // Set local preview
    const previewUrl = URL.createObjectURL(file);
    
    // Start upload process
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Simulate status updating via callback (or manage it internally)
      onUploadSuccess({ status: 'uploading', preview: previewUrl, file });
      const res = await uploadIdProof(formData);
      if (res.success) {
        onUploadSuccess({ status: 'success', uploadedPath: res.data.filePath, preview: previewUrl, file });
      }
    } catch (err) {
      setError(err.message || 'Upload failed.');
      onUploadSuccess({ status: 'error', preview: null, file: null });
    }
  };

  return (
    <div className="file-upload-container" style={{ border: '2px dashed #dcdde1', borderRadius: '12px', padding: '20px', textAlign: 'center', backgroundColor: '#f8f9fa', position: 'relative' }}>
      <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '10px', color: '#2d3436' }}>{label}</label>
      
      {fileData.status === 'success' ? (
        <div className="upload-success">
          <div style={{ color: '#00b894', fontWeight: 'bold', marginBottom: '10px' }}>✓ Uploaded Successfully</div>
          {fileData.file && fileData.file.type.startsWith('image/') ? (
            <img src={fileData.preview} alt="preview" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #dfe6e9' }} />
          ) : (
            <div style={{ padding: '10px', background: '#e17055', color: '#fff', borderRadius: '8px', display: 'inline-block' }}>PDF Document</div>
          )}
          <div style={{ marginTop: '10px' }}>
            <button type="button" onClick={onRemove} className="btn-danger" style={{ padding: '5px 15px', fontSize: '0.8rem', borderRadius: '20px' }}>Remove & Re-upload</button>
          </div>
        </div>
      ) : (
        <div className="upload-idle">
          <div style={{ fontSize: '2rem', color: '#74b9ff', marginBottom: '10px' }}>📁</div>
          <p style={{ color: '#636e72', fontSize: '0.9rem', marginBottom: '10px' }}>Drag & Drop or Click to Browse</p>
          <p style={{ color: '#b2bec3', fontSize: '0.75rem', marginBottom: '15px' }}>JPG, PNG, PDF (Max 5MB)</p>
          <button type="button" onClick={() => fileInputRef.current.click()} className="btn-secondary" style={{ padding: '8px 20px', fontSize: '0.9rem' }} disabled={fileData.status === 'uploading'}>
            {fileData.status === 'uploading' ? 'Uploading...' : 'Select File'}
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            style={{ display: 'none' }} 
            accept=".jpg,.jpeg,.png,.pdf" 
          />
        </div>
      )}
      {error && <div style={{ color: '#d63031', fontSize: '0.85rem', marginTop: '10px' }}>{error}</div>}
    </div>
  );
};

export default FileUpload;
