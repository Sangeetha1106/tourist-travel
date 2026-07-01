import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getBookingById } from '../api/bookingApi';
import Loader from '../components/Loader';
import html2pdf from 'html2pdf.js';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('bookingId');
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (bookingId) {
      const fetchBooking = async () => {
        try {
          const res = await getBookingById(bookingId);
          if (res.success) {
            setBooking(res.data);
          }
        } catch (err) {
          console.error("Failed to load booking details");
        } finally {
          setLoading(false);
        }
      };
      fetchBooking();
    } else {
      setLoading(false);
    }
  }, [bookingId]);

  if (loading) return <Loader />;

  if (!booking) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px' }}>
        <h2>Payment Successful!</h2>
        <p>Your booking has been confirmed, but we could not load the receipt details.</p>
        <Link to="/my-trips" className="btn-primary" style={{ marginTop: '20px', padding: '10px 20px' }}>Go to My Trips</Link>
      </div>
    );
  }

  // Handle both array or object associations
  const paymentObj = Array.isArray(booking.Payments) ? booking.Payments[0] : (booking.Payment || {});
  const paymentId = paymentObj?.id || 'N/A';
  const transactionId = paymentObj?.transactionId || `TXN-${Math.floor(Math.random()*1000000000)}`;
  const paymentMethod = paymentObj?.paymentMethod || 'Online';
  const paymentDate = paymentObj?.createdAt ? new Date(paymentObj.createdAt).toLocaleString() : new Date().toLocaleString();

  const handleDownloadPdf = () => {
    const element = document.getElementById('receipt-download');
    const opt = {
      margin:       10,
      filename:     `Booking_Receipt_${booking.id}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    html2pdf().from(element).set(opt).save();
  };

  return (
    <div style={{ padding: '40px 20px', backgroundColor: 'var(--bg-color)', minHeight: 'calc(100vh - 70px)' }}>
      
      {/* SUCCESS ANIMATION (No Print) */}
      <div className="no-print" style={{ textAlign: 'center', marginBottom: '30px' }}>
        <div style={{ 
          width: '80px', height: '80px', backgroundColor: '#2ed573', color: 'white', 
          fontSize: '3rem', borderRadius: '50%', display: 'flex', alignItems: 'center', 
          justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 4px 15px rgba(46, 213, 115, 0.4)' 
        }}>
          ✓
        </div>
        <h2 style={{ fontSize: '2.2rem', color: '#2f3542', fontWeight: '800' }}>Booking Created Successfully</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginTop: '10px' }}>Your booking is waiting for Tour Manager approval.</p>
      </div>

      {/* RECEIPT BLOCK */}
      <div className="receipt-card" id="receipt-download">
        
        <div className="receipt-header">
          <div>
            <h2 style={{ color: 'var(--primary-color)', fontSize: '2rem', fontWeight: '900', letterSpacing: '-1px' }}>GT Holidays</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Official Booking Receipt</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <h3 style={{ fontSize: '1.2rem' }}>{booking.bookingNumber || `Booking #${booking.id}`}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Invoice: {booking.invoiceNumber || 'N/A'}</p>
          </div>
        </div>

        <div className="receipt-grid">
          <div className="receipt-item">
            <span className="receipt-label">Customer Name</span>
            <span className="receipt-val">{booking.customerName}</span>
          </div>
          <div className="receipt-item">
            <span className="receipt-label">Destination</span>
            <span className="receipt-val">{booking.Package?.Destination?.name || 'N/A'}</span>
          </div>
          <div className="receipt-item">
            <span className="receipt-label">Package</span>
            <span className="receipt-val">{booking.packageName}</span>
          </div>
          <div className="receipt-item">
            <span className="receipt-label">Travel Date</span>
            <span className="receipt-val">{booking.travelDate}</span>
          </div>
          <div className="receipt-item">
            <span className="receipt-label">Number of Travellers</span>
            <span className="receipt-val">{booking.totalPersons}</span>
          </div>
          <div className="receipt-item">
            <span className="receipt-label">Booking Date</span>
            <span className="receipt-val">{new Date(booking.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        <div style={{ borderTop: '1px dashed var(--gray-light)', margin: '20px 0' }}></div>
        <h4 style={{ marginBottom: '15px', color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.9rem' }}>Payment Details</h4>

        <div className="receipt-grid" style={{ marginBottom: '0' }}>
          <div className="receipt-item">
            <span className="receipt-label">Total Amount</span>
            <span className="receipt-val" style={{ color: 'var(--primary-color)', fontWeight: '800' }}>
              ₹{booking.totalAmount.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="receipt-item">
            <span className="receipt-label">Payment Method</span>
            <span className="receipt-val">{paymentMethod}</span>
          </div>
          <div className="receipt-item">
            <span className="receipt-label">Transaction ID</span>
            <span className="receipt-val">{transactionId}</span>
          </div>
          <div className="receipt-item">
            <span className="receipt-label">Payment Status</span>
            <span className="receipt-val" style={{ color: '#2ed573' }}>Paid Successfully</span>
          </div>
          <div className="receipt-item">
            <span className="receipt-label">Booking Status</span>
            <span className="receipt-val" style={{ color: '#f39c12', fontWeight: 'bold' }}>
              {booking.bookingStatus === 'PENDING_APPROVAL' ? 'Pending Approval' : booking.bookingStatus}
            </span>
          </div>
        </div>

      </div>

      {/* ACTIONS (No Print) */}
      <div className="no-print" style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '40px' }}>
        <button className="btn-secondary" onClick={handleDownloadPdf} style={{ padding: '12px 25px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          Download Booking Receipt
        </button>
        <Link to="/my-trips" className="btn-primary" style={{ padding: '12px 25px', display: 'flex', alignItems: 'center' }}>
          View My Trips
        </Link>
        <Link to="/" className="btn-secondary" style={{ padding: '12px 25px', border: 'none', backgroundColor: '#f1f2f6', color: 'var(--text-dark)' }}>
          Go To Home
        </Link>
      </div>

    </div>
  );
};

export default PaymentSuccess;
