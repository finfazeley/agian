const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const cookies = require('cookie-parser');

const routes = require('./routes/routes');
const googlePassport = require('./config/google_passport');
const passport = require('passport');

const app = express();

app.use(cors());
app.use(cookies());

// Session setup
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

/**
 * Serve static files in public directory
 */
app.use(express.static(path.join(__dirname, 'public/styles')));
app.use(express.urlencoded({ extended:false }));

// To parse JSON data
app.use(express.json());


app.use('/', routes);


/**
 * Set template engine to ejs
 */
app.set('view engine', 'ejs');

// Connect to MongoDB
mongoose.connect('mongodb://0.0.0.0:27017/TradeCarsDB', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// app.get('/protected', verifyToken, (req, res) => {
//   res.send('This is a protected route!');
// });

//app.use((req, res) => { res.send("Page Not Found")});

// app.listen(5001, () => {
//   console.log("Heard on 5001");
// }).on('error', (err) => {
//   // check if the error thrown is an address in use error
//   if (err.errno === 'EADDRINUSE') {
//     console.log("Port 5001 is already in use");
//   } else {
//     console.log(err);
//   }
// });

exports.app = onRequest(app);