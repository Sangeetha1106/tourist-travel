import { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import Loader from '../../components/Loader';

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/vehicles');
      if (res.data.success) {
        setVehicles(res.data.data);
      }
    } catch (err) {
      setError('Failed to fetch vehicles');
    } finally {
      setLoading(false);
    }
  };

  const filteredVehicles = vehicles.filter(v => 
    v.vehicleName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    v.vehicleNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Loader />;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="page-container">
      <div className="page-header" style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>Vehicles</h2>
          <p>Manage all vehicles</p>
        </div>
        <input 
          type="text" 
          placeholder="Search by name or number..." 
          className="form-control" 
          style={{ width: '300px' }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div style={{ background: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
        <div className="table-responsive">
          <table className="custom-table" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th>Vehicle Number</th>
                <th>Vehicle Name</th>
                <th>Driver</th>
                <th>Capacity</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVehicles.length > 0 ? filteredVehicles.map(v => (
                <tr key={v.vehicleId}>
                  <td><strong>{v.vehicleNumber}</strong></td>
                  <td>{v.vehicleName}</td>
                  <td>
                    <div>{v.driverName}</div>
                    <div style={{ fontSize: '0.8rem', color: '#7f8c8d' }}>{v.driverPhone}</div>
                  </td>
                  <td>{v.capacity} Seats</td>
                  <td>
                    <span className={`badge ${v.status === 'AVAILABLE' ? 'badge-success' : 'badge-warning'}`}>
                      {v.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <button className="btn-secondary" style={{ padding: '4px 8px', fontSize: '0.8rem' }} onClick={() => alert('View Vehicle: ' + v.vehicleId)}>View</button>
                      <button className="btn-primary" style={{ padding: '4px 8px', fontSize: '0.8rem' }} onClick={() => alert('Edit Vehicle: ' + v.vehicleId)}>Edit</button>
                      <button className="btn-danger" style={{ padding: '4px 8px', fontSize: '0.8rem' }} onClick={() => alert('Delete Vehicle: ' + v.vehicleId)}>Delete</button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>No vehicles available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Vehicles;
