import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getAllDestinations } from '../api/destinationApi';
import { getImageUrl } from '../utils/imageHelper';
import Loader from '../components/Loader';

const DestinationList = ({ category }) => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Search & Pagination State
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const canCreate = user && (user.role === 'SUPER_ADMIN' || user.role === 'ADMIN');

  const getAdminLink = () => {
    switch (user?.role) {
      case 'SUPER_ADMIN': return '/super-admin/destinations/create';
      case 'ADMIN': return '/admin/destinations/create';
      default: return '/';
    }
  };

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const queryParams = category ? { category } : {};
        const res = await getAllDestinations(queryParams);
        
        if (res.success) {
          setDestinations(res.data);
        }
      } catch (err) {
        setError('Failed to load destinations.');
      } finally {
        setLoading(false);
      }
    };
    
    // Reset state on category change
    setCurrentPage(1);
    setSearchTerm('');
    setLoading(true);
    fetchDestinations();
  }, [category]);

  if (loading) return <Loader />;

  // Filter Data
  const filteredDestinations = destinations.filter(dest => {
    return dest.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
           dest.location.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredDestinations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDestinations = filteredDestinations.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getCategoryTitle = () => {
    if (!category) return "Explore All Destinations";
    const titles = {
      india: "India Tours",
      international: "International Tours",
      honeymoon: "Honeymoon Packages",
      europe: "Europe Tours"
    };
    return titles[category] || "Tours";
  };
  
  const getCategoryHero = () => {
    const images = {
      india: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1920&q=80",
      international: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1920&q=80",
      honeymoon: "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=1920&q=80",
      europe: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1920&q=80"
    };
    return images[category] || "";
  };

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', paddingBottom: '60px' }}>
      
      {category && (
        <div className="category-hero" style={{ backgroundImage: `url(${getCategoryHero()})` }}>
          <h1>{getCategoryTitle()}</h1>
        </div>
      )}

      <div className="page-container" style={{ maxWidth: '1350px', margin: '0 auto', padding: '0 20px', width: '100%' }}>
        <div className="page-header" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '20px', borderBottom: 'none', marginBottom: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
            {!category && <h2 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#2d3436' }}>{getCategoryTitle()}</h2>}
            {canCreate && !category && (
              <Link to={getAdminLink()} className="btn-primary gt-red">Add Destination</Link>
            )}
          </div>
          
          {/* Search Bar */}
          <div style={{ width: '100%', maxWidth: '500px' }}>
            <input 
              type="text" 
              placeholder="Search destinations..." 
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              style={{ width: '100%', padding: '15px 20px', borderRadius: '12px', border: '1px solid #dfe4ea', fontSize: '1rem', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}
            />
          </div>
        </div>

        {error && <div className="error-message" style={{ background: '#fab1a0', color: '#d63031', padding: '15px', borderRadius: '8px' }}>{error}</div>}
        
        {filteredDestinations.length === 0 && !error ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', background: '#fff', borderRadius: '16px', border: '1px dashed #dfe4ea' }}>
            <h3 style={{ fontSize: '1.5rem', color: '#2d3436' }}>No destinations found.</h3>
            <p style={{ color: '#b2bec3', marginTop: '10px' }}>Try adjusting your search criteria.</p>
          </div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px' }}>
              {paginatedDestinations.map(dest => (
                <div key={dest.id} style={{ background: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', transition: 'transform 0.3s, box-shadow 0.3s', border: '1px solid rgba(0,0,0,0.03)' }}
                     onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-10px)'; e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.1)'; }}
                     onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.06)'; }}
                >
                  <div style={{ height: '240px', overflow: 'hidden', position: 'relative' }}>
                    <img 
                      src={dest.image && dest.image.startsWith('http') ? dest.image : getImageUrl(dest.image, 'destination')} 
                      alt={dest.name} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                      onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                    />
                  </div>
                  <div style={{ padding: '25px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#2d3436', margin: '0 0 5px 0' }}>{dest.name}</h3>
                    <p style={{ color: '#636e72', fontSize: '0.9rem', marginBottom: '15px', fontWeight: '500' }}>📍 {dest.location}</p>
                    
                    <p style={{ color: '#636e72', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '20px', flex: 1, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {dest.description}
                    </p>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #f1f2f6' }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '0.8rem', color: '#b2bec3', textTransform: 'uppercase', fontWeight: '700' }}>Rating</span>
                        <span style={{ color: '#f39c12', fontWeight: 'bold', fontSize: '1.1rem' }}>★ {dest.rating || '4.5'} <span style={{ color: '#b2bec3', fontSize: '0.9rem', fontWeight: 'normal' }}>/5</span></span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'right' }}>
                        <span style={{ fontSize: '0.8rem', color: '#b2bec3', textTransform: 'uppercase', fontWeight: '700' }}>Starting Price</span>
                        <span style={{ color: '#2d3436', fontWeight: '800', fontSize: '1.2rem' }}>₹{(dest.price || 5000).toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    <Link to={`/destination/${dest.name.toLowerCase().replace(/\s+/g, '-')}`} className="btn-primary gt-red" style={{ width: '100%', padding: '12px 0', textAlign: 'center', borderRadius: '8px', fontSize: '1rem' }}>
                      View Packages
                    </Link>
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

export default DestinationList;
