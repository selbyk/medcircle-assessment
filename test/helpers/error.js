'use strict';
const logger = require('winston');
const _ = require('lodash');

function handleError(err, cb, throwError) {
    cb = cb ? cb : true;
    throwError = throwError ? throwError : false;

    if (_.isError(err)) {
        logger.error(err.message);
        logger.debug(err);
    } else if (_.isObject(err)) {
        logger.error('UNWRAPPED ERROR: ', JSON.stringify(err, null, 2));
        err = new Error(err);
    } else {
        logger.error('UNWRAPPED ERROR: ', err);
        err = new Error(err);
    }

    if (cb === true) {
        logger.error(1);
        throw err;
        //return new Promise.reject(err);
    }

    if (_.isFunction(cb)) {
        logger.error(2);
        if (throwError) {
            logger.error(3);
            cb(err);
            throw err;
        } else {
            return cb(err);
        }
    }
}

module.exports = handleError;
