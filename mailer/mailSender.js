const { NO_REPLY_EMAIL } = require('../config/config');
const transporter = require('./transporter');

module.exports = async ({ from = NO_REPLY_EMAIL, email, subject, template }) => {
  await transporter.sendMail({
    from,
    to: email,
    subject,
    html: template,
  });
};
