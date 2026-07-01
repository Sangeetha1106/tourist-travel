import { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import Loader from '../../components/Loader';

const Guides = () => {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchGuides();
  }, []);

  const fetchGuides = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/guides');
      if (res.data.success) {
        setGuides(res.data.data);
      }
    } catch (err) {
      setError('Failed to fetch guides');
    } finally {
      setLoading(false);
    }
  };

  const filteredGuides = guides.filter(g => 
    g.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    g.languages?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Loader />;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="page-container">
      <div className="page-header" style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>Tour Guides</h2>
          <p>Manage all tour guides</p>
        </div>
        <input 
          type="text" 
          placeholder="Search by name or language..." 
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
                <th>Guide ID</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Experience</th>
                <th>Languages</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredGuides.length > 0 ? filteredGuides.map(g => (
                <tr key={g.guideId}>
                  <td>{g.guideId}</td>
                  <td>
                    <div style={{ fontWeight: 'bold' }}>{g.fullName}</div>
                    <div style={{ fontSize: '0.8rem', color: '#7f8c8d' }}>{g.email}</div>
                  </td>
                  <td>{g.phone}</td>
                  <td>{g.experience} yrs</td>
                  <td>{g.languages}</td>
                  <td>
                    <span className={`badge ${g.status === 'AVAILABLE' ? 'badge-success' : 'badge-warning'}`}>
                      {g.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <button className="btn-secondary" style={{ padding: '4px 8px', fontSize: '0.8rem' }} onClick={() => alert('View Guide: ' + g.guideId)}>View</button>
                      <button className="btn-primary" style={{ padding: '4px 8px', fontSize: '0.8rem' }} onClick={() => alert('Edit Guide: ' + g.guideId)}>Edit</button>
                      <button className="btn-danger" style={{ padding: '4px 8px', fontSize: '0.8rem' }} onClick={() => alert('Delete Guide: ' + g.guideId)}>Delete</button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>No guides available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Guides;
