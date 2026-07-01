import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { getProfile } from './api/authApi';
import './styles/App.css';
import './styles/gt-theme.css';

function App() {
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Calling getProfile to verify token. 
      // If expired, axiosInstance will catch the 401 and log the user out.
      getProfile().catch(() => {});
    }
  }, []);

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
