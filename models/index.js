'use strict';
const logger = require('winston');

// Waterline Configuration
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

// Load Models
const Article = require('./article');

/**
 * DB class acts as a wrapper around Waterline to make managing instances easier
 * throughout tests and application life span
 */
class DB {
    constructor() {
        logger.info('Created DB object');
        // Instantiate a new instance of the ORM
        this.orm = new require('waterline')();
    }

    teardown() {
        this.orm.teardown();
    }

    setupMiddleware(app) {
        logger.debug('Setting up DB');
        let _this = this;

        return new Promise((resolve, reject) => {
            // Load the Models into the ORM
            _this.orm.loadCollection(Article);
            _this.orm.initialize(config, function(err, models) {
                if (err) {
                    logger.debug(err);
                    reject(err);
                    return;
                }
                app.models = models.collections;
                app.connections = models.connections;

                logger.debug('Resolving waterline');
                resolve(app);
            });
        });
    }
}

module.exports = DB;
