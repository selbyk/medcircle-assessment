'use strict';
const Waterline = require('waterline');
const _ = require('lodash');

/**
 * Article model
 * @class Article
 * @param {String} title
 * @param {String} summary
 * @param {String} body
 * @param {String} mediaUrl
 * @param {Number} likesCount
 * @param {Object} author
 * @param {Date} publishedAt
 * @param {Date} createdAt
 * @param {Date} updatedAt
 */
const Article = Waterline.Collection.extend({
    identity: 'article',
    connection: 'memDb',

    attributes: {
        title: 'string',
        summary: 'string',
        body: 'string',
        mediaUrl: 'string',
        likesCount: 'number',
        author: 'object',
        publishedAt: 'date'
    },
    /**
     * creates summary from body, if a summary isn't given
     * @memberof Article
     * @param  {Article}   values article instance to modify
     * @param  {Function} next   must be called when operations are finished
     */
    beforeCreate(values, next) {
        if (!values.summary) {
            values.summary = values.body.slice(0, 150) + '...';
        }
        next();
    },
    /**
     * updates likesCount with parseInt(likesCount), if likesCount is given as a string
     * @memberof Article
     * @param  {Article}  values article instance to modify
     * @param  {Function} next   must be called when operations are finished
     */
    beforeValidate(values, next) {
        if (values.likesCount && _.isString(values.likesCount)) {
            values.likesCount = parseInt(values.likesCount);
        }
        next();
    }
});

module.exports = Article;
