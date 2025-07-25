require('dotenv').config();
const { connectMQTT } = require('./mqtt/mqttClient');

const PORT = process.env.PORT || 5000;

console.log(`[INFO] Starting Telemetry Server on port ${PORT}...`);

// Start MQTT Client
connectMQTT();
