'use strict';
const Waterline = require('waterline');
const _ = require('lodash');

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

    // Lifecycle Callbacks
    beforeCreate: function(values, next) {
        if (!values.summary) {
            values.summary = values.body.slice(0, 150) + '...';
        }
        next();
    },
    beforeValidate: function(values, next) {
        if (values.likesCount && _.isString(values.likesCount)) {
            values.likesCount = parseInt(values.likesCount);
        }
        next();
    }
});

module.exports = Article;
