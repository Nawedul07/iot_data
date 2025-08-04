const mqtt = require('mqtt'); // MQTT client library
const { logToCSV } = require('../utils/csvLogger'); // Utility to log selected data to CSV
const { insertToMongo } = require('../db/mongoClient'); // MongoDB insertion function

// Load broker URL and topic from environment variables
const brokerUrl = process.env.MQTT_BROKER_URL;
const topic = process.env.MQTT_TOPIC;

/**
 * Connects to the MQTT broker and sets up message handling.
 * @param {Server} io - Socket.IO server instance used to emit data to the frontend
 */
function connectMQTT(io) {
  // Initialize MQTT client connection
  const client = mqtt.connect(brokerUrl);

  // Handle successful connection to the broker
  client.on('connect', () => {
    console.log(`[MQTT] Connected to broker at ${brokerUrl}`);

    // Subscribe to the specified MQTT topic
    client.subscribe(topic, (err) => {
      if (err) {
        console.error('[MQTT] Subscription error:', err);
      } else {
        console.log(`[MQTT] Subscribed to topic: ${topic}`);
      }
    });
  });

  // Handle incoming MQTT messages
  client.on('message', (topic, message) => {
    try {
      // Parse the incoming JSON payload
      const payload = JSON.parse(message.toString());

      // Emit the full payload (including GPS data) to the frontend via WebSocket
      io.emit('sensorData', payload);

      // Destructure only the fields that need to be stored
      const { value, dutyCycle } = payload;

      // Persist the selected fields to MongoDB
      insertToMongo({ value, dutyCycle });

      // Log the selected fields to CSV file
      logToCSV({ value, dutyCycle });

    } catch (err) {
      // Handle JSON parsing errors gracefully
      console.error('[ERROR] Invalid JSON payload:', message.toString());
    }
  });

  // Handle errors with the MQTT client connection
  client.on('error', (err) => {
    console.error('[MQTT] Connection error:', err.message);
  });
}

module.exports = { connectMQTT };