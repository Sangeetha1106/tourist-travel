import React from 'react';

const TripTimeline = ({ status, progressLogs }) => {
  
  const getStatusColor = (s) => {
    if (s === 'COMPLETED') return '#2ecc71';
    if (s === 'TRIP_IN_PROGRESS' || s === 'TRIP_STARTED') return '#3498db';
    if (s === 'GUIDE_ASSIGNED') return '#f39c12';
    return '#bdc3c7';
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <h3 style={{ borderBottom: '2px solid #f1f2f6', paddingBottom: '10px' }}>Trip Timeline</h3>
      
      <div style={{ position: 'relative', margin: '20px 0', paddingLeft: '20px', borderLeft: `3px solid ${getStatusColor(status)}` }}>
        
        {/* Initial Status */}
        <div style={{ position: 'relative', marginBottom: '20px' }}>
          <div style={{ position: 'absolute', left: '-28px', top: '2px', width: '12px', height: '12px', borderRadius: '50%', background: '#3498db' }}></div>
          <div style={{ fontWeight: 'bold' }}>Trip Authorized</div>
          <div style={{ fontSize: '0.85rem', color: '#7f8c8d' }}>Guide has been assigned. Ready to start.</div>
        </div>

        {/* Logs */}
        {progressLogs && progressLogs.length > 0 ? (
          progressLogs.map((log, index) => (
            <div key={index} style={{ position: 'relative', marginBottom: '20px' }}>
              <div style={{ position: 'absolute', left: '-28px', top: '2px', width: '12px', height: '12px', borderRadius: '50%', background: log.day === 'Final' ? '#2ecc71' : '#f39c12' }}></div>
              <div style={{ fontWeight: 'bold' }}>
                {log.day === 0 ? 'Trip Started' : log.day === 'Final' ? 'Trip Completed' : `Day ${log.day} Completed: ${log.place}`}
              </div>
              {log.arrivalTime && <div style={{ fontSize: '0.85rem', color: '#7f8c8d' }}>Time: {log.arrivalTime} - {log.departureTime}</div>}
              <div style={{ fontSize: '0.85rem', color: '#34495e', marginTop: '5px' }}>{log.remarks}</div>
              <div style={{ fontSize: '0.75rem', color: '#95a5a6', marginTop: '2px' }}>Logged on: {new Date(log.time).toLocaleString()}</div>
            </div>
          ))
        ) : (
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: '-28px', top: '2px', width: '12px', height: '12px', borderRadius: '50%', background: '#bdc3c7' }}></div>
            <div style={{ fontWeight: 'bold', color: '#7f8c8d' }}>Awaiting Start</div>
          </div>
        )}

      </div>
    </div>
  );
};

export default TripTimeline;
