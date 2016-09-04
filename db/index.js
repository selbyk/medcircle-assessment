'use strict';
const logger = require('winston');
const Loki = require('lokijs');

const loadArticleCollection = require('./articles');

function setupDb(app) {
    const loki = new Loki('loki.json');

    return new Promise((resolve, reject) => {
        let db = {
            articles: loki.addCollection('articles')
        };

        app.db = db;

        loadArticleCollection(db.articles)
            .then((message) => {
                logger.info(message);
                resolve(app);
            })
            .catch((err) => {
                logger.error(err);
                reject(err);
            });
    });
}

module.exports = setupDb;
