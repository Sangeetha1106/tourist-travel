import { useState, useEffect } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { getAllPackages } from '../api/packageApi';
import { getAllDestinations } from '../api/destinationApi';
import Loader from '../components/Loader';
import { getPlaceById } from '../api/placeApi';

const getPackageImage = (pkg) => {
  if (pkg.image && pkg.image.startsWith('http')) return pkg.image;
  return 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80';
};

const formatPrice = (price) => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  if (isNaN(numPrice)) return '0';
  return numPrice.toLocaleString('en-IN');
};

const PackageList = () => {
  const { placeId } = useParams();
  const location = useLocation();
  
  const [packages, setPackages] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [placeDetails, setPlaceDetails] = useState(null);

  // Filter & Pagination State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDestination, setSelectedDestination] = useState('');
  const [maxPrice, setMaxPrice] = useState(100000);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const canCreate = user && (user.role === 'SUPER_ADMIN' || user.role === 'ADMIN' || user.role === 'TOUR_MANAGER');

  const getAdminLink = () => {
    switch (user?.role) {
      case 'SUPER_ADMIN': return '/super-admin/packages/create';
      case 'ADMIN': return '/admin/packages/create';
      case 'TOUR_MANAGER': return '/manager/packages/create';
      default: return '/';
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (placeId) {
          // Tourist Place View Logic
          const placeRes = await getPlaceById(placeId);
          if (placeRes.success && placeRes.data) {
            setPlaceDetails(placeRes.data);
            
            const pkgsRes = await getAllPackages({ placeId });
            if (pkgsRes.success) {
              setPackages(pkgsRes.data);
            }
          } else {
            setError('Tourist place not found.');
          }
        } else {
          // Standard View Logic
          const [pkgRes, destRes] = await Promise.all([
            getAllPackages(),
            getAllDestinations()
          ]);
          if (pkgRes.success) setPackages(pkgRes.data);
          if (destRes.success) setDestinations(destRes.data);
        }
      } catch (err) {
        setError('Failed to load data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [placeId]);

  if (loading) return <Loader />;

  // Filter Data
  const filteredPackages = packages.filter(pkg => {
    const matchesSearch = pkg.packageName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDestination = selectedDestination ? pkg.destinationId?.toString() === selectedDestination : true;
    const matchesPrice = parseFloat(pkg.price) <= maxPrice;
    
    return matchesSearch && matchesDestination && matchesPrice;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredPackages.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPackages = filteredPackages.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', paddingBottom: '60px' }}>
      <style>
        {`
          .packages-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
            gap: 30px;
            align-items: stretch;
            width: 100%;
          }
          .pkg-card {
            background: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
            display: flex;
            flex-direction: column;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            height: 100%;
            border: 1px solid rgba(0,0,0,0.03);
          }
          .pkg-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.12);
          }
          .pkg-img-wrapper {
            position: relative;
            height: 220px;
            overflow: hidden;
            flex-shrink: 0;
            width: 100%;
          }
          .pkg-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.6s ease;
          }
          .pkg-card:hover .pkg-img {
            transform: scale(1.1);
          }
          .pkg-badge {
            position: absolute;
            top: 15px;
            right: 15px;
            background: #ff4757;
            color: #fff;
            padding: 6px 14px;
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: 700;
            box-shadow: 0 4px 10px rgba(0,0,0,0.2);
            z-index: 2;
          }
          .pkg-body {
            padding: 25px;
            display: flex;
            flex-direction: column;
            flex: 1;
            background: #fff;
          }
          .pkg-dest-title {
            font-size: 1.4rem;
            font-weight: 900;
            color: #2d3436;
            margin: 0 0 6px 0;
          }
          .pkg-desc {
            color: #636e72;
            font-size: 0.95rem;
            line-height: 1.6;
            margin-bottom: 25px;
            flex: 1;
          }
          .pkg-footer {
            border-top: 1px solid #f1f2f6;
            padding-top: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: auto;
          }
        `}
      </style>

      {/* Tourist Place Hero (Only visible if placeId exists) */}
      {placeDetails && (
        <>
          <div className="category-hero" style={{ backgroundImage: `url(${placeDetails.image})`, height: '450px', marginBottom: '0' }}>
            <div style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
              <h1 style={{ fontSize: '4.5rem', margin: '0 0 10px 0', textShadow: '0 4px 15px rgba(0,0,0,0.5)' }}>{placeDetails.name}</h1>
              <p style={{ color: '#fff', fontSize: '1.2rem', fontWeight: '500', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                ⭐ Beautiful Tourist Place
              </p>
            </div>
          </div>
          
          <div className="page-container" style={{ maxWidth: '1200px', margin: '-50px auto 40px', position: 'relative', zIndex: 10, padding: '0 20px' }}>
            <div style={{ background: '#fff', borderRadius: '16px', padding: '40px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}>
              <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#2d3436', marginBottom: '20px' }}>About {placeDetails.name}</h2>
              <p style={{ fontSize: '1.05rem', color: '#636e72', lineHeight: '1.8', marginBottom: '30px' }}>
                {placeDetails.description}
              </p>

              <div className="info-cards-grid">
                <div className="info-card">
                  <div className="info-card-icon">💵</div>
                  <div className="info-card-title">Budget / Entry</div>
                  <div className="info-card-value">{placeDetails.entryFee}</div>
                </div>
                <div className="info-card">
                  <div className="info-card-icon">☀️</div>
                  <div className="info-card-title">Best Time</div>
                  <div className="info-card-value">{placeDetails.bestTime}</div>
                </div>
                <div className="info-card">
                  <div className="info-card-icon">🏨</div>
                  <div className="info-card-title">Facilities</div>
                  <div className="info-card-value">{placeDetails.hotels}</div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="page-container" style={{ maxWidth: '1350px', margin: '0 auto', padding: '0 20px', width: '100%', boxSizing: 'border-box' }}>
        
        {!placeDetails && (
          <div className="page-header" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '20px', borderBottom: 'none', marginBottom: '40px', padding: '40px 0 0 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
              <h2 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#2d3436', margin: 0 }}>Discover Tours</h2>
              {canCreate && (
                <Link to={getAdminLink()} className="btn-primary gt-red" style={{ padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold' }}>Add Package</Link>
              )}
            </div>
            
            {/* Filters Bar */}
            <div style={{ display: 'flex', gap: '20px', width: '100%', flexWrap: 'wrap', backgroundColor: '#ffffff', padding: '25px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)', border: '1px solid rgba(0,0,0,0.03)' }}>
              <div style={{ flex: '1 1 300px' }}>
                <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: '600', color: '#636e72', marginBottom: '8px' }}>Search Tour</label>
                <input 
                  type="text" 
                  placeholder="Search packages..." 
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                  style={{ width: '100%', padding: '12px 15px', borderRadius: '8px', border: '1px solid #dfe4ea', fontSize: '1rem', transition: 'border-color 0.3s', boxSizing: 'border-box' }}
                />
              </div>
              
              <div style={{ flex: '1 1 200px' }}>
                <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: '600', color: '#636e72', marginBottom: '8px' }}>Destination</label>
                <select 
                  value={selectedDestination} 
                  onChange={(e) => { setSelectedDestination(e.target.value); setCurrentPage(1); }}
                  style={{ width: '100%', padding: '12px 15px', borderRadius: '8px', border: '1px solid #dfe4ea', fontSize: '1rem', backgroundColor: '#fff', cursor: 'pointer', boxSizing: 'border-box' }}
                >
                  <option value="">All Destinations</option>
                  {destinations.map(dest => (
                    <option key={dest.id} value={dest.id}>{dest.name}</option>
                  ))}
                </select>
              </div>

              <div style={{ flex: '1 1 200px' }}>
                <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: '600', color: '#636e72', marginBottom: '8px' }}>
                  Max Price: ₹{parseInt(maxPrice).toLocaleString('en-IN')}
                </label>
                <input 
                  type="range" 
                  min="1000" 
                  max="100000" 
                  step="1000"
                  value={maxPrice}
                  onChange={(e) => { setMaxPrice(e.target.value); setCurrentPage(1); }}
                  style={{ width: '100%', marginTop: '10px', cursor: 'pointer', boxSizing: 'border-box' }}
                />
              </div>
            </div>
          </div>
        )}

        {placeDetails && (
          <div style={{ marginBottom: '30px' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#2d3436' }}>Available Packages for {placeDetails.name}</h2>
          </div>
        )}
        
        {error && <div className="error-message" style={{ color: '#d63031', backgroundColor: '#fab1a0', padding: '15px', borderRadius: '8px', textAlign: 'center', marginBottom: '20px' }}>{error}</div>}
        
        {filteredPackages.length === 0 && !error ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#f8f9fa', borderRadius: '16px', border: '1px dashed #dfe4ea' }}>
            <h3 style={{ fontSize: '1.5rem', color: '#2d3436', marginBottom: '10px' }}>No packages found.</h3>
            <p style={{ color: '#636e72', fontSize: '1.05rem' }}>Try adjusting your search to find the perfect tour.</p>
          </div>
        ) : (
          <>
            <div className="packages-grid">
              {paginatedPackages.map((pkg, index) => (
                <div key={pkg.id} className="pkg-card">
                  <div className="pkg-img-wrapper">
                    <div className="pkg-badge">{pkg.duration || '5 Days / 4 Nights'}</div>
                    <img 
                      src={getPackageImage(pkg)} 
                      alt={pkg.packageName} 
                      className="pkg-img"
                    />
                  </div>
                  <div className="pkg-body">
                    {!placeDetails && <h2 className="pkg-dest-title">{pkg.Destination?.name || 'Destination'}</h2>}
                    <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#2d3436', margin: '0 0 10px 0' }}>{pkg.packageName}</h3>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                      <div style={{ color: '#fdcb6e', fontSize: '1.1rem', display: 'flex', alignItems: 'center' }}>
                        ★★★★★ <span style={{ color: '#b2bec3', fontSize: '0.85rem', marginLeft: '6px', fontWeight: '600' }}>({pkg.rating || '5.0'})</span>
                      </div>
                    </div>
                    
                    <p className="pkg-desc">{pkg.description}</p>
                    
                    <div className="pkg-footer">
                      <div>
                        <div style={{ fontSize: '0.75rem', color: '#b2bec3', textTransform: 'uppercase', fontWeight: 'bold' }}>Starts From</div>
                        <div style={{ fontSize: '1.3rem', fontWeight: '800', color: '#2d3436' }}>₹{formatPrice(pkg.price)}</div>
                      </div>
                      <Link to={`/packages/${pkg.slug || pkg.id}`} className="btn-primary gt-red" style={{ width: '100%', padding: '12px 0', textAlign: 'center', borderRadius: '8px', fontSize: '1rem' }}>
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '50px' }}>
                <button 
                  onClick={() => handlePageChange(currentPage - 1)} 
                  disabled={currentPage === 1}
                  style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid #dfe4ea', background: currentPage === 1 ? '#f1f2f6' : '#fff', color: currentPage === 1 ? '#b2bec3' : '#2d3436', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', fontWeight: '600', transition: 'all 0.2s' }}
                >
                  Previous
                </button>
                
                {[...Array(totalPages)].map((_, i) => {
                  if (i === 0 || i === totalPages - 1 || (i >= currentPage - 2 && i <= currentPage)) {
                    return (
                      <button 
                        key={i} 
                        onClick={() => handlePageChange(i + 1)}
                        style={{ padding: '10px 18px', borderRadius: '8px', border: currentPage === i + 1 ? '1px solid #ff4757' : '1px solid #dfe4ea', background: currentPage === i + 1 ? '#ff4757' : '#fff', color: currentPage === i + 1 ? '#fff' : '#2d3436', cursor: 'pointer', fontWeight: '600', transition: 'all 0.2s' }}
                      >
                        {i + 1}
                      </button>
                    );
                  } else if (i === 1 || i === totalPages - 2) {
                    return <span key={i} style={{ padding: '10px 4px', color: '#b2bec3', fontWeight: 'bold' }}>...</span>;
                  }
                  return null;
                })}

                <button 
                  onClick={() => handlePageChange(currentPage + 1)} 
                  disabled={currentPage === totalPages}
                  style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid #dfe4ea', background: currentPage === totalPages ? '#f1f2f6' : '#fff', color: currentPage === totalPages ? '#b2bec3' : '#2d3436', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', fontWeight: '600', transition: 'all 0.2s' }}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PackageList;

