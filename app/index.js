'use strict';
const logger = require('winston');
const express = require('express');
const bodyParser = require('body-parser');

const setupRoutes = require('../routes');
const DB = require('../models');

logger.level = process.env.LOG_LEVEL || 'silly';

class App {
    constructor() {
        this.app = express();
        this.db = new DB();
        this._server = null;

        // Setup Express Application
        this.app.use(bodyParser.urlencoded({
            extended: false
        }));
        this.app.use(bodyParser.json());
    }

    get server() {
        return this._server;
    }

    init() {
        this.app.use((req, res, next) => {
            req.tag = `${(new Date()).getTime()} ${req.method} ${req.path}`;
            logger.debug(req.tag);
            if (process.env.PROFILE) {
                logger.profile(req.tag);
            }
            next();
        });
        let self = this;
        return new Promise((resolve, reject) => {
            self.db.setupMiddleware(self.app)
                .then(setupRoutes)
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

    start() {
        return new Promise((resolve, reject) => {
            let self = this;
            this.init()
                .then((app) => {
                    self._server = app.listen(process.env.PORT, () => resolve());
                })
                .catch(err => reject(err));
        });
    }

    stop() {
        return new Promise((resolve, reject) => {
            let self = this;
            try {
                this._server.close(() => {
                    self.db.teardown();
                    resolve();
                });
            } catch (err) {
                reject(err);
            }
        });
    }
}

module.exports = App;
