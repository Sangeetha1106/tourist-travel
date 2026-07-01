import { useState, useEffect } from 'react';
import { getProfile } from '../api/authApi';
import Loader from '../components/Loader';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile();
        if (res.success) {
          setProfile(res.data);
        }
      } catch (err) {
        setError('Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <Loader />;
  if (error) return <div className="error-message" style={{ margin: '40px auto', maxWidth: '600px' }}>{error}</div>;

  return (
    <div className="page-container">
      <div className="profile-container">
        <h2 style={{ textAlign: 'center', marginBottom: '30px', color: 'var(--text-dark)' }}>My Profile</h2>
        {profile && (
          <div className="profile-details">
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 'bold', margin: '0 auto' }}>
                {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
              </div>
            </div>
            <div className="meta-item">
              <span className="meta-label">First Name</span>
              <span className="meta-value">{profile.firstName}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Last Name</span>
              <span className="meta-value">{profile.lastName}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Email</span>
              <span className="meta-value">{profile.email}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Phone</span>
              <span className="meta-value">{profile.phone || 'N/A'}</span>
            </div>
            <div className="meta-item" style={{ borderBottom: 'none' }}>
              <span className="meta-label">Account Role</span>
              <span className="meta-value badge badge-completed">{profile.Role?.roleName}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
