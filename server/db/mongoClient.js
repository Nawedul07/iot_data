require('dotenv').config();
const { MongoClient } = require('mongodb');

const mongoURI = process.env.MONGO_URI;
const dbName = process.env.MONGO_DB_NAME;
const collectionName = process.env.MONGO_COLLECTION_NAME;

const client = new MongoClient(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let db, collection;

async function initMongo() {
  try {
    await client.connect();
    db = client.db(dbName);
    collection = db.collection(collectionName);
    console.log(`[MongoDB] Connected to database: ${dbName}, collection: ${collectionName}`);
  } catch (err) {
    console.error('[MongoDB] Connection error:', err.message);
  }
}

initMongo();

function insertToMongo(data) {
  if (!collection) {
    console.warn('[MongoDB] Collection not ready, skipping insert.');
    return;
  }

const { value, dutyCycle, generatedAt } = data;

  collection.insertOne({
    value,
    dutyCycle,
    generatedAt: new Date(generatedAt),  // ESP32's original timestamp
    receivedAt: new Date(),              // optional: when it reached server
  });

}

module.exports = { insertToMongo };