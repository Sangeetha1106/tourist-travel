import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const AuthLayout = () => {
  return (
    <div className="auth-layout">
      <Navbar />
      <main className="auth-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default AuthLayout;
