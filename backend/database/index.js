const mongoose = require('mongoose');

const mongoDatabaseName = process.env.MONGO_DATABASE_NAME || 'playbuddy';
const mongoHostName = process.env.MONGO_HOST_NAME || 'localhost';
const mongoURL = `mongodb://${mongoHostName}/${mongoDatabaseName}`;

// Connect to the MongoDB server
mongoose.connect(mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).catch((error) => {
  console.log(`Error connecting to database: ${error}`);
});

const database = mongoose.connection;

/* Database Event Handlers */
database.on('connecting', () => console.log('Initiating connection to database'));
database.on('disconnecting', () => console.log('Disconnecting from the database'));
database.on('disconnected', () => console.log('Disconnected from the database'));
database.on('reconnected', () => console.log('Connection to database successfully reestablished'));

module.exports = database;
