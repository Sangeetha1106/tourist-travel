import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBookingById } from '../api/bookingApi';
import { createPayment } from '../api/paymentApi';
import Loader from '../components/Loader';

const Payment = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // States for verification animation
  const [processing, setProcessing] = useState(false);
  
  const [error, setError] = useState('');
  
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [formData, setFormData] = useState({
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
    bank: ''
  });

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await getBookingById(bookingId);
        if (res.success) {
          if (res.data.bookingStatus !== 'PENDING') {
            navigate('/my-trips');
            return;
          }
          setBooking(res.data);
        }
      } catch (err) {
        setError('Failed to fetch booking details.');
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [bookingId, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePayment = async () => {
    setProcessing(true);
    setError('');
    
    // Simulate 3 second verification animation
    setTimeout(async () => {
      try {
        const res = await createPayment({
          bookingId: booking.id,
          amount: booking.totalAmount,
          paymentMethod
        });
        if (res.success) {
          navigate(`/payment/success?bookingId=${booking.id}`);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Payment processing failed.');
        setProcessing(false);
      }
    }, 3000);
  };

  if (loading) return <Loader />;
  if (!booking) return <div style={{ textAlign: 'center', padding: '50px' }}>Booking not found.</div>;

  return (
    <div className="payment-layout">
      {processing && (
        <div className="verifying-overlay">
          <div className="spinner"></div>
          <h2>Verifying Payment...</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '10px' }}>Please do not close this window</p>
        </div>
      )}

      {/* LEFT: Booking Summary */}
      <div className="payment-left">
        <h3 style={{ marginBottom: '20px', borderBottom: '2px solid var(--gray-light)', paddingBottom: '15px' }}>
          Booking Summary
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Package Name</span>
            <div style={{ fontSize: '1.1rem', fontWeight: '600' }}>{booking.packageName}</div>
          </div>
          
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Customer Name</span>
            <div style={{ fontSize: '1.1rem', fontWeight: '600' }}>{booking.customerName}</div>
          </div>

          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Travel Date</span>
            <div style={{ fontSize: '1.1rem', fontWeight: '600' }}>{booking.travelDate}</div>
          </div>
          
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Number of Travellers</span>
            <div style={{ fontSize: '1.1rem', fontWeight: '600' }}>{booking.totalPersons} Person(s)</div>
          </div>
        </div>

        <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '2px solid var(--gray-light)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: '700' }}>Total Amount</span>
            <span style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary-color)' }}>
              ₹{booking.totalAmount.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      {/* RIGHT: Payment Methods */}
      <div className="payment-right">
        <h3 style={{ marginBottom: '20px' }}>Select Payment Method</h3>
        
        {error && <div className="error-message" style={{ marginBottom: '20px' }}>{error}</div>}

        <div className="payment-methods">
          {['UPI', 'Credit Card', 'Debit Card', 'Net Banking'].map((method) => (
            <div 
              key={method}
              className={`method-card ${paymentMethod === method ? 'active' : ''}`}
              onClick={() => setPaymentMethod(method)}
            >
              {method}
            </div>
          ))}
        </div>

        {/* Dynamic Payment Content */}
        <div className="payment-content" style={{ minHeight: '300px' }}>
          
          {paymentMethod === 'UPI' && (
            <div className="qr-container">
              <img src="/upi-qr.png" alt="UPI QR" className="qr-image" />
              <h4 style={{ color: 'var(--text-dark)', marginBottom: '5px' }}>Scan & Pay using any UPI App</h4>
              <p className="supported-apps">Google Pay • PhonePe • Paytm • BHIM • Amazon Pay</p>
            </div>
          )}

          {(paymentMethod === 'Credit Card' || paymentMethod === 'Debit Card') && (
            <div className="custom-form">
              <div className="form-group">
                <label>Card Holder Name</label>
                <input type="text" name="cardName" value={formData.cardName} onChange={handleChange} placeholder="John Doe" />
              </div>
              <div className="form-group">
                <label>Card Number</label>
                <input type="text" name="cardNumber" maxLength="16" value={formData.cardNumber} onChange={handleChange} placeholder="xxxx-xxxx-xxxx-xxxx" />
              </div>
              <div style={{ display: 'flex', gap: '15px' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Expiry (MM/YY)</label>
                  <input type="text" name="expiry" placeholder="MM/YY" value={formData.expiry} onChange={handleChange} />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>CVV</label>
                  <input type="password" name="cvv" maxLength="4" value={formData.cvv} onChange={handleChange} placeholder="***" />
                </div>
              </div>
            </div>
          )}

          {paymentMethod === 'Net Banking' && (
            <div className="custom-form">
              <div className="form-group">
                <label>Select Bank</label>
                <select name="bank" value={formData.bank} onChange={handleChange}>
                  <option value="">Choose your bank</option>
                  <option value="sbi">State Bank of India</option>
                  <option value="hdfc">HDFC Bank</option>
                  <option value="icici">ICICI Bank</option>
                  <option value="axis">Axis Bank</option>
                </select>
              </div>
            </div>
          )}

        </div>

        <button 
          className="btn-primary" 
          onClick={handlePayment}
          disabled={processing} 
          style={{ width: '100%', padding: '15px', fontSize: '1.1rem', marginTop: '10px' }}
        >
          {paymentMethod === 'UPI' ? 'I Have Paid' : `Pay ₹${booking.totalAmount.toLocaleString('en-IN')}`}
        </button>

      </div>
    </div>
  );
};

export default Payment;
