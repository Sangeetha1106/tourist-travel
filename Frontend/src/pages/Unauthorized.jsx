import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem('role');

  const handleGoBack = () => {
    switch (role) {
      case 'SUPER_ADMIN': return navigate('/super-admin/dashboard', { replace: true });
      case 'ADMIN': return navigate('/admin/dashboard', { replace: true });
      case 'TOUR_MANAGER': return navigate('/manager/dashboard', { replace: true });
      case 'TOUR_GUIDE': return navigate('/guide/dashboard', { replace: true });
      case 'CUSTOMER': 
      default: return navigate('/', { replace: true });
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '60vh',
      textAlign: 'center',
      padding: '20px'
    }}>
      <h1 style={{ fontSize: '4rem', color: '#ff4757', marginBottom: '10px' }}>403</h1>
      <h2 style={{ fontSize: '2rem', marginBottom: '20px' }}>Access Denied</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '30px' }}>
        You do not have permission to access this page.
      </p>
      <button className="btn-primary" onClick={handleGoBack} style={{ padding: '10px 25px' }}>
        Return to Dashboard
      </button>
    </div>
  );
};

export default Unauthorized;
