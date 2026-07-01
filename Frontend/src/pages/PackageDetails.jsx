import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getPackageById } from '../api/packageApi';
import { getImageUrl } from '../utils/imageHelper';
import Loader from '../components/Loader';

const PackageDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('places');
  const [bookingConfig, setBookingConfig] = useState({
    travelDate: '',
    totalPersons: 1,
    hasBreakfast: false,
    hasLunch: false,
    hasDinner: false
  });

  const handleConfigChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBookingConfig({
      ...bookingConfig,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const calculateTotal = () => {
    if (!pkg) return 0;
    let addOns = 0;
    if (bookingConfig.hasBreakfast) addOns += 1000;
    if (bookingConfig.hasLunch) addOns += 1500;
    if (bookingConfig.hasDinner) addOns += 2000;
    return (parseFloat(pkg.price) + addOns) * (parseInt(bookingConfig.totalPersons) || 1);
  };

  const handleBookNow = () => {
    const query = new URLSearchParams(bookingConfig).toString();
    navigate(`/booking/${pkg.id}?${query}`);
  };

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const res = await getPackageById(id);
        if (res.success) {
          setPkg(res.data);
        }
      } catch (err) {
        setError('Failed to load package details.');
      } finally {
        setLoading(false);
      }
    };
    fetchPackage();
  }, [id]);

  if (loading) return <Loader />;
  if (error) return <div className="error-message" style={{ margin: '40px auto', maxWidth: '800px', padding: '20px', background: '#fab1a0', color: '#d63031', borderRadius: '8px', textAlign: 'center' }}>{error}</div>;
  if (!pkg) return <div style={{ textAlign: 'center', padding: '50px' }}>Package not found</div>;

  const pkgImg = pkg.image && pkg.image.startsWith('http') ? pkg.image : getImageUrl(pkg.image, 'package');

  // Parse itinerary or create mock itinerary
  const getItineraryDays = () => {
    const defaultDays = [
      { day: 1, title: 'Arrival & Welcome', desc: 'Arrive at the destination. Our representative will pick you up from the airport/railway station and transfer you to the hotel. Check-in and relax. Evening at leisure.' },
      { day: 2, title: 'Local Sightseeing', desc: 'After breakfast, proceed for a full day of local sightseeing covering major attractions. Evening free for shopping or relaxation at the hotel.' },
      { day: 3, title: 'Adventure & Exploration', desc: 'Enjoy breakfast and head out for an exciting day exploring hidden gems and local culture. Optional activities available.' },
      { day: 4, title: 'Leisure Day', desc: 'Spend the day at your own pace. Relax by the beach/mountains, or explore the local markets. Evening special dinner.' },
      { day: 5, title: 'Departure', desc: 'After breakfast, check out from the hotel. Transfer to the airport/railway station for your onward journey with beautiful memories.' }
    ];
    return defaultDays;
  };

  const itineraryDays = getItineraryDays();

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', paddingBottom: '60px' }}>
      
      {/* Hero Image */}
      <div style={{ width: '100%', height: '500px', position: 'relative' }}>
        <img src={pkgImg} alt={pkg.packageName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.7))' }}></div>
        <div style={{ position: 'absolute', bottom: '40px', left: '5%', color: '#fff', zIndex: 2, maxWidth: '800px' }}>
          <div style={{ background: '#ff4757', display: 'inline-block', padding: '6px 15px', borderRadius: '30px', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '15px', textTransform: 'uppercase', letterSpacing: '1px' }}>
            {pkg.duration || '5 Days / 4 Nights'}
          </div>
          <h1 style={{ fontSize: '3.5rem', fontWeight: '800', margin: '0 0 10px 0', textShadow: '0 4px 10px rgba(0,0,0,0.5)' }}>{pkg.packageName}</h1>
          <p style={{ fontSize: '1.2rem', fontWeight: '500', opacity: 0.9 }}>📍 Destination: {pkg.Destination?.name || 'Multiple Locations'}</p>
        </div>
      </div>

      <div className="page-container" style={{ maxWidth: '1350px', margin: '0 auto', padding: '40px 20px', display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
        
        {/* Left Content */}
        <div style={{ flex: '1 1 700px' }}>
          
          {/* Tabs */}
          <div style={{ display: 'flex', background: '#fff', padding: '10px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', marginBottom: '30px', overflowX: 'auto', border: '1px solid #f1f2f6' }}>
            {['places', 'itinerary', 'inclusions', 'policies', 'reviews'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{ flex: 1, padding: '12px 20px', background: activeTab === tab ? '#ff4757' : 'transparent', color: activeTab === tab ? '#fff' : '#636e72', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.3s', textTransform: 'capitalize', whiteSpace: 'nowrap' }}
              >
                {tab}
              </button>
            ))}
          </div>

          <div style={{ background: '#fff', borderRadius: '16px', padding: '40px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', border: '1px solid #f1f2f6' }}>
            
            {activeTab === 'places' && (
              <div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#2d3436', marginBottom: '25px' }}>Places Included in this Package</h2>
                
                {pkg.Places && pkg.Places.length > 0 ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' }}>
                    {pkg.Places.map(place => (
                      <div key={place.id} style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', border: '1px solid #f1f2f6' }}>
                        <div style={{ height: '180px' }}>
                          <img src={place.image && place.image.startsWith('http') ? place.image : getImageUrl(place.image, 'place')} alt={place.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                          <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#2d3436', margin: '0 0 10px 0' }}>{place.name}</h3>
                          <p style={{ color: '#636e72', fontSize: '0.95rem', lineHeight: '1.6', margin: '0 0 15px 0', flex: 1 }}>
                            {place.description ? (place.description.length > 100 ? place.description.substring(0, 100) + '...' : place.description) : 'No description available.'}
                          </p>
                          <Link to={`/places/${place.slug || place.id}?dest=${encodeURIComponent(pkg.Destination?.name || '')}`} className="btn-secondary" style={{ textAlign: 'center', width: '100%', padding: '10px 0', fontSize: '0.95rem' }}>
                            View Place Details
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: '#636e72', fontSize: '1.1rem' }}>No specific places have been linked to this package yet.</p>
                )}
              </div>
            )}

            {activeTab === 'itinerary' && (
              <div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#2d3436', marginBottom: '15px' }}>Tour Overview</h2>
                <p style={{ fontSize: '1.05rem', color: '#636e72', lineHeight: '1.8', marginBottom: '40px' }}>
                  {pkg.description.includes('Day 1') ? pkg.description.substring(0, pkg.description.indexOf('Day 1')) : pkg.description}
                </p>

                <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#2d3436', marginBottom: '25px' }}>Detailed Itinerary</h2>
                <div>
                  {itineraryDays.map((day, idx) => (
                    <div key={idx} className="itinerary-day" style={{ display: 'flex', marginBottom: '25px', background: '#fdfdfd', padding: '25px', borderRadius: '12px', border: '1px solid #f1f2f6', transition: 'transform 0.3s, box-shadow 0.3s' }}
                         onMouseEnter={e => { e.currentTarget.style.transform = 'translateX(8px)'; e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.05)'; }}
                         onMouseLeave={e => { e.currentTarget.style.transform = 'translateX(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                      <div className="day-badge" style={{ background: '#ff4757', color: '#fff', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1rem', marginRight: '25px', height: 'fit-content', minWidth: '80px', textAlign: 'center', boxShadow: '0 4px 10px rgba(255,71,87,0.3)' }}>
                        Day {day.day}
                      </div>
                      <div className="day-content">
                        <h4 style={{ margin: '0 0 12px 0', fontSize: '1.3rem', color: '#2d3436', fontWeight: '700' }}>{day.title}</h4>
                        <p style={{ color: '#636e72', lineHeight: '1.7', margin: 0 }}>{day.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'inclusions' && (
              <div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#2d3436', marginBottom: '25px' }}>Package Details</h2>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '40px' }}>
                  <div style={{ background: '#f8f9fa', padding: '25px', borderRadius: '12px', borderLeft: '4px solid #2ecc71' }}>
                    <h3 style={{ fontSize: '1.3rem', color: '#27ae60', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '1.5rem' }}>✓</span> Inclusions
                    </h3>
                    <ul style={{ paddingLeft: '20px', color: '#636e72', lineHeight: '1.8', margin: 0 }}>
                      <li style={{ marginBottom: '8px' }}>Accommodation in 4-Star Premium Hotels</li>
                      <li style={{ marginBottom: '8px' }}>Daily Breakfast & Dinner</li>
                      <li style={{ marginBottom: '8px' }}>Airport/Railway Station Transfers</li>
                      <li style={{ marginBottom: '8px' }}>Private AC Vehicle for Sightseeing</li>
                      <li style={{ marginBottom: '8px' }}>All Tolls, Parking & Driver Allowances</li>
                    </ul>
                  </div>
                  
                  <div style={{ background: '#f8f9fa', padding: '25px', borderRadius: '12px', borderLeft: '4px solid #e74c3c' }}>
                    <h3 style={{ fontSize: '1.3rem', color: '#c0392b', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '1.5rem' }}>✕</span> Exclusions
                    </h3>
                    <ul style={{ paddingLeft: '20px', color: '#636e72', lineHeight: '1.8', margin: 0 }}>
                      <li style={{ marginBottom: '8px' }}>Airfare or Train Tickets</li>
                      <li style={{ marginBottom: '8px' }}>Personal Expenses (Laundry, Tips, etc.)</li>
                      <li style={{ marginBottom: '8px' }}>Monument Entry Fees & Guide Charges</li>
                      <li style={{ marginBottom: '8px' }}>Lunches & Beverages</li>
                      <li style={{ marginBottom: '8px' }}>Any activity not mentioned in Inclusions</li>
                    </ul>
                  </div>
                </div>
                
                <h3 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#2d3436', marginBottom: '15px' }}>Accommodation & Transport</h3>
                <p style={{ color: '#636e72', lineHeight: '1.8', marginBottom: '15px' }}><strong>Room Type:</strong> Premium Deluxe Room (Double Sharing)</p>
                <p style={{ color: '#636e72', lineHeight: '1.8', marginBottom: '15px' }}><strong>Vehicle:</strong> Toyota Innova Crysta or similar AC Sedan</p>
                <p style={{ color: '#636e72', lineHeight: '1.8', marginBottom: '15px' }}><strong>Pickup/Drop:</strong> Main Airport / Central Railway Station</p>
              </div>
            )}

            {activeTab === 'policies' && (
              <div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#2d3436', marginBottom: '25px' }}>Policies & Terms</h2>
                
                <h3 style={{ fontSize: '1.3rem', fontWeight: '700', color: '#2d3436', marginBottom: '15px' }}>Cancellation Policy</h3>
                <ul style={{ paddingLeft: '20px', color: '#636e72', lineHeight: '1.8', marginBottom: '30px' }}>
                  <li>30 days or more prior to departure: 10% of package cost</li>
                  <li>15 to 29 days prior to departure: 30% of package cost</li>
                  <li>7 to 14 days prior to departure: 50% of package cost</li>
                  <li>Less than 7 days prior to departure: 100% of package cost (No Refund)</li>
                </ul>

                <h3 style={{ fontSize: '1.3rem', fontWeight: '700', color: '#2d3436', marginBottom: '15px' }}>Frequently Asked Questions</h3>
                <div style={{ marginBottom: '20px' }}>
                  <p style={{ fontWeight: '600', color: '#2d3436', marginBottom: '8px' }}>Is flight fare included?</p>
                  <p style={{ color: '#636e72', lineHeight: '1.6', margin: 0 }}>No, flight fares are not included in the standard package price. We can arrange them upon request for an additional cost.</p>
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <p style={{ fontWeight: '600', color: '#2d3436', marginBottom: '8px' }}>Can I customize this package?</p>
                  <p style={{ color: '#636e72', lineHeight: '1.6', margin: 0 }}>Yes! Our packages are fully customizable. Contact our support team after booking to adjust the itinerary.</p>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#2d3436', marginBottom: '25px' }}>Customer Reviews</h2>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px', padding: '30px', background: '#f8f9fa', borderRadius: '12px' }}>
                  <div style={{ fontSize: '3rem', fontWeight: '800', color: '#2d3436' }}>4.8</div>
                  <div>
                    <div style={{ color: '#f39c12', fontSize: '1.5rem', letterSpacing: '2px', marginBottom: '5px' }}>★★★★★</div>
                    <div style={{ color: '#b2bec3', fontWeight: '600' }}>Based on 124 Reviews</div>
                  </div>
                </div>

                <div style={{ borderBottom: '1px solid #f1f2f6', paddingBottom: '25px', marginBottom: '25px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <h4 style={{ margin: 0, fontSize: '1.1rem', color: '#2d3436' }}>Rajesh Kumar</h4>
                    <span style={{ color: '#b2bec3', fontSize: '0.9rem' }}>2 weeks ago</span>
                  </div>
                  <div style={{ color: '#f39c12', fontSize: '1rem', marginBottom: '10px' }}>★★★★★</div>
                  <p style={{ color: '#636e72', lineHeight: '1.6', margin: 0 }}>Amazing experience! The hotels were fantastic and the driver was very polite and knowledgeable. Highly recommend GT Holidays for family trips.</p>
                </div>

                <div style={{ paddingBottom: '25px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <h4 style={{ margin: 0, fontSize: '1.1rem', color: '#2d3436' }}>Priya Sharma</h4>
                    <span style={{ color: '#b2bec3', fontSize: '0.9rem' }}>1 month ago</span>
                  </div>
                  <div style={{ color: '#f39c12', fontSize: '1rem', marginBottom: '10px' }}>★★★★☆</div>
                  <p style={{ color: '#636e72', lineHeight: '1.6', margin: 0 }}>The itinerary was well-planned. The only issue was a slight delay in airport pickup, but everything else was perfect.</p>
                </div>
              </div>
            )}
            
          </div>
        </div>

        {/* Right Sidebar - Sticky Booking Card */}
        <div style={{ flex: '1 1 350px' }}>
          <div style={{ background: '#fff', padding: '35px', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', position: 'sticky', top: '100px', border: '1px solid #f1f2f6' }}>
            
            <div style={{ fontSize: '0.9rem', color: '#b2bec3', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '1px', marginBottom: '5px' }}>Total Amount</div>
            <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#2d3436', marginBottom: '5px' }}>₹{calculateTotal().toLocaleString('en-IN')}</div>
            <div style={{ fontSize: '0.9rem', color: '#636e72', marginBottom: '25px' }}>Base Price: ₹{pkg.price.toLocaleString('en-IN')} / person</div>
            
            <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '12px', marginBottom: '25px', border: '1px solid #e1e8ed' }}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#2d3436', marginBottom: '8px' }}>Travel Date</label>
                <input type="date" name="travelDate" value={bookingConfig.travelDate} onChange={handleConfigChange} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #dcdde1' }} />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#2d3436', marginBottom: '8px' }}>Total Persons</label>
                <input type="number" min="1" name="totalPersons" value={bookingConfig.totalPersons} onChange={handleConfigChange} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #dcdde1' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#2d3436', marginBottom: '10px' }}>Optional Meal Add-ons (Per Person)</label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '8px', fontSize: '0.9rem' }}>
                  <input type="checkbox" name="hasBreakfast" checked={bookingConfig.hasBreakfast} onChange={handleConfigChange} style={{ margin: 0 }} />
                  Breakfast (+₹1,000)
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '8px', fontSize: '0.9rem' }}>
                  <input type="checkbox" name="hasLunch" checked={bookingConfig.hasLunch} onChange={handleConfigChange} style={{ margin: 0 }} />
                  Lunch (+₹1,500)
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
                  <input type="checkbox" name="hasDinner" checked={bookingConfig.hasDinner} onChange={handleConfigChange} style={{ margin: 0 }} />
                  Dinner (+₹2,000)
                </label>
              </div>
            </div>

            {user?.role === 'CUSTOMER' ? (
              <button onClick={handleBookNow} className="btn-primary gt-red" style={{ width: '100%', padding: '16px', fontSize: '1.2rem', borderRadius: '10px', boxShadow: '0 4px 15px rgba(255,71,87,0.3)', cursor: 'pointer', border: 'none' }}>
                Proceed to Book
              </button>
            ) : !user ? (
              <button onClick={() => navigate('/login')} className="btn-primary gt-red" style={{ width: '100%', padding: '16px', fontSize: '1.2rem', borderRadius: '10px', boxShadow: '0 4px 15px rgba(255,71,87,0.3)', cursor: 'pointer', border: 'none' }}>
                Login to Book
              </button>
            ) : (
              <button className="btn-primary" disabled style={{ width: '100%', padding: '16px', fontSize: '1.2rem', borderRadius: '10px', background: '#dfe4ea', color: '#b2bec3', border: 'none', cursor: 'not-allowed' }}>
                Customers Only
              </button>
            )}

            <p style={{ textAlign: 'center', color: '#b2bec3', fontSize: '0.85rem', marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
              🔒 Secure Checkout
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageDetails;
