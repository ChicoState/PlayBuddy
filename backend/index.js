const express = require('express');
const api = require('./api');

/* Application Variables */
const port = process.env.EXPRESS_PORT || 3001;

// The Express Server
const app = express();

// Application Middleware

/* Parses JSON formated request bodies */
app.use(express.json());
/* Parses requests with url-encoded values */
app.use(express.urlencoded());

app.use('/api', api);

// Starts the Express server
app.listen(port, () => {
  console.log(`Express API server started on port ${port}`);
});
