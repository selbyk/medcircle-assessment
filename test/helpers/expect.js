'use strict';
const _ = require('lodash');

class ExpectHelpers {

    static isArray(res) {
        if (!_.isArray(res.body)) {
            throw new Error('Body is not an array');
        }
    }

    static isObject(res) {
        if (!_.isPlainObject(res.body)) {
            throw new Error('Body is not a plain object');
        }
    }

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
