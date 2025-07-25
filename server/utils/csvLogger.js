 
const fs = require('fs');
const path = require('path');
const logPath = path.resolve(process.env.CSV_LOG_PATH || './logs/sensor_data.csv');

const headers = 'timestamp,value,dutyCycle\n';

function ensureFileExists() {
  if (!fs.existsSync(logPath)) {
    fs.writeFileSync(logPath, headers);
  }
}

function logToCSV(data) {
  ensureFileExists();
  const timestamp = new Date().toISOString();
  const line = `${timestamp},${data.value},${data.dutyCycle}\n`;
  fs.appendFileSync(logPath, line);
}

module.exports = { logToCSV };
