const Waterline = require('waterline');

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
    }
});

module.exports = Article;
