import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import Loader from '../../components/Loader';

const AdminBookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBooking();
  }, [id]);

  const fetchBooking = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const endpoint = user?.role === 'TOUR_MANAGER' 
        ? `/manager/bookings/${id}` 
        : `/admin/bookings/${id}`;
        
      const res = await axiosInstance.get(endpoint);
      if (res.data.success) {
        setBooking(res.data.data);
      }
    } catch (err) {
      setError('Failed to load booking details.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadInvoice = () => {
    // Generate a simple printable invoice layout
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice - ${booking.bookingNumber || booking.id}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
            h1 { color: #2c3e50; }
            .invoice-details { margin-top: 30px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #f8f9fa; }
            .total { font-weight: bold; font-size: 1.2rem; margin-top: 20px; text-align: right; }
          </style>
        </head>
        <body>
          <h1>Invoice</h1>
          <p><strong>Booking ID:</strong> ${booking.bookingNumber || booking.id}</p>
          <p><strong>Date of Issue:</strong> ${new Date().toLocaleDateString()}</p>
          
          <div class="invoice-details">
            <h3>Customer Information</h3>
            <p>Name: ${booking.customerName}</p>
            <p>Email: ${booking.email || booking.User?.email}</p>
            <p>Phone: ${booking.phone || booking.User?.phone}</p>
            
            <h3>Trip Details</h3>
            <table>
              <tr>
                <th>Package Name</th>
                <th>Destination</th>
                <th>Travel Date</th>
                <th>Persons</th>
                <th>Total Amount</th>
              </tr>
              <tr>
                <td>${booking.packageName || booking.Package?.packageName}</td>
                <td>${booking.Package?.Destination?.name || 'N/A'}</td>
                <td>${new Date(booking.travelDate).toLocaleDateString()}</td>
                <td>${booking.totalPersons}</td>
                <td>Rs. ${booking.totalAmount}</td>
              </tr>
            </table>
            
            <div class="total">Grand Total: Rs. ${booking.totalAmount}</div>
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  if (loading) return <Loader />;
  if (error) return <div className="error-message">{error}</div>;
  if (!booking) return <div>Booking not found.</div>;

  return (
    <div className="page-container" style={{ maxWidth: '1000px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Booking Details - {booking.bookingNumber || `#${booking.id}`}</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-primary" onClick={handleDownloadInvoice} style={{ background: '#3498db', border: 'none' }}>Download Invoice</button>
          <button className="btn-secondary" onClick={() => navigate(-1)}>Back</button>
        </div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        
        {/* Customer Details */}
        <div style={{ background: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
          <h3 style={{ borderBottom: '2px solid #f1f2f6', paddingBottom: '10px', marginTop: 0 }}>Customer Info</h3>
          <p><strong>Name:</strong> {booking.customerName}</p>
          <p><strong>Mobile:</strong> {booking.phone || booking.User?.phone}</p>
          <p><strong>Email:</strong> {booking.email || booking.User?.email}</p>
          <p><strong>Emergency Contact:</strong> {booking.emergencyContactName} ({booking.emergencyContactNumber})</p>
          <p><strong>Address:</strong> {booking.address}, {booking.city}, {booking.state} - {booking.pincode}</p>
        </div>

        {/* Tour Details */}
        <div style={{ background: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
          <h3 style={{ borderBottom: '2px solid #f1f2f6', paddingBottom: '10px', marginTop: 0 }}>Tour Info</h3>
          <p><strong>Destination:</strong> {booking.Package?.Destination?.name}</p>
          <p><strong>Package:</strong> {booking.packageName || booking.Package?.packageName}</p>
          <p><strong>Travel Date:</strong> {new Date(booking.travelDate).toLocaleDateString()}</p>
          <p><strong>Persons:</strong> {booking.totalPersons} ({booking.adults} Adults, {booking.children} Children)</p>
          <p><strong>Booking Status:</strong> <span className="badge badge-primary">{booking.bookingStatus.replace(/_/g, ' ')}</span></p>
        </div>

        {/* Logistics */}
        <div style={{ background: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', gridColumn: '1 / -1' }}>
          <h3 style={{ borderBottom: '2px solid #f1f2f6', paddingBottom: '10px', marginTop: 0 }}>Logistics & Operations</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
            <div><p style={{ color: '#7f8c8d', margin: '0 0 5px 0' }}>Hotel Name</p><strong>{booking.hotelName || 'Not Assigned'}</strong></div>
            <div><p style={{ color: '#7f8c8d', margin: '0 0 5px 0' }}>Driver Name</p><strong>{booking.driverName || 'Not Assigned'}</strong></div>
            <div><p style={{ color: '#7f8c8d', margin: '0 0 5px 0' }}>Vehicle Number</p><strong>{booking.vehicleNumber || 'Not Assigned'}</strong></div>
            <div><p style={{ color: '#7f8c8d', margin: '0 0 5px 0' }}>Pickup Point</p><strong>{booking.pickupLocation || 'Not Assigned'}</strong></div>
            <div><p style={{ color: '#7f8c8d', margin: '0 0 5px 0' }}>Pickup Time</p><strong>{booking.pickupTime || 'Not Assigned'}</strong></div>
            <div><p style={{ color: '#7f8c8d', margin: '0 0 5px 0' }}>Guide ID</p><strong>{booking.guideId || 'Not Assigned'}</strong></div>
          </div>
        </div>

        {/* Documents & Extra */}
        <div style={{ background: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', gridColumn: '1 / -1' }}>
          <h3 style={{ borderBottom: '2px solid #f1f2f6', paddingBottom: '10px', marginTop: 0 }}>Documents & Extras</h3>
          <p><strong>Special Requests:</strong> {booking.specialRequests || 'None'}</p>
          
          <div style={{ marginTop: '20px' }}>
            <strong>ID Proofs:</strong>
            <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
              {booking.idProofFront ? (
                <a href={`http://localhost:5000${booking.idProofFront}`} target="_blank" rel="noreferrer" style={{ padding: '10px 20px', background: '#ecf0f1', borderRadius: '4px', textDecoration: 'none', color: '#2c3e50' }}>View ID Front</a>
              ) : <span>No ID Front</span>}
              {booking.idProofBack ? (
                <a href={`http://localhost:5000${booking.idProofBack}`} target="_blank" rel="noreferrer" style={{ padding: '10px 20px', background: '#ecf0f1', borderRadius: '4px', textDecoration: 'none', color: '#2c3e50' }}>View ID Back</a>
              ) : <span>No ID Back</span>}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminBookingDetails;
