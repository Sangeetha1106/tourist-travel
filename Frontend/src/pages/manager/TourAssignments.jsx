import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import Loader from '../../components/Loader';

const TourAssignments = () => {
  const [bookings, setBookings] = useState([]);
  const [guides, setGuides] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal State
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState('');

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialStatus = queryParams.get('status') || '';

  // DataGrid State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [sortField, setSortField] = useState('travelDate');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const newStatus = new URLSearchParams(location.search).get('status');
    if (newStatus) setStatusFilter(newStatus);
  }, [location.search]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [bookingsRes, guidesRes, vehiclesRes, hotelsRes] = await Promise.allSettled([
        axiosInstance.get('/manager/bookings'),
        axiosInstance.get('/guides'),
        axiosInstance.get('/vehicles'),
        axiosInstance.get('/hotels')
      ]);
      
      if (bookingsRes.status === 'fulfilled' && bookingsRes.value.data.success) {
        const assignments = bookingsRes.value.data.data.filter(
          b => b.bookingStatus === 'CONFIRMED' || b.bookingStatus === 'GUIDE_ASSIGNED'
        );
        setBookings(assignments);
      }
      
      if (guidesRes.status === 'fulfilled' && guidesRes.value.data.success) {
        setGuides(Array.isArray(guidesRes.value.data.data) ? guidesRes.value.data.data : []);
      }
      
      if (vehiclesRes.status === 'fulfilled' && vehiclesRes.value.data.success) {
        setVehicles(Array.isArray(vehiclesRes.value.data.data) ? vehiclesRes.value.data.data : []);
      }
      
      if (hotelsRes.status === 'fulfilled' && hotelsRes.value.data.success) {
        setHotels(Array.isArray(hotelsRes.value.data.data) ? hotelsRes.value.data.data : []);
      }
    } catch (err) {
      setError('Failed to fetch assignment data from server.');
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (bookingId, type, value) => {
    try {
      let endpoint = '';
      let payload = {};
      
      if (type === 'guide') {
        endpoint = `/bookings/${bookingId}/assign-guide`;
        payload = { guideId: value };
      } else if (type === 'vehicle') {
        endpoint = `/bookings/${bookingId}/assign-vehicle`;
        payload = { vehicleId: value, vehicleNumber: value }; // sending both to be safe based on how the backend gets it
      } else if (type === 'hotel') {
        endpoint = `/bookings/${bookingId}/assign-hotel`;
        payload = { hotelId: value, hotelName: value };
      }

      const res = await axiosInstance.put(endpoint, payload);
      if (res.data.success) {
        alert(`${type.charAt(0).toUpperCase() + type.slice(1)} assigned successfully`);
        fetchData();
      }
    } catch (err) {
      alert(`Failed to assign ${type}. Please try again.`);
    }
  };

  const openModal = async (bookingId) => {
    setSelectedBookingId(bookingId);
    setModalLoading(true);
    setModalError('');
    setModalData(null);

    try {
      const res = await axiosInstance.get(`/manager/bookings/${bookingId}`);
      if (res.data.success) {
        setModalData(res.data.data);
      } else {
        setModalError('No records found.');
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setModalError('Booking not found (404).');
      } else if (err.response?.status >= 500) {
        setModalError('Internal Server Error (500). Please try again later.');
      } else {
        setModalError('Network Error. Could not fetch booking details.');
      }
    } finally {
      setModalLoading(false);
    }
  };

  const closeModal = () => {
    setSelectedBookingId(null);
    setModalData(null);
    setModalError('');
  };

  // Filter
  const filteredBookings = bookings.filter(b => {
    const matchesSearch = 
      (b.customerName && b.customerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (b.bookingNumber && b.bookingNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (b.packageName && b.packageName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter ? b.bookingStatus === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  // Sort
  const sortedBookings = [...filteredBookings].sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];
    if (sortField === 'travelDate') {
      valA = new Date(valA).getTime();
      valB = new Date(valB).getTime();
    }
    if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedBookings.length / itemsPerPage);
  const currentItems = sortedBookings.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (loading) return <Loader />;

  return (
    <div className="page-container" style={{ position: 'relative' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h2>Tour Logistics & Assignments</h2>
          <p>Assign guides, vehicles, and hotels to confirmed bookings</p>
        </div>
        <button className="btn-secondary" onClick={fetchData}>↻ Refresh Data</button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div style={{ background: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
        
        {/* Toolbar */}
        <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <input 
            type="text" 
            placeholder="Search by ID, Customer, or Package..." 
            className="form-control" 
            style={{ maxWidth: '300px' }} 
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
          <select 
            className="form-control" 
            style={{ maxWidth: '200px' }}
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
          >
            <option value="">All Assignable</option>
            <option value="CONFIRMED">Pending (Confirmed)</option>
            <option value="GUIDE_ASSIGNED">Partially Assigned</option>
          </select>
          <select 
            className="form-control" 
            style={{ maxWidth: '200px' }}
            value={`${sortField}-${sortOrder}`}
            onChange={(e) => { 
              const [field, order] = e.target.value.split('-');
              setSortField(field); setSortOrder(order);
            }}
          >
            <option value="travelDate-asc">Travel Date (Earliest First)</option>
            <option value="travelDate-desc">Travel Date (Latest First)</option>
          </select>
        </div>

        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Customer</th>
                <th>Travel Date</th>
                <th>Assign Guide</th>
                <th>Assign Vehicle</th>
                <th>Assign Hotel</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? currentItems.map(b => (
                <tr key={b.id}>
                  <td><strong>{b.bookingNumber || `#${b.id}`}</strong></td>
                  <td>
                    <div style={{ fontWeight: 'bold', color: '#2d3436' }}>{b.customerName}</div>
                    <div style={{ fontSize: '0.8rem', color: '#636e72' }}>{b.packageName}</div>
                  </td>
                  <td>{new Date(b.travelDate).toLocaleDateString()}</td>
                  <td>
                    <select 
                      className="form-control" 
                      style={{ width: '130px', padding: '5px' }}
                      value={b.assignedGuideId || b.guideId || ''}
                      onChange={(e) => handleAssign(b.id, 'guide', e.target.value)}
                    >
                      <option value="">Select Guide</option>
                      {guides.map(g => (
                        <option key={g.guideId} value={g.guideId}>{g.fullName || g.firstName}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <select 
                      className="form-control" 
                      style={{ width: '130px', padding: '5px' }}
                      value={b.assignedVehicleId || b.vehicleNumber || ''}
                      onChange={(e) => handleAssign(b.id, 'vehicle', e.target.value)}
                    >
                      <option value="">Select Vehicle</option>
                      {vehicles.map(v => (
                        <option key={v.vehicleId} value={v.vehicleNumber}>{v.vehicleName} ({v.vehicleNumber})</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <select 
                      className="form-control" 
                      style={{ width: '130px', padding: '5px' }}
                      value={b.assignedHotelId || b.hotelName || ''}
                      onChange={(e) => handleAssign(b.id, 'hotel', e.target.value)}
                    >
                      <option value="">Select Hotel</option>
                      {hotels.map(h => (
                        <option key={h.hotelId} value={h.hotelName}>{h.hotelName}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <button onClick={() => openModal(b.id)} className="btn-secondary btn-sm" style={{ padding: '5px 10px' }}>View</button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: '#636e72' }}>
                    <strong>No records found.</strong>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', gap: '10px' }}>
            <button className="btn-secondary" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>Prev</button>
            <span style={{ padding: '8px 15px', background: '#f8f9fa', borderRadius: '4px' }}>Page {currentPage} of {totalPages}</span>
            <button className="btn-secondary" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>Next</button>
          </div>
        )}
      </div>

      {/* Booking Details Professional Modal */}
      {selectedBookingId && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
          backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', 
          alignItems: 'center', zIndex: 1000, padding: '20px'
        }}>
          <div style={{
            background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '800px', 
            maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
            animation: 'fadeIn 0.3s ease'
          }}>
            <div style={{ padding: '20px 30px', borderBottom: '1px solid #f1f2f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: '#fff', zIndex: 1 }}>
              <h3 style={{ margin: 0, color: '#2d3436' }}>Booking Details #{modalData?.bookingNumber || selectedBookingId}</h3>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#636e72' }}>&times;</button>
            </div>
            
            <div style={{ padding: '30px' }}>
              {modalLoading && <div style={{ textAlign: 'center', padding: '40px' }}><div className="spinner"></div><p>Loading details...</p></div>}
              
              {modalError && (
                <div style={{ background: '#ffeaa7', color: '#d35400', padding: '20px', borderRadius: '8px', textAlign: 'center', fontWeight: 'bold' }}>
                  {modalError}
                </div>
              )}

              {!modalLoading && !modalError && modalData && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                  
                  {/* Left Column */}
                  <div>
                    <h4 style={{ color: '#0984e3', marginBottom: '15px', borderBottom: '2px solid #f1f2f6', paddingBottom: '5px' }}>Customer Info</h4>
                    <table style={{ width: '100%', marginBottom: '20px' }}>
                      <tbody>
                        <tr><td style={{ padding: '8px 0', color: '#636e72' }}>Name:</td><td style={{ fontWeight: '600' }}>{modalData.customerName}</td></tr>
                        <tr><td style={{ padding: '8px 0', color: '#636e72' }}>Phone:</td><td style={{ fontWeight: '600' }}>{modalData.phone}</td></tr>
                        <tr><td style={{ padding: '8px 0', color: '#636e72' }}>Email:</td><td style={{ fontWeight: '600' }}>{modalData.email}</td></tr>
                        <tr><td style={{ padding: '8px 0', color: '#636e72' }}>Adults:</td><td style={{ fontWeight: '600' }}>{modalData.totalPersons}</td></tr>
                        <tr><td style={{ padding: '8px 0', color: '#636e72' }}>Children:</td><td style={{ fontWeight: '600' }}>{modalData.childrenCount}</td></tr>
                      </tbody>
                    </table>

                    <h4 style={{ color: '#00b894', marginBottom: '15px', borderBottom: '2px solid #f1f2f6', paddingBottom: '5px' }}>Package & Trip</h4>
                    <table style={{ width: '100%', marginBottom: '20px' }}>
                      <tbody>
                        <tr><td style={{ padding: '8px 0', color: '#636e72' }}>Package:</td><td style={{ fontWeight: '600' }}>{modalData.packageName}</td></tr>
                        <tr><td style={{ padding: '8px 0', color: '#636e72' }}>Travel Date:</td><td style={{ fontWeight: '600' }}>{new Date(modalData.travelDate).toLocaleDateString()}</td></tr>
                        <tr><td style={{ padding: '8px 0', color: '#636e72' }}>Status:</td><td><span className="badge badge-primary">{modalData.bookingStatus}</span></td></tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Right Column */}
                  <div>
                    <h4 style={{ color: '#fdcb6e', marginBottom: '15px', borderBottom: '2px solid #f1f2f6', paddingBottom: '5px' }}>Logistics</h4>
                    <table style={{ width: '100%', marginBottom: '20px' }}>
                      <tbody>
                        <tr><td style={{ padding: '8px 0', color: '#636e72' }}>Assigned Guide:</td><td style={{ fontWeight: '600' }}>{modalData.assignedGuideId || modalData.guideId ? `Guide #${modalData.assignedGuideId || modalData.guideId}` : <span style={{ color: '#e17055' }}>Not Assigned</span>}</td></tr>
                        <tr><td style={{ padding: '8px 0', color: '#636e72' }}>Vehicle:</td><td style={{ fontWeight: '600' }}>{modalData.vehicleNumber || modalData.assignedVehicleId || <span style={{ color: '#e17055' }}>Not Assigned</span>}</td></tr>
                        <tr><td style={{ padding: '8px 0', color: '#636e72' }}>Hotel:</td><td style={{ fontWeight: '600' }}>{modalData.hotelName || modalData.assignedHotelId || <span style={{ color: '#e17055' }}>Not Assigned</span>}</td></tr>
                      </tbody>
                    </table>

                    <h4 style={{ color: '#6c5ce7', marginBottom: '15px', borderBottom: '2px solid #f1f2f6', paddingBottom: '5px' }}>Documents & Extras</h4>
                    <table style={{ width: '100%' }}>
                      <tbody>
                        <tr>
                          <td style={{ padding: '8px 0', color: '#636e72' }}>Aadhaar/ID:</td>
                          <td>
                            {modalData.idProofFront ? (
                              <a href={modalData.idProofFront} target="_blank" rel="noreferrer" style={{ color: '#0984e3', textDecoration: 'underline' }}>View Front</a>
                            ) : 'Not Uploaded'}
                            {modalData.idProofBack && (
                              <span> | <a href={modalData.idProofBack} target="_blank" rel="noreferrer" style={{ color: '#0984e3', textDecoration: 'underline' }}>View Back</a></span>
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td colSpan="2" style={{ padding: '15px 0 5px', color: '#636e72' }}>Special Requests / Add-ons:</td>
                        </tr>
                        <tr>
                          <td colSpan="2" style={{ background: '#f8f9fa', padding: '10px', borderRadius: '8px' }}>
                            <div style={{ display: 'flex', gap: '10px' }}>
                              {modalData.hasBreakfast && <span className="badge badge-info">Breakfast</span>}
                              {modalData.hasLunch && <span className="badge badge-info">Lunch</span>}
                              {modalData.hasDinner && <span className="badge badge-info">Dinner</span>}
                              {!modalData.hasBreakfast && !modalData.hasLunch && !modalData.hasDinner && <span>None</span>}
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                </div>
              )}
            </div>
            
            <div style={{ padding: '20px 30px', background: '#f8f9fa', borderTop: '1px solid #f1f2f6', textAlign: 'right', borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px' }}>
              <button onClick={closeModal} className="btn-secondary" style={{ padding: '10px 20px' }}>Close Window</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .spinner {
          width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #0984e3;
          border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 15px;
        }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default TourAssignments;
