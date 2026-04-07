// frontend/src/App.jsx
import { useEffect, useState } from 'react';
import { socket } from './services/socket';

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [socketId, setSocketId] = useState('');
  const [apiStatus, setApiStatus] = useState('');

  useEffect(() => {
    // 1. Call connect in useEffect
    socket.connect();

    // 2. Define event listener callbacks
    const onConnect = () => {
      console.log('Connected to server with ID:', socket.id);
      setIsConnected(true);
      setSocketId(socket.id);
    };

    const onDisconnect = () => {
      console.log('Disconnected from server');
      setIsConnected(false);
      setSocketId('');
    };

    const onConnectError = (error) => {
      console.error('Connection Error:', error.message);
    };

    // 3. Attach listeners
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('connect_error', onConnectError);

    // Test REST API
    fetch('http://localhost:3000/api/health')
      .then(res => res.json())
      .then(data => setApiStatus(data.status))
      .catch(err => setApiStatus('API failed'));

    // 4. Implement proper cleanup
    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('connect_error', onConnectError);
      socket.disconnect(); // Avoids memory leaks and duplicate connections
    };
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Creator Platform Dashboard</h1>
      <div style={{ border: '1px solid #ccc', padding: '10px', marginTop: '10px' }}>
        <h3>Socket.io Status</h3>
        <p>Status: {isConnected ? '🟢 Connected' : '🔴 Disconnected'}</p>
        <p>Socket ID: {socketId || 'N/A'}</p>
      </div>
      <div style={{ border: '1px solid #ccc', padding: '10px', marginTop: '10px' }}>
        <h3>REST API Status</h3>
        <p>{apiStatus}</p>
      </div>
    </div>
  );
}

export default App;