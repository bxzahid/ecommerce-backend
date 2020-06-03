const mongoose = require('mongoose');

// config used by server side only
const dbHost = process.env.DB_HOST || '127.0.0.1';
const dbPort = process.env.DB_PORT || 27017;
const dbName = process.env.DB_NAME || 'shop';
const dbUser = process.env.DB_USER || '';
const dbPass = process.env.DB_PASS || '';
const dbCred = dbUser.length > 0 || dbPass.length > 0 ? `${dbUser}:${dbPass}@` : '';

const dbUrl = process.env.DB_URL || `mongodb://${dbCred}${dbHost}:${dbPort}/${dbName}`;

const options = {
  useNewUrlParser: true,
};

mongoose.connect(dbUrl, options);
mongoose.set('useFindAndModify', false);

const db = mongoose.connection;

// eslint-disable-next-line no-console
db.on('error', console.error.bind(console, 'Connection Error'));
// eslint-disable-next-line no-console
db.once('open', () => console.log('Database is connected...'));
