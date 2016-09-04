'use strict';
const logger = require('winston');
const setupArticleRoutes = require('./articles');

module.exports = function setupRoutes(app) {
    logger.debug('Setting up routes');
    return new Promise((resolve, reject) => {
        try {
            app.use('/', express.static('./docs/html'));
            app.get('/', (req, res, next) => {
                res.send('Hello, World! \\o/');
                next();
            });
            logger.debug('Setting up article routes');
            setupArticleRoutes(app);
            resolve(app);
        } catch (err) {
            reject(err);
        }
    });
};
