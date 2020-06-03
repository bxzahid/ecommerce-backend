const nodemailer = require('nodemailer');
const { MAIL_HOST, MAIL_PORT, MAIL_USER, MAIL_PASS, NODE_ENV } = require('../config/config');

const transporter = nodemailer.createTransport({
  host: MAIL_HOST,
  port: MAIL_PORT,
  secure: NODE_ENV === 'production',
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASS,
  },
});

module.exports = transporter;
