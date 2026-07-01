import { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import Loader from '../../components/Loader';

const ManagerProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axiosInstance.get('/auth/profile');
      if (res.data.success) {
        setProfile(res.data.data);
      }
    } catch (err) {
      setError('Failed to load profile details.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;
  if (error) return <div className="error-message">{error}</div>;
  if (!profile) return <div>Profile not found.</div>;

  return (
    <div className="page-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="page-header" style={{ marginBottom: '30px' }}>
        <h2>Manager Profile</h2>
        <p>Manage your account settings</p>
      </div>
      
      <div style={{ background: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', borderBottom: '1px solid #eee', paddingBottom: '20px', marginBottom: '20px' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#3498db', color: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '2rem', fontWeight: 'bold' }}>
            {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
          </div>
          <div>
            <h3 style={{ margin: '0 0 5px 0', fontSize: '1.5rem' }}>{profile.firstName} {profile.lastName}</h3>
            <p style={{ margin: 0, color: '#7f8c8d' }}>{profile.role ? profile.role.replace(/_/g, ' ') : 'TOUR MANAGER'}</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', color: '#7f8c8d', marginBottom: '5px' }}>Email Address</label>
            <div style={{ padding: '10px 15px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #eee' }}>{profile.email}</div>
          </div>
          <div>
            <label style={{ display: 'block', color: '#7f8c8d', marginBottom: '5px' }}>Phone Number</label>
            <div style={{ padding: '10px 15px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #eee' }}>{profile.phone || 'Not Provided'}</div>
          </div>
          <div>
            <label style={{ display: 'block', color: '#7f8c8d', marginBottom: '5px' }}>Department</label>
            <div style={{ padding: '10px 15px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #eee' }}>Tour Operations</div>
          </div>
        </div>

        <div style={{ marginTop: '30px', display: 'flex', gap: '15px' }}>
          <button className="btn-primary" onClick={() => alert('Edit profile functionality coming soon.')}>Edit Profile</button>
          <button className="btn-secondary" onClick={() => alert('Change password functionality coming soon.')}>Change Password</button>
        </div>
      </div>
    </div>
  );
};

export default ManagerProfile;
