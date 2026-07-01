const Travellers = () => {
  // Mock data for Travellers
  const travellers = [
    { id: 1, name: 'Rahul Sharma', phone: '+91 9876543210', email: 'rahul@example.com', package: 'Ooty Family Package', status: 'Checked In' },
    { id: 2, name: 'Priya Patel', phone: '+91 8765432109', email: 'priya@example.com', package: 'Goa Weekend Getaway', status: 'Pending' },
    { id: 3, name: 'Amit Kumar', phone: '+91 7654321098', email: 'amit@example.com', package: 'Ooty Family Package', status: 'Checked In' }
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Travellers List</h2>
        <p>Contact and status details for the travellers on your tours.</p>
      </div>

      <div className="table-responsive" style={{ marginTop: '20px', background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8f9fa', textAlign: 'left' }}>
              <th style={{ padding: '12px' }}>Name</th>
              <th style={{ padding: '12px' }}>Contact</th>
              <th style={{ padding: '12px' }}>Assigned Package</th>
              <th style={{ padding: '12px' }}>Status</th>
              <th style={{ padding: '12px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {travellers.map(person => (
              <tr key={person.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '12px', fontWeight: 'bold' }}>{person.name}</td>
                <td style={{ padding: '12px' }}>
                  <div>{person.phone}</div>
                  <div style={{ fontSize: '0.85em', color: '#7f8c8d' }}>{person.email}</div>
                </td>
                <td style={{ padding: '12px' }}>{person.package}</td>
                <td style={{ padding: '12px' }}>
                  <span style={{ 
                    padding: '4px 8px', 
                    borderRadius: '4px', 
                    fontSize: '0.85em',
                    background: person.status === 'Checked In' ? '#e8f5e9' : '#fff3e0',
                    color: person.status === 'Checked In' ? '#2e7d32' : '#f57c00'
                  }}>
                    {person.status}
                  </span>
                </td>
                <td style={{ padding: '12px' }}>
                  <button className="btn-primary" style={{ padding: '6px 12px', fontSize: '0.85rem', marginRight: '5px' }}>Call</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Travellers;
