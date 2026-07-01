import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getPlaceById } from '../api/placeApi';
import Loader from '../components/Loader';

const PlaceDetails = () => {
  const { placeId } = useParams();
  const navigate = useNavigate();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const res = await getPlaceById(placeId);
        if (res.success) {
          setPlace(res.data);
        }
      } catch (err) {
        setError('Failed to load place details.');
      } finally {
        setLoading(false);
      }
    };
    
    setLoading(true);
    fetchPlace();
  }, [placeId]);

  if (loading) return <Loader />;
  if (error || !place) return (
    <div className="page-container" style={{ textAlign: 'center', padding: '100px 20px' }}>
      <h2>{error || 'Place not found.'}</h2>
      <Link to="/destinations" className="btn-primary" style={{ marginTop: '20px', display: 'inline-block' }}>Go Back</Link>
    </div>
  );

  const defaultPackageId = place.Packages && place.Packages.length > 0 ? place.Packages[0].id : null;

  return (
    <div style={{ backgroundColor: '#fdfdfd', minHeight: '100vh', paddingBottom: '80px' }}>
      
      {/* Hero Banner */}
      <div style={{ 
        position: 'relative', 
        height: '60vh', 
        minHeight: '400px',
        backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7)), url(${place.image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'flex-end',
        padding: '60px 40px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', color: 'white' }}>
          <span style={{ background: 'var(--primary-color)', padding: '5px 15px', borderRadius: '20px', fontSize: '0.9rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '15px', display: 'inline-block' }}>
            {place.Destination?.name}
          </span>
          <h1 style={{ fontSize: '3.5rem', fontWeight: '900', marginBottom: '10px', textShadow: '0 4px 12px rgba(0,0,0,0.4)' }}>
            {place.name}
          </h1>
          <p style={{ fontSize: '1.2rem', opacity: 0.9, maxWidth: '600px' }}>
            {place.Destination?.location || place.Destination?.name}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', padding: '40px 20px', display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
        
        {/* Main Content (Left) */}
        <div style={{ flex: '1 1 700px' }}>
          
          {/* About Section */}
          <div style={{ background: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', marginBottom: '30px' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '20px', color: '#2d3436' }}>About {place.name}</h2>
            <p style={{ fontSize: '1.1rem', color: '#636e72', lineHeight: '1.8' }}>
              {place.description}
            </p>
          </div>

          {/* Highlights Section */}
          {place.highlights && place.highlights.length > 0 && (
            <div style={{ background: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', marginBottom: '30px' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '20px', color: '#2d3436' }}>Highlights</h3>
              <ul style={{ listStyleType: 'none', padding: 0 }}>
                {place.highlights.map((highlight, index) => (
                  <li key={index} style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '15px', fontSize: '1.05rem', color: '#2d3436' }}>
                    <span style={{ display: 'inline-block', width: '24px', height: '24px', background: '#ffeaa7', color: '#d35400', borderRadius: '50%', textAlign: 'center', lineHeight: '24px', fontWeight: 'bold' }}>✓</span>
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Gallery Section */}
          <div style={{ marginBottom: '40px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
              {(place.gallery && place.gallery.length > 0 ? place.gallery : [
                'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80'
              ]).map((img, index) => (
                <div key={index} style={{ height: '200px', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
                  <img src={img} alt={`${place.name} Gallery ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'} />
                </div>
              ))}
            </div>
          </div>
          
          {/* Map Location Section */}
          {place.mapLocation && (
            <div style={{ background: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', marginBottom: '30px' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '20px', color: '#2d3436' }}>Location</h3>
              <div style={{ width: '100%', height: '400px', borderRadius: '12px', overflow: 'hidden' }}>
                <iframe 
                  src={place.mapLocation} 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen="" 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`${place.name} Map`}
                ></iframe>
              </div>
            </div>
          )}

          {/* Travel Tips & Nearby Attractions */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
            {place.travelTips && place.travelTips.length > 0 && (
              <div style={{ background: '#f1f2f6', padding: '30px', borderRadius: '16px' }}>
                <h4 style={{ fontSize: '1.3rem', marginBottom: '15px', color: '#2d3436', display: 'flex', alignItems: 'center', gap: '10px' }}>💡 Travel Tips</h4>
                <ul style={{ paddingLeft: '20px', color: '#636e72', lineHeight: '1.6' }}>
                  {place.travelTips.map((tip, idx) => <li key={idx} style={{ marginBottom: '10px' }}>{tip}</li>)}
                </ul>
              </div>
            )}
            
            {place.nearbyAttractions && place.nearbyAttractions.length > 0 && (
              <div style={{ background: '#f1f2f6', padding: '30px', borderRadius: '16px' }}>
                <h4 style={{ fontSize: '1.3rem', marginBottom: '15px', color: '#2d3436', display: 'flex', alignItems: 'center', gap: '10px' }}>📍 Nearby Attractions</h4>
                <ul style={{ paddingLeft: '20px', color: '#636e72', lineHeight: '1.6' }}>
                  {place.nearbyAttractions.map((attr, idx) => <li key={idx} style={{ marginBottom: '10px' }}>{attr}</li>)}
                </ul>
              </div>
            )}
          </div>

        </div>

        {/* Sidebar Sticky Card (Right) */}
        <div style={{ flex: '1 1 350px', position: 'relative' }}>
          <div style={{ position: 'sticky', top: '100px', background: 'white', padding: '30px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontSize: '1.5rem', color: '#2d3436', borderBottom: '2px solid #f1f2f6', paddingBottom: '15px', marginBottom: '20px' }}>Plan Your Visit</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#636e72', fontWeight: '600' }}>Entry Fee</span>
                <span style={{ color: '#2d3436', fontWeight: 'bold', fontSize: '1.1rem' }}>{place.entryFee || 'N/A'}</span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#636e72', fontWeight: '600' }}>Opening Hours</span>
                <span style={{ color: '#2d3436', fontWeight: 'bold', fontSize: '0.95rem', textAlign: 'right', maxWidth: '150px' }}>{place.openingTime || 'N/A'}</span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#636e72', fontWeight: '600' }}>Best Time</span>
                <span style={{ color: '#2d3436', fontWeight: 'bold' }}>{place.bestTime || 'Anytime'}</span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#636e72', fontWeight: '600' }}>Budget</span>
                <span style={{ color: '#2d3436', fontWeight: 'bold' }}>{place.budget || 'Medium'}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff9e6', padding: '15px', borderRadius: '8px', borderLeft: '4px solid #f39c12' }}>
                <span style={{ color: '#d35400', fontWeight: '700' }}>User Rating</span>
                <span style={{ color: '#d35400', fontWeight: '800', fontSize: '1.2rem' }}>★ {place.rating || '4.5'}/5</span>
              </div>
            </div>

            <div style={{ marginTop: '30px' }}>
              <button 
                onClick={() => {
                  if (defaultPackageId) {
                    navigate(`/booking/${defaultPackageId}`);
                  } else {
                    navigate('/contact');
                  }
                }}
                className="btn-primary gt-red" 
                style={{ width: '100%', padding: '18px', fontSize: '1.2rem', borderRadius: '10px', boxShadow: '0 8px 20px rgba(255, 71, 87, 0.3)' }}
              >
                Book Now
              </button>
              <p style={{ textAlign: 'center', color: '#b2bec3', fontSize: '0.85rem', marginTop: '15px' }}>
                Secure your adventure with our curated tour packages.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PlaceDetails;
