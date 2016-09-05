'use strict';
const logger = require('winston');
const App = require('./app');

process.env.PORT = process.env.PORT || 8080;
process.env.PROFILE = process.env.PROFILE || true;
process.env.NODE_ENV = process.env.NODE_ENV || 'debug';

logger.level = process.env.LOG_LEVEL || 'silly';

const app = new App();

app.start().then(() => {
    logger.info(`Application listening at http://localhost:${process.env.PORT}`);
});
