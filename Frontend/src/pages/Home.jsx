import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllDestinations } from '../api/destinationApi';

import { getImageUrl } from '../utils/imageHelper';
import Loader from '../components/Loader';

const Home = () => {
  const [destinations, setDestinations] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const destRes = await getAllDestinations();
        if (destRes.success) setDestinations(destRes.data.slice(0, 12));
      } catch (err) {
        setError('Failed to load data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="customer-home">
      {/* Hero Banner */}
      <section className="hero-banner">
        <div className="hero-content">
          <h1>Discover Your Next Adventure</h1>
          <p>Explore the world's most breathtaking destinations and exclusive tour packages curated just for you.</p>
          <button onClick={() => navigate('/packages')} className="btn-primary" style={{ padding: '15px 30px', fontSize: '1.2rem' }}>
            Explore Packages
          </button>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="home-section">
        <h2 className="section-title">Popular Destinations</h2>
        {destinations.length === 0 && !error && <p className="text-center">No destinations found.</p>}
        <div className="grid-container">
          {destinations.map(dest => (
            <div key={dest.id} className="card">
              <div className="card-image-wrapper">
                <img 
                  src={getImageUrl(dest.image, 'destination')} 
                  alt={dest.name} 
                  className="card-image"
                />
              </div>
              <div className="card-body">
                <h3 className="card-title">{dest.name}</h3>
                <p className="card-location">📍 {dest.location}</p>
                <Link to={`/destinations/${dest.id}`} className="btn-secondary" style={{ marginTop: 'auto', display: 'block' }}>View Details</Link>
              </div>
            </div>
          ))}
        </div>
        {destinations.length >= 12 && (
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Link to="/destinations" className="btn-primary" style={{ padding: '12px 30px' }}>View All Destinations</Link>
          </div>
        )}
      </section>



      {/* Why Choose Us */}
      <section className="home-section">
        <h2 className="section-title">Why Travel With Us?</h2>
        <div className="features-grid">
          <div className="feature-box">
            <div className="feature-icon">✈️</div>
            <h3>World Class Service</h3>
            <p>We provide top-notch service and premium experiences tailored to your needs.</p>
          </div>
          <div className="feature-box">
            <div className="feature-icon">🛡️</div>
            <h3>Best Price Guarantee</h3>
            <p>Found a cheaper equivalent? We'll match it. No hidden fees ever.</p>
          </div>
          <div className="feature-box">
            <div className="feature-icon">⭐</div>
            <h3>Expert Guides</h3>
            <p>Our tour managers and local guides ensure your trip is perfectly seamless.</p>
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="home-section" style={{ backgroundColor: '#fdfdfd', maxWidth: '100%' }}>
        <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '0 40px' }}>
          <h2 className="section-title">What Our Travelers Say</h2>
          <div className="grid-container">
            <div className="feature-box" style={{ textAlign: 'left' }}>
              <p style={{ fontStyle: 'italic', marginBottom: '15px' }}>"An absolute dream! The Paris tour was perfectly organized. I didn't have to worry about a single detail."</p>
              <h4 style={{ color: 'var(--primary-color)' }}>- Sarah Jenkins</h4>
            </div>
            <div className="feature-box" style={{ textAlign: 'left' }}>
              <p style={{ fontStyle: 'italic', marginBottom: '15px' }}>"The Bali retreat was everything I hoped for. The overwater bungalow was breathtaking and the service was exceptional."</p>
              <h4 style={{ color: 'var(--primary-color)' }}>- Michael Chen</h4>
            </div>
            <div className="feature-box" style={{ textAlign: 'left' }}>
              <p style={{ fontStyle: 'italic', marginBottom: '15px' }}>"I've traveled with many agencies, but GT Holidays offers the best balance of luxury and affordability."</p>
              <h4 style={{ color: 'var(--primary-color)' }}>- Elena Rodriguez</h4>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
