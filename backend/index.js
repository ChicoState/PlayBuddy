require('dotenv').config();
const cookieParser = require('cookie-parser');
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const api = require('./api');
const database = require('./database');
const User = require('./database/models/user');
const cors = require('cors');
/* Application Variables */
const port = process.env.EXPRESS_PORT || 3001;

// The Express Server
const app = express();
app.use(cors());
// Application Middleware

/* Parses JSON formatted request bodies */
app.use(express.json());
/* Parses requests with url-encoded values */
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(cookieParser('appSecret'));
app.use(session());

/* Use Passport for Authentication */
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use('/api', api);

/* Event handler for failed reconnection to database */
database.on('reconnectFailed', () => {
  console.log('After retries, failed to reconnect to database. Gracefully closing Express server');
  app.close(() => console.log('Express server closed'));
});

/**
 * Only start the server the first time this event is emitted
 * Mongoose emits this signal every time the database connects,
 * even after successful reconnects
 */
database.once('connected', () => {
  console.log('Database connected, starting Express');
  // Starts the Express server
  app.listen(port, () => {
    console.log(`Express API server started on port ${port}`);
  });
});
