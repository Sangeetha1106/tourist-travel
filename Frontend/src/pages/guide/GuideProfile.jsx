import { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import Loader from '../../components/Loader';

const GuideProfile = () => {
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    address: ''
  });
  const [passwords, setPasswords] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      // Reusing the general auth profile endpoint which gives user data
      const res = await axiosInstance.get('/auth/profile');
      if (res.data.success) {
        setProfile({
          firstName: res.data.data.firstName || '',
          lastName: res.data.data.lastName || '',
          phone: res.data.data.phone || '',
          email: res.data.data.email || '',
          address: res.data.data.address || ''
        });
      }
    } catch (err) {
      alert('Failed to load profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axiosInstance.put('/guide/profile', profile);
      alert('Profile updated successfully!');
      
      // Update local storage name
      const user = JSON.parse(localStorage.getItem('user'));
      user.firstName = profile.firstName;
      user.lastName = profile.lastName;
      localStorage.setItem('user', JSON.stringify(user));
    } catch (err) {
      alert('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      return alert('Passwords do not match!');
    }
    setSaving(true);
    try {
      await axiosInstance.put('/guide/change-password', { newPassword: passwords.newPassword });
      alert('Password changed successfully!');
      setPasswords({ newPassword: '', confirmPassword: '' });
    } catch (err) {
      alert('Failed to change password.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="page-container" style={{ maxWidth: '1000px' }}>
      <div className="page-header">
        <h2>My Profile</h2>
        <p>Manage your personal information and security settings.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        
        {/* Profile Info */}
        <div style={{ background: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
          <h3 style={{ borderBottom: '2px solid #f1f2f6', paddingBottom: '10px', marginTop: 0 }}>Personal Information</h3>
          
          <form onSubmit={handleProfileSubmit} style={{ marginTop: '20px' }}>
            <div className="form-group">
              <label>First Name</label>
              <input type="text" name="firstName" className="form-control" value={profile.firstName} onChange={handleProfileChange} required />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input type="text" name="lastName" className="form-control" value={profile.lastName} onChange={handleProfileChange} required />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" className="form-control" value={profile.email} disabled style={{ background: '#f8f9fa' }} />
              <small style={{ color: '#95a5a6' }}>Email cannot be changed.</small>
            </div>
            <div className="form-group">
              <label>Mobile Number</label>
              <input type="text" name="phone" className="form-control" value={profile.phone} onChange={handleProfileChange} />
            </div>
            <div className="form-group">
              <label>Home Address</label>
              <textarea name="address" className="form-control" rows="3" value={profile.address} onChange={handleProfileChange}></textarea>
            </div>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Security Settings */}
        <div style={{ background: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', alignSelf: 'start' }}>
          <h3 style={{ borderBottom: '2px solid #f1f2f6', paddingBottom: '10px', marginTop: 0 }}>Change Password</h3>
          
          <form onSubmit={handlePasswordSubmit} style={{ marginTop: '20px' }}>
            <div className="form-group">
              <label>New Password</label>
              <input 
                type="password" 
                name="newPassword" 
                className="form-control" 
                value={passwords.newPassword} 
                onChange={handlePasswordChange} 
                required 
                minLength="6"
              />
            </div>
            <div className="form-group">
              <label>Confirm New Password</label>
              <input 
                type="password" 
                name="confirmPassword" 
                className="form-control" 
                value={passwords.confirmPassword} 
                onChange={handlePasswordChange} 
                required 
                minLength="6"
              />
            </div>
            <button type="submit" className="btn-primary" style={{ background: '#e74c3c', border: 'none' }} disabled={saving}>
              {saving ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default GuideProfile;
