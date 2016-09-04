'use strict';
const logger = require('winston');
const express = require('express');
const bodyParser = require('body-parser');
const setupRoutes = require('../routes');
const DB = require('../models');

logger.level = process.env.LOG_LEVEL || 'silly';

function createServer() {
    return new Promise((resolve, reject) => {
        let app = express();
        let db = new DB();

        // Setup Express Application
        app.use(bodyParser.urlencoded({
            extended: false
        }));
        app.use(bodyParser.json());

        app.use((req, res, next) => {
            req.tag = `${(new Date()).getTime()} ${req.method} ${req.path}`;
            logger.debug(req.tag);
            if (process.env.PROFILE) {
                logger.profile(req.tag);
            }
            next();
        });

        db.setupWaterline(app)
            .then(setupRoutes)
            .catch(err => logger.error(err))
            .then((app) => {
                app.use((req, res, next) => {
                    if (process.env.PROFILE) {
                        logger.profile(req.tag);
                    }
                    next();
                });
                logger.info(`Running in ${process.env.NODE_ENV}`);

                resolve(app);
            })
            .catch(err => reject(err));
    });
}

module.exports = createServer;
