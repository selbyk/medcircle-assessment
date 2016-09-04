'use strict';
const logger = require('winston');
const createServer = require('./server');

process.env.PORT = process.env.PORT || 8080;
process.env.PROFILE = process.env.PROFILE || true;
process.env.NODE_ENV = process.env.NODE_ENV || 'debug';

logger.level = process.env.LOG_LEVEL || 'silly';

createServer().then((app) => {
  app.listen(process.env.PORT);
});
