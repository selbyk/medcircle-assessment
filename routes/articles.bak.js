const logger = require('winston');
const _ = require('lodash');

function listArticles(db) {
    return new Promise((resolve, reject) => {
        try {
            resolve(_.map(db.articles.find(), (article) => {
                return _.omit(article, ['body']);
            }));
        } catch (err) {
            reject(err);
        }
    });
}

function getArticle(db, id) {
    logger.debug(`Getting article ${id}`);
    return new Promise((resolve, reject) => {
        try {
            resolve(_.omit(db.articles.get(id), ['summary']));
        } catch (err) {
            reject(err);
        }
    });
}

module.exports = function setupArticleRoutes(app, db) {

    app.get('/articles', (req, res, next) => {
        listArticles(db)
            .then((articles) => {
                res.json(articles);
                next();
            })
            .catch((err) => {
                logger.error(err);
                next();
            });
    });

    app.get('/articles/:id', (req, res, next) => {
        logger.debug(`Getting article ${req.params.id}`);
        getArticle(db, req.params.id)
            .then((article) => {
                res.json(article);
                next();
            })
            .catch((err) => {
                logger.error(err);
                next();
            });
    });

    return app;
};
