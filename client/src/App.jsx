import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./App.css";

// const socket = io("http://localhost:5000"); // backend URL
// const socket = io("https://7bdff60612ce.ngrok-free.app"); // backend URL

const socket = io("https://e550c8e17376.ngrok-free.app", {
  transports: ["websocket", "polling"],
  secure: true,
  withCredentials: true
});

function App() {
  const [sensorData, setSensorData] = useState(null);

  useEffect(() => {
    socket.on("sensorData", (data) => {
      setSensorData(data);
    });

    return () => socket.off("sensorData");
  }, []);

  return (
    <div className="container">
      <h1>TAKACHAR</h1>
      {sensorData ? (
        <div className="data-box">
          <p><strong>BLOWER SPEED :</strong> {sensorData.value}</p>
          <p><strong>Duty Cycle:</strong> {sensorData.dutyCycle}</p>
        </div>
      ) : (
        <p className="loading">Waiting for data...</p>
      )}
    </div>
  );
}

export default App;
