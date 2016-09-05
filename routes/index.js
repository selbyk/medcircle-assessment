'use strict';
const logger = require('winston');
const express = require('express');

/**
 * Sets up application routes
 *
 * @param  {Express}   app
 * @return  {Promise}  Express | Error
 */
 function setupRoutes(app) {
     logger.debug('Setting up routes');
     return new Promise((resolve, reject) => {
         try {
             app.use('/', express.static('./docs/html'));
             app.get('/', (req, res, next) => {
                 res.send('Hello, World! \\o/');
                 next();
             });
             logger.debug('Setting up article routes');
             require('./articles')(app);
             resolve(app);
         } catch (err) {
             reject(err);
         }
     });
 }

module.exports = setupRoutes;
