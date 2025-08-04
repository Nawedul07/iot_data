import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import './App.css';

const socket = io("https://80b080096182.ngrok-free.app", {     //backend url 
  transports: ["websocket", "polling"],
  secure: true,
  withCredentials: true
});

function App() {
  const [sensorData, setSensorData] = useState({
    value: 0,
    dutyCycle: 0,
    latitude: 0,
    longitude: 0,
    altitude: 0,
    speed: 0,
    satellites: 0,
  });

  useEffect(() => {
    socket.on('sensorData', (data) => {
      setSensorData(data);
    });

    return () => {
      socket.off('sensorData');
    };
  }, []);

  return (
    <div className="container">
      <h2> TAKACHAR Telemetry Dashboard</h2>
      <div className="grid">
        <div className="card">
          <div className="label"> Value</div>
          <div className="value">{sensorData.value}</div>
        </div>
        <div className="card">
          <div className="label"> Duty Cycle</div>
          <div className="value">{sensorData.dutyCycle}</div>
        </div>
        <div className="card">
          <div className="label"> Latitude</div>
          <div className="value">{sensorData.latitude.toFixed(6)}</div>
        </div>
        <div className="card">
          <div className="label"> Longitude</div>
          <div className="value">{sensorData.longitude.toFixed(6)}</div>
        </div>
        <div className="card">
          <div className="label"> Altitude</div>
          <div className="value">{sensorData.altitude.toFixed(2)} m</div>
        </div>
        <div className="card">
          <div className="label"> Speed</div>
          <div className="value">{sensorData.speed.toFixed(2)} km/hr</div>
        </div>
        <div className="card">
          <div className="label"> Satellites</div>
          <div className="value">{sensorData.satellites}</div>
        </div>
      </div>
    </div>
  );
}

export default App;