import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getDestinationById } from '../api/destinationApi';
import { getAllPlaces } from '../api/placeApi';
import { getAllPackages } from '../api/packageApi';
import { getImageUrl } from '../utils/imageHelper';
import Loader from '../components/Loader';

const DestinationDetails = () => {
  const { id } = useParams();
  const [destination, setDestination] = useState(null);
  const [places, setPlaces] = useState([]);
  const [defaultPackageId, setDefaultPackageId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        let destData = null;
        
        if (id) {
          const destRes = await getDestinationById(id);
          if (destRes.success) destData = destRes.data;
        }

        if (destData) {
          setDestination(destData);
          
          // Fetch tourist places for this destination from API
          const placesRes = await getAllPlaces({ destinationId: destData.id });
          if (placesRes.success) {
            setPlaces(placesRes.data);
          }

          // Fetch packages for this destination to enable direct booking
          const packagesRes = await getAllPackages({ destinationId: destData.id });
          if (packagesRes.success && packagesRes.data.length > 0) {
            setDefaultPackageId(packagesRes.data[0].id);
          }
        } else {
          setError('Destination not found.');
        }
      } catch (err) {
        setError('Failed to load destination details.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <Loader />;
  if (error) return <div className="error-message" style={{ margin: '40px auto', maxWidth: '800px', padding: '20px', background: '#fab1a0', color: '#d63031', borderRadius: '8px', textAlign: 'center' }}>{error}</div>;
  if (!destination) return <div style={{ textAlign: 'center', padding: '50px' }}>Destination not found</div>;

  const destImage = destination.image && destination.image.startsWith('http') ? destination.image : getImageUrl(destination.image, 'destination');

  const fallbackPlaces = [
    { id: 'f1', name: `Iconic Landmark of ${destination.name}`, description: `Discover the most famous landmark in ${destination.name}. Known for its stunning architecture and historical significance, it's a must-visit for every traveler.`, image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80', entryFee: '₹500', openingTime: '09:00 AM - 05:00 PM', budget: 'Medium', rating: '4.8/5' },
    { id: 'f2', name: `Cultural Heritage Center`, description: `Immerse yourself in the rich culture and traditions of ${destination.name}. Explore fascinating exhibits and experience the local way of life.`, image: 'https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&w=800&q=80', entryFee: '₹200', openingTime: '10:00 AM - 06:00 PM', budget: 'Low', rating: '4.6/5' },
    { id: 'f3', name: `Scenic Nature Reserve`, description: `Escape the city bustle and explore the breathtaking natural beauty of ${destination.name}. Perfect for photography and peaceful walks.`, image: 'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=800&q=80', entryFee: 'Free', openingTime: '06:00 AM - 06:00 PM', budget: 'Low', rating: '4.9/5' },
    { id: 'f4', name: `Historic Old Town`, description: `Wander through the charming cobblestone streets of the old town in ${destination.name}. Admire the vintage architecture and cozy cafes.`, image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80', entryFee: 'Free', openingTime: '24 Hours', budget: 'Medium', rating: '4.7/5' },
    { id: 'f5', name: `Popular Shopping District`, description: `Experience the vibrant shopping scene of ${destination.name}. From luxury boutiques to local street markets, find everything you need.`, image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=800&q=80', entryFee: 'Free', openingTime: '10:00 AM - 10:00 PM', budget: 'High', rating: '4.5/5' },
    { id: 'f6', name: `Famous Local Beach/Lake`, description: `Relax by the serene waters of ${destination.name}. Enjoy water sports, sunbathing, or a peaceful evening stroll by the shore.`, image: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&fit=crop&w=800&q=80', entryFee: 'Free', openingTime: 'Anytime', budget: 'Low', rating: '4.8/5' },
    { id: 'f7', name: `Royal Palace / Castle`, description: `Step back in time and marvel at the grandeur of the ancient royalty in ${destination.name}. A masterpiece of historical design.`, image: 'https://images.unsplash.com/photo-1500835556837-99ac94a94552?auto=format&fit=crop&w=800&q=80', entryFee: '₹1000', openingTime: '09:00 AM - 04:00 PM', budget: 'High', rating: '4.9/5' },
    { id: 'f8', name: `Adventure Theme Park`, description: `Get your adrenaline pumping with thrilling rides and entertaining shows. A perfect day out for families visiting ${destination.name}.`, image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80', entryFee: '₹1500', openingTime: '11:00 AM - 08:00 PM', budget: 'High', rating: '4.7/5' },
    { id: 'f9', name: `Mountain Viewpoint`, description: `Hike up to the highest point in ${destination.name} for a spectacular panoramic view of the entire landscape. Best visited during sunset.`, image: 'https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?auto=format&fit=crop&w=800&q=80', entryFee: 'Free', openingTime: '05:00 AM - 07:00 PM', budget: 'Low', rating: '4.9/5' },
    { id: 'f10', name: `Traditional Food Market`, description: `Taste the authentic flavors of ${destination.name} at this bustling food market. A paradise for food lovers and culinary explorers.`, image: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=800&q=80', entryFee: 'Free', openingTime: '06:00 PM - 12:00 AM', budget: 'Medium', rating: '4.8/5' }
  ];

  const displayPlaces = places.length > 0 ? places : fallbackPlaces;

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', paddingBottom: '60px' }}>
      
      {/* Hero Banner */}
      <div className="category-hero" style={{ backgroundImage: `url(${destImage})`, height: '450px', marginBottom: '0' }}>
        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
          <h1 style={{ fontSize: '4.5rem', margin: '0 0 10px 0', textShadow: '0 4px 15px rgba(0,0,0,0.5)' }}>{destination.name}</h1>
          <p style={{ color: '#fff', fontSize: '1.2rem', fontWeight: '500', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
            📍 {destination.location}
          </p>
        </div>
      </div>

      <div className="page-container" style={{ maxWidth: '1200px', margin: '-50px auto 0', position: 'relative', zIndex: 10, padding: '0 20px' }}>
        
        <div style={{ background: '#fff', borderRadius: '16px', padding: '40px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#2d3436', marginBottom: '20px' }}>About {destination.name}</h2>
          <p style={{ fontSize: '1.05rem', color: '#636e72', lineHeight: '1.8', marginBottom: '30px' }}>
            {destination.description}
          </p>

          <div className="info-cards-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            <div className="info-card">
              <div className="info-card-icon">☀️</div>
              <div className="info-card-title">Best Time to Visit</div>
              <div className="info-card-value">Sep - March</div>
            </div>
            <div className="info-card">
              <div className="info-card-icon">🌡️</div>
              <div className="info-card-title">Average Weather</div>
              <div className="info-card-value">15°C - 25°C</div>
            </div>
            <div className="info-card">
              <div className="info-card-icon">⭐</div>
              <div className="info-card-title">Tourist Rating</div>
              <div className="info-card-value">4.8 / 5.0</div>
            </div>
            <div className="info-card">
              <div className="info-card-icon">💰</div>
              <div className="info-card-title">Est. Budget</div>
              <div className="info-card-value">₹12,000 / Person</div>
            </div>
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#2d3436' }}>Top Tourist Places in {destination.name}</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '30px' }}>
            {displayPlaces.map(place => (
              <div key={place.id} style={{ background: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', transition: 'transform 0.3s', border: '1px solid rgba(0,0,0,0.03)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-10px)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <div style={{ height: '220px', position: 'relative' }}>
                  <img src={place.image && place.image.startsWith('http') ? place.image : getImageUrl(place.image, 'place')} alt={place.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                
                <div style={{ padding: '25px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#2d3436', marginBottom: '8px' }}>{place.name}</h3>
                  <p style={{ color: '#636e72', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '15px', flex: 1 }}>
                    {place.description}
                  </p>
                  
                  <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                      <span style={{ color: '#b2bec3', fontWeight: '600' }}>Entry Fee:</span>
                      <span style={{ color: '#2d3436', fontWeight: '700' }}>{place.entryFee}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                      <span style={{ color: '#b2bec3', fontWeight: '600' }}>Timing:</span>
                      <span style={{ color: '#2d3436', fontWeight: '700' }}>{place.openingTime}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                      <span style={{ color: '#b2bec3', fontWeight: '600' }}>Budget:</span>
                      <span style={{ color: '#f39c12', fontWeight: '700' }}>{place.budget}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                      <span style={{ color: '#b2bec3', fontWeight: '600' }}>Rating:</span>
                      <span style={{ color: '#00b894', fontWeight: '700' }}>⭐ {place.rating || '4.8/5'}</span>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                    <Link to={`/places/${place.slug || place.id}`} style={{ flex: 1, padding: '12px 0', textAlign: 'center', borderRadius: '8px', fontSize: '0.95rem', background: '#f1f2f6', color: '#2f3542', textDecoration: 'none', fontWeight: '600', transition: 'background 0.3s' }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = '#eccc68'; e.currentTarget.style.color = '#fff'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = '#f1f2f6'; e.currentTarget.style.color = '#2f3542'; }}
                    >
                      View Details
                    </Link>
                    <Link to={place.Packages && place.Packages.length > 0 ? `/booking/${place.Packages[0].id}` : (defaultPackageId ? `/booking/${defaultPackageId}` : '/contact-us')} className="btn-primary gt-red" style={{ flex: 1, padding: '12px 0', textAlign: 'center', borderRadius: '8px', fontSize: '0.95rem', textDecoration: 'none' }}>
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationDetails;
