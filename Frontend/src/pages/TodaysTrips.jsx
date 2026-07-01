const TodaysTrips = () => {
  // Mock data for Today's Trips
  const trips = [
    { id: 1, package: 'Ooty Local Sightseeing', time: '09:00 AM', pickup: 'Ooty Central Bus Stand', group: 'Sharma Family (4)' }
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Today's Trips</h2>
        <p>Your active itineraries for today.</p>
      </div>

      <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {trips.length > 0 ? trips.map(trip => (
          <div key={trip.id} style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', borderLeft: '4px solid #e74c3c' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ margin: '0 0 10px 0' }}>{trip.package}</h3>
                <p style={{ margin: '0 0 5px 0', color: '#7f8c8d' }}><strong>Time:</strong> {trip.time}</p>
                <p style={{ margin: '0 0 5px 0', color: '#7f8c8d' }}><strong>Pickup:</strong> {trip.pickup}</p>
                <p style={{ margin: '0 0 5px 0', color: '#7f8c8d' }}><strong>Group:</strong> {trip.group}</p>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="btn-primary" style={{ background: '#27ae60' }}>Mark Attendance</button>
                <button className="btn-primary">View Itinerary</button>
              </div>
            </div>
          </div>
        )) : (
          <p>No trips scheduled for today. Enjoy your day off!</p>
        )}
      </div>
    </div>
  );
};

export default TodaysTrips;
