'use strict';
const _ = require('lodash');
const logger = require('winston');
//const Waterline = require('waterline');

// Instantiate a new instance of the ORM
//const orm = new Waterline();

// Build A Config Object
let config = {
    // Setup Adapters
    // Creates named adapters that have been required
    adapters: {
        'default': require('sails-memory')
    },
    // Build Connections Config
    // Setup connections using the named adapter configs
    connections: {
        memDb: {
            adapter: 'default'
        }
    },
    defaults: {
        migrate: 'alter'
    }
};

// Load models
const Article = require('./article');

// Cache model info because Waterline is a Singleton
// that can only be initialized once per app instance
let modelsCache;

/**
 * ORM
 */
class DB {
    constructor() {
        logger.info('Created DB object');
        this.orm = new require('waterline')();
    }

    setupWaterline(app) {
        logger.debug('Setting up DB');
        let _this = this;

        return new Promise((resolve, reject) => {
            //if (modelsCache) {
            //    logger.debug('zomg');
            //    app.models = modelsCache.collections;
            //    app.connections = modelsCache.connections;
            //    resolve(app);
            //} else {
            // Load the Models into the ORM
            _this.orm.loadCollection(Article);
            _this.orm.initialize(config, function(err, models) {
                if (err) {
                    if (err.name === 'AdapterError') {
                        _this.orm.teardown();
                        resolve(_this.setupWaterline(app));
                        //resolve(app);
                    } else {
                        logger.debug(err);
                        reject(err);
                    }
                    return;
                }
                modelsCache = models;
                app.models = models.collections;
                app.connections = models.connections;

                // Start Server
                logger.debug('Resolving waterline');
                resolve(app);
            });
            //}
        });
    }
}

module.exports = DB;
