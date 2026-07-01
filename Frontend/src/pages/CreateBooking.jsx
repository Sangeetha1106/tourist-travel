import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { createBooking } from '../api/bookingApi';
import { getPackageById } from '../api/packageApi';
import Loader from '../components/Loader';
import FileUpload from '../components/FileUpload';

const CreateBooking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { packageId } = useParams();
  
  const queryParams = new URLSearchParams(location.search);
  
  const [pkg, setPkg] = useState(null);
  const [formData, setFormData] = useState({
    packageId: packageId || '',
    customerName: '',
    email: '',
    phone: '',
    dob: '',
    gender: '',
    travelDate: queryParams.get('travelDate') || '',
    totalPersons: queryParams.get('totalPersons') ? parseInt(queryParams.get('totalPersons')) : 1, // Adults
    childrenCount: 0,
    address: '',
    city: '',
    state: '',
    pincode: '',
    emergencyContactName: '',
    emergencyContactNumber: '',
    hasBreakfast: queryParams.get('hasBreakfast') === 'true',
    hasLunch: queryParams.get('hasLunch') === 'true',
    hasDinner: queryParams.get('hasDinner') === 'true',
    passportNumber: '',
    passportExpiry: '',
  });

  const [idProofs, setIdProofs] = useState({
    front: { file: null, preview: null, uploadedPath: null, status: 'idle' },
    back: { file: null, preview: null, uploadedPath: null, status: 'idle' }
  });
  
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(!!packageId);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      setFormData(prev => ({
        ...prev,
        customerName: user.name || (user.firstName ? user.firstName + ' ' + (user.lastName || '') : ''),
        email: user.email || '',
        phone: user.phone || ''
      }));
    }
  }, []);

  useEffect(() => {
    if (packageId) {
      const fetchPackage = async () => {
        try {
          const res = await getPackageById(packageId);
          if (res.success) {
            setPkg(res.data);
          }
        } catch (err) {
          setError('Failed to load package details.');
        } finally {
          setPageLoading(false);
        }
      };
      fetchPackage();
    }
  }, [packageId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  const calculateTotal = () => {
    if (!pkg) return { base: 0, addOns: 0, gst: 0, total: 0, adults: 0, children: 0, pricePerPerson: 0, discount: 0 };
    
    let addOnsPerPerson = 0;
    if (formData.hasBreakfast) addOnsPerPerson += 1000;
    if (formData.hasLunch) addOnsPerPerson += 1500;
    if (formData.hasDinner) addOnsPerPerson += 2000;
    
    const adults = parseInt(formData.totalPersons) || 1;
    const children = parseInt(formData.childrenCount) || 0;
    const totalTravellers = adults + children; 
    
    const base = parseFloat(pkg.price) * totalTravellers;
    const addOns = addOnsPerPerson * totalTravellers;
    const subTotal = base + addOns;
    
    const gst = subTotal * 0.05; // 5% GST
    const discount = 0;
    
    const total = subTotal + gst - discount;
    
    return { base, addOns, subTotal, gst, discount, total, adults, children, pricePerPerson: parseFloat(pkg.price) };
  };

  const isInternational = pkg?.Destination?.category?.toLowerCase().includes('international') || pkg?.Destination?.name?.toLowerCase() === 'dubai' || pkg?.Destination?.name?.toLowerCase() === 'singapore';

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem('token');
    if (!token) {
      navigate(`/login?redirect=${encodeURIComponent(`/booking/${packageId}`)}`);
      return;
    }

    if (idProofs.front.status !== 'success' || idProofs.back.status !== 'success') {
      setError(`Please upload both front and back of your ${isInternational ? 'Passport' : 'Aadhaar Card'}.`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (isInternational && (!formData.passportNumber || !formData.passportExpiry)) {
      setError('Passport Number and Expiry Date are mandatory for International Tours.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setLoading(true);
    setError('');

    try {
      const finalData = {
        ...formData,
        idProofType: isInternational ? 'Passport' : 'Aadhaar',
        idProofFront: idProofs.front.uploadedPath,
        idProofBack: idProofs.back.uploadedPath
      };

      // Fix empty dates causing "Invalid date" DB error
      if (!finalData.passportExpiry) finalData.passportExpiry = null;
      if (!finalData.dob) finalData.dob = null;
      if (!finalData.travelDate) finalData.travelDate = null;

      const res = await createBooking(finalData);
      if (res.success) {
        setSuccess('Booking Created Successfully. Redirecting to payment...');
        setTimeout(() => {
          navigate(`/payment/${res.data.id}`);
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create booking.');
      setLoading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (pageLoading) return <Loader />;
  if (!pkg && packageId) return <div style={{ textAlign: 'center', padding: '50px' }}>Package not found.</div>;

  const costData = calculateTotal();

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', padding: '40px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#2d3436', marginBottom: '10px' }}>Complete Your Booking</h1>
          <p style={{ color: '#636e72', fontSize: '1.1rem' }}>Please fill in the details below to confirm your trip to {pkg?.Destination?.name}</p>
        </div>

        {error && <div style={{ background: '#ff7675', color: '#fff', padding: '15px 20px', borderRadius: '8px', marginBottom: '20px', fontWeight: 'bold' }}>{error}</div>}
        {success && <div style={{ background: '#55efc4', color: '#2d3436', padding: '15px 20px', borderRadius: '8px', marginBottom: '20px', fontWeight: 'bold' }}>{success}</div>}

        <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          
          {/* Left Column: Form */}
          <div style={{ flex: '1 1 700px' }}>
            <form 
              onSubmit={handleSubmit} 
              onInvalid={(e) => {
                e.preventDefault(); 
                const firstInvalid = document.querySelector(':invalid');
                if (firstInvalid) {
                  firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  firstInvalid.focus();
                }
              }}
              className="custom-form" 
              style={{ background: '#fff', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}
            >
              
              <h3 style={{ fontSize: '1.5rem', borderBottom: '2px solid #f1f2f6', paddingBottom: '15px', marginBottom: '25px', color: '#2d3436' }}>1. Primary Traveller Details</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                <div className="form-group"><label>Full Name *</label><input type="text" name="customerName" value={formData.customerName} onChange={handleChange} required /></div>
                <div className="form-group"><label>Email Address *</label><input type="email" name="email" value={formData.email} onChange={handleChange} required /></div>
                <div className="form-group"><label>Mobile Number *</label><input type="text" name="phone" value={formData.phone} onChange={handleChange} required /></div>
                <div className="form-group"><label>Date of Birth *</label><input type="date" name="dob" value={formData.dob} onChange={handleChange} required /></div>
                <div className="form-group">
                  <label>Gender *</label>
                  <select name="gender" value={formData.gender} onChange={handleChange} required style={{ width: '100%', padding: '12px 15px', border: '1px solid #dfe4ea', borderRadius: '8px', fontSize: '1rem' }}>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <h3 style={{ fontSize: '1.5rem', borderBottom: '2px solid #f1f2f6', paddingBottom: '15px', marginBottom: '25px', color: '#2d3436' }}>2. Travel Information</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                <div className="form-group"><label>Travel Date *</label><input type="date" name="travelDate" value={formData.travelDate} onChange={handleChange} required /></div>
                <div style={{ display: 'flex', gap: '15px' }}>
                  <div className="form-group" style={{ flex: 1 }}><label>Adults *</label><input type="number" min="1" name="totalPersons" value={formData.totalPersons} onChange={handleChange} required /></div>
                  <div className="form-group" style={{ flex: 1 }}><label>Children</label><input type="number" min="0" name="childrenCount" value={formData.childrenCount} onChange={handleChange} /></div>
                </div>
              </div>

              <h3 style={{ fontSize: '1.5rem', borderBottom: '2px solid #f1f2f6', paddingBottom: '15px', marginBottom: '25px', color: '#2d3436' }}>3. Contact & Address Details</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                <div className="form-group" style={{ gridColumn: 'span 2' }}><label>Address *</label><input type="text" name="address" value={formData.address} onChange={handleChange} required /></div>
                <div className="form-group"><label>City *</label><input type="text" name="city" value={formData.city} onChange={handleChange} required /></div>
                <div className="form-group"><label>State *</label><input type="text" name="state" value={formData.state} onChange={handleChange} required /></div>
                <div className="form-group"><label>Pincode *</label><input type="text" name="pincode" value={formData.pincode} onChange={handleChange} required /></div>
                <div style={{ gridColumn: 'span 2', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '10px' }}>
                  <div className="form-group"><label>Emergency Contact Name *</label><input type="text" name="emergencyContactName" value={formData.emergencyContactName} onChange={handleChange} required /></div>
                  <div className="form-group"><label>Emergency Contact Number *</label><input type="text" name="emergencyContactNumber" value={formData.emergencyContactNumber} onChange={handleChange} required /></div>
                </div>
              </div>

              <h3 style={{ fontSize: '1.5rem', borderBottom: '2px solid #f1f2f6', paddingBottom: '15px', marginBottom: '25px', color: '#2d3436' }}>4. Traveller Identity Verification</h3>
              <div style={{ background: '#f1f2f6', padding: '25px', borderRadius: '12px', marginBottom: '30px', border: '1px solid #dfe6e9' }}>
                <p style={{ color: '#d63031', fontSize: '1rem', marginBottom: '20px', fontWeight: 'bold' }}>
                  {isInternational ? '🛂 Passport Upload is mandatory for International Tours.' : '🆔 Aadhaar Upload is mandatory for India Tours.'}
                </p>

                {isInternational && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                    <div className="form-group"><label>Passport Number *</label><input type="text" name="passportNumber" value={formData.passportNumber} onChange={handleChange} required /></div>
                    <div className="form-group"><label>Passport Expiry Date *</label><input type="date" name="passportExpiry" value={formData.passportExpiry} onChange={handleChange} required /></div>
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <FileUpload 
                    label={isInternational ? 'Upload Passport (Front)' : 'Upload Aadhaar Card (Front)'} 
                    fileData={idProofs.front}
                    onUploadSuccess={(data) => setIdProofs(prev => ({ ...prev, front: data }))}
                    onRemove={() => setIdProofs(prev => ({ ...prev, front: { file: null, preview: null, uploadedPath: null, status: 'idle' } }))}
                  />
                  <FileUpload 
                    label={isInternational ? 'Upload Passport (Back)' : 'Upload Aadhaar Card (Back)'} 
                    fileData={idProofs.back}
                    onUploadSuccess={(data) => setIdProofs(prev => ({ ...prev, back: data }))}
                    onRemove={() => setIdProofs(prev => ({ ...prev, back: { file: null, preview: null, uploadedPath: null, status: 'idle' } }))}
                  />
                </div>
              </div>

              <h3 style={{ fontSize: '1.5rem', borderBottom: '2px solid #f1f2f6', paddingBottom: '15px', marginBottom: '25px', color: '#2d3436' }}>5. Optional Meal Add-ons</h3>
              <div style={{ display: 'flex', gap: '30px', marginBottom: '40px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontWeight: '600' }}>
                  <input type="checkbox" name="hasBreakfast" checked={formData.hasBreakfast} onChange={handleChange} style={{ transform: 'scale(1.2)' }} />
                  Breakfast (+₹1,000/head)
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontWeight: '600' }}>
                  <input type="checkbox" name="hasLunch" checked={formData.hasLunch} onChange={handleChange} style={{ transform: 'scale(1.2)' }} />
                  Lunch (+₹1,500/head)
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontWeight: '600' }}>
                  <input type="checkbox" name="hasDinner" checked={formData.hasDinner} onChange={handleChange} style={{ transform: 'scale(1.2)' }} />
                  Dinner (+₹2,000/head)
                </label>
              </div>

              <button type="submit" className="btn-primary gt-red" disabled={loading || !pkg} style={{ width: '100%', padding: '20px', fontSize: '1.3rem', borderRadius: '12px', boxShadow: '0 10px 20px rgba(255, 71, 87, 0.3)' }}>
                {loading ? 'Processing...' : (localStorage.getItem('token') ? 'Confirm Booking' : 'Login to Confirm Booking')}
              </button>
            </form>
          </div>

          {/* Right Column: Summary */}
          <div style={{ flex: '1 1 350px', position: 'sticky', top: '100px' }}>
            <div style={{ background: '#fff', padding: '30px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
              <h3 style={{ fontSize: '1.5rem', borderBottom: '2px solid #f1f2f6', paddingBottom: '15px', marginBottom: '20px', color: '#2d3436' }}>Booking Summary</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#636e72', fontWeight: '600' }}>Package Name</span>
                  <span style={{ color: '#2d3436', fontWeight: 'bold', textAlign: 'right', maxWidth: '200px' }}>{pkg?.packageName}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#636e72', fontWeight: '600' }}>Destination</span>
                  <span style={{ color: '#2d3436', fontWeight: 'bold' }}>{pkg?.Destination?.name}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#636e72', fontWeight: '600' }}>Travel Date</span>
                  <span style={{ color: '#2d3436', fontWeight: 'bold' }}>{formData.travelDate || 'Not Selected'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#636e72', fontWeight: '600' }}>Travellers</span>
                  <span style={{ color: '#2d3436', fontWeight: 'bold' }}>{costData.adults} Adults, {costData.children} Children</span>
                </div>
              </div>

              <div style={{ borderTop: '2px dashed #dfe6e9', paddingTop: '20px', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#636e72' }}>Price Per Person</span>
                  <span style={{ color: '#2d3436', fontWeight: 'bold' }}>₹{costData.pricePerPerson.toLocaleString('en-IN')}</span>
                </div>
                {costData.addOns > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#636e72' }}>Meals Add-on</span>
                    <span style={{ color: '#2d3436', fontWeight: 'bold' }}>₹{costData.addOns.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#636e72' }}>GST (5%)</span>
                  <span style={{ color: '#2d3436', fontWeight: 'bold' }}>₹{costData.gst.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#636e72' }}>Discount</span>
                  <span style={{ color: '#00b894', fontWeight: 'bold' }}>-₹{costData.discount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div style={{ background: '#fff9e6', padding: '20px', borderRadius: '12px', borderLeft: '4px solid #f39c12' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#d35400', fontWeight: '700', fontSize: '1.2rem' }}>Total Amount</span>
                  <span style={{ color: '#d35400', fontWeight: '900', fontSize: '1.6rem' }}>₹{costData.total.toLocaleString('en-IN')}</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBooking;
