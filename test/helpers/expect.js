'use strict';
const _ = require('lodash');

/**
 * Collection of static functions that throw errors for endpoint testing
 */
class ExpectHelpers {
    constructor() {}

    /**
     * Throws an error if response body isn't an array
     *
     * @param  {ExpressResponse}  res
     */
    static isArray(res) {
        if (!_.isArray(res.body)) {
            throw new Error('Body is not an array');
        }
    }

    /**
     * Throws an error if response body isn't an Object
     *
     * @param  {ExpressResponse}  res
     */
    static isObject(res) {
        if (!_.isPlainObject(res.body)) {
            throw new Error('Body is not a plain object');
        }
    }

    /**
     * Throws an error if response body doesn't include 'summary' attr
     *
     * @param  {ExpressResponse}  res
     */
    static hasSummaryAttr(res) {
        if (_.isArray(res.body)) {
            for (let article of res.body) {
                if (!('summary' in article)) {
                    throw new Error('missing summary');
                }
            }
        } else {
            if (!('summary' in res.body)) {
                throw new Error('missing summary');
            }
        }
    }

    /**
     * Throws an error if response body includes 'summary' attr
     *
     * @param  {ExpressResponse}  res
     */
    static doesNotHaveSummary(res) {
        if (_.isArray(res.body)) {
            for (let article of res.body) {
                if (('summary' in article)) {
                    throw new Error('summary present');
                }
            }
        } else {
            if (('summary' in res.body)) {
                throw new Error('summary present');
            }
        }
    }

    static hasBodyAttr(res) {
        if (_.isArray(res.body)) {
            for (let article of res.body) {
                if (!('body' in article)) {
                    throw new Error('missing body');
                }
            }
        } else {
            if (!('body' in res.body)) {
                throw new Error('missing body');
            }
        }
    }

    static doesNotHaveBodyAttr(res) {
        if (_.isArray(res.body)) {
            for (let article of res.body) {
                if (('body' in article)) {
                    throw new Error('body present');
                }
            }
        } else {
            if (('body' in res.body)) {
                throw new Error('body present');
            }
        }
    }
}

module.exports = ExpectHelpers;
