const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const { NODE_ENV } = require('./config/config');

const PORT = parseInt(process.env.PORT, 10) || 5000;
const dev = NODE_ENV !== 'production';

if (dev) {
  // eslint-disable-next-line
  require('dotenv').config();
}

const app = express();

// Database Connection
require('./config/db');
// FIXME:Have add middleware array
// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(cookieParser());

// parse application/x-www-form-urlencoded
app.use(
  express.urlencoded({
    extended: false,
  })
);

// parse application/json
app.use(express.json());

// Add user with request
app.use(require('./middlewares/addUser'));

// ==================================================================================
//= ==================================API routes======================================
//= ==================================================================================
app.use('/api/admin', require('./routes/adminRoute'));

// Authentication goes here
app.use('/api/auth', require('./routes/authRoute'));
// Profile goes here
app.use('/api/profile', require('./routes/profileRoute'));
// Profile goes here
app.use('/api/role', require('./routes/roleRoute'));
// Customer goes here
app.use('/api/customer', require('./routes/customerRoute'));
// Category goes here
app.use('/api/category', require('./routes/categoryRoute'));

// =========================
//  Error handler middleware
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const { message, status, error, stack } = err;

  // eslint-disable-next-line no-console
  console.log(stack);

  if (!status && NODE_ENV === 'production') {
    return res.status(500).json({
      message: 'Internal Server Error',
    });
  }

  return res.status(status || 500).json({ message, error });
});

app.listen(PORT, err => {
  if (err) throw err;
  // eslint-disable-next-line no-console
  console.log(`Server is Running on http://localhost:${PORT}`);
});
