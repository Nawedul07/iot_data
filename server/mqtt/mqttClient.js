// mqttClient.js

const mqtt = require('mqtt');
const { logToCSV } = require('../utils/csvLogger');
const { insertToMongo } = require('../db/mongoClient');

const brokerUrl = process.env.MQTT_BROKER_URL;
const topic = process.env.MQTT_TOPIC;

function connectMQTT(io) {
  const client = mqtt.connect(brokerUrl);

  client.on('connect', () => {
    console.log(`[MQTT] Connected to broker at ${brokerUrl}`);
    client.subscribe(topic, (err) => {
      if (err) {
        console.error(`[MQTT] Subscription error:`, err);
      } else {
        console.log(`[MQTT] Subscribed to topic: ${topic}`);
      }
    });
  });

  client.on('message', (topic, message) => {
    try {
      const payload = JSON.parse(message.toString());

      // Log to terminal
      // console.log(`[MQTT] Received:`, payload);

      // Broadcast to frontend via WebSocket
      io.emit('sensorData', payload); // <-- this line is new

      // Save to MongoDB
      insertToMongo(payload);

      // Save to CSV
      logToCSV(payload);

    } catch (err) {
      console.error('[ERROR] Invalid JSON payload:', message.toString());
    }
  });

  client.on('error', (err) => {
    console.error(`[MQTT] Connection error:`, err.message);
  });
}

module.exports = { connectMQTT };
