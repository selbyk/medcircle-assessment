'use strict';
const logger = require('winston');

// Waterline configuration
let config = {
    adapters: {
        'default': require('sails-memory')
    },
    connections: {
        memDb: {
            adapter: 'default'
        }
    },
    defaults: {
        migrate: 'alter'
    }
};

// Article model
const Article = require('./article');

/**
 * DB class acts as a wrapper around Waterline to make managing instances easier
 * throughout tests and application life span
 */
class DB {
  /**
   * Creates new DB instance
   */
    constructor() {
        logger.info('Created DB object');
        // Instantiate a new instance of the ORM
        this.orm = new require('waterline')();
    }

    /**
     * Tears down Waterline so that it may be reinitialized
     */
    teardown() {
        this.orm.teardown();
    }

    /**
     * adds models and connections to app for convenience
     *
     * @param {Express} app
     */
    setupMiddleware(app) {
        logger.debug('Setting up DB');
        let _this = this;

        return new Promise((resolve, reject) => {
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
