'use strict';
const logger = require('winston');
const fs = require('fs');

/**
 * Load articles
 * @param  {Object} loki instance of loki
 * @return {Collection}    Article Collection
 */
module.exports = function loadArticleCollection(articles) {
    logger.profile('Inserting articles into loki');
    return new Promise((resolve, reject) => {
        fs.readFile('./fixtures/articles.json', 'utf8', (err, data) => {
            if (err) {
                logger.debug('Failed to load articles: ', err);
                reject(err); // we'll not consider error handling for now
            }
            let articleData = JSON.parse(data);
            for (let article of articleData) {
                logger.debug(`Inserting article ${article.id} (${article.title}) into loki db`);
                article.body = article.summary;
                article.summary = article.body.slice(0, 150) + '...';
                articles.insert(article);
            }
            logger.profile('Inserting articles into loki');
            resolve('Articles loaded successfully');
        });
    });
};
