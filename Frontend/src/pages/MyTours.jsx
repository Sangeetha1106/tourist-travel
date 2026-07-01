const MyTours = () => {
  // Mock data for My Tours
  const tours = [
    { id: 1, package: 'Ooty Family Package', date: '01/12/2026', status: 'Scheduled', travellers: 2 },
    { id: 2, package: 'Goa Weekend Getaway', date: '15/12/2026', status: 'Confirmed', travellers: 4 },
    { id: 3, package: 'Kerala Honeymoon Special', date: '05/01/2027', status: 'Pending', travellers: 2 }
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>My Tours</h2>
        <p>A complete list of all tours assigned to you.</p>
      </div>

      <div className="table-responsive" style={{ marginTop: '20px', background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8f9fa', textAlign: 'left' }}>
              <th style={{ padding: '12px' }}>ID</th>
              <th style={{ padding: '12px' }}>Package Name</th>
              <th style={{ padding: '12px' }}>Date</th>
              <th style={{ padding: '12px' }}>Travellers</th>
              <th style={{ padding: '12px' }}>Status</th>
              <th style={{ padding: '12px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tours.map(tour => (
              <tr key={tour.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '12px' }}>#{tour.id}</td>
                <td style={{ padding: '12px', fontWeight: 'bold' }}>{tour.package}</td>
                <td style={{ padding: '12px' }}>{tour.date}</td>
                <td style={{ padding: '12px' }}>{tour.travellers}</td>
                <td style={{ padding: '12px' }}>
                  <span style={{ 
                    padding: '4px 8px', 
                    borderRadius: '4px', 
                    fontSize: '0.85em',
                    background: tour.status === 'Scheduled' ? '#e3f2fd' : (tour.status === 'Confirmed' ? '#e8f5e9' : '#fff3e0'),
                    color: tour.status === 'Scheduled' ? '#1565c0' : (tour.status === 'Confirmed' ? '#2e7d32' : '#f57c00')
                  }}>
                    {tour.status}
                  </span>
                </td>
                <td style={{ padding: '12px' }}>
                  <button className="btn-primary" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>View Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyTours;
