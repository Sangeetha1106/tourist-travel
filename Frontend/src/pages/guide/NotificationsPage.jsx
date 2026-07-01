import { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import Loader from '../../components/Loader';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await axiosInstance.get('/guide/notifications');
      if (res.data.success) {
        setNotifications(res.data.data);
      }
    } catch (err) {
      setError('Failed to load notifications.');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axiosInstance.patch(`/guide/notifications/${id}/read`);
      setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      alert('Failed to update status.');
    }
  };

  const markAllAsRead = async () => {
    try {
      await axiosInstance.put('/guide/notifications/read-all');
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      alert('Failed to mark all as read.');
    }
  };

  const deleteNotification = async (id) => {
    if (!window.confirm('Delete this notification?')) return;
    try {
      await axiosInstance.delete(`/guide/notifications/${id}`);
      setNotifications(notifications.filter(n => n.id !== id));
    } catch (err) {
      alert('Failed to delete notification.');
    }
  };

  const getIcon = (type) => {
    if (type === 'SUCCESS') return '✅';
    if (type === 'WARNING') return '⚠️';
    if (type === 'DANGER') return '❌';
    return 'ℹ️';
  };

  if (loading) return <Loader />;

  return (
    <div className="page-container" style={{ maxWidth: '900px' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>Notifications Center</h2>
          <p>Stay updated with your latest assignments and alerts.</p>
        </div>
        {notifications.some(n => !n.isRead) && (
          <button onClick={markAllAsRead} className="btn-secondary" style={{ padding: '8px 16px', background: '#ecf0f1', color: '#2c3e50', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
            Mark All as Read
          </button>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
        {notifications.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#7f8c8d', padding: '40px 0' }}>No notifications found.</div>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {notifications.map(n => (
              <li 
                key={n.id} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  padding: '20px', 
                  borderBottom: '1px solid #ecf0f1',
                  background: n.isRead ? '#fff' : '#f8f9fa'
                }}
              >
                <div style={{ fontSize: '1.5rem', marginRight: '20px' }}>{getIcon(n.type)}</div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 5px 0', color: n.isRead ? '#7f8c8d' : '#2c3e50', display: 'flex', justifyContent: 'space-between', fontWeight: n.isRead ? 'normal' : 'bold' }}>
                    {n.title}
                    <span style={{ fontSize: '0.8rem', color: '#95a5a6', fontWeight: 'normal' }}>
                      {new Date(n.createdAt).toLocaleString()}
                    </span>
                  </h4>
                  <p style={{ margin: '0 0 10px 0', color: '#7f8c8d', fontSize: '0.95rem' }}>{n.message}</p>
                  
                  {n.bookingId && (
                    <div style={{ marginBottom: '15px', fontSize: '0.9rem', color: '#34495e' }}>
                      <strong>Booking: </strong> {n.bookingId}
                    </div>
                  )}
                  
                  <div style={{ display: 'flex', gap: '10px' }}>
                    {!n.isRead && (
                      <button 
                        onClick={() => markAsRead(n.id)} 
                        style={{ background: 'transparent', border: '1px solid #3498db', color: '#3498db', padding: '4px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
                      >
                        Mark as Read
                      </button>
                    )}
                    {n.bookingId && (
                      <button 
                        onClick={() => window.location.href = '/guide/trips'}
                        style={{ background: '#3498db', border: '1px solid #3498db', color: '#fff', padding: '4px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
                      >
                        View Booking
                      </button>
                    )}
                    <button 
                      onClick={() => deleteNotification(n.id)} 
                      style={{ background: 'transparent', border: 'none', color: '#e74c3c', padding: '4px 8px', cursor: 'pointer', fontSize: '0.9rem', textDecoration: 'underline' }}
                      title="Delete Notification"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
