'use strict';
// Build Express Routes (CRUD routes for /articles)
const logger = require('winston');
const _ = require('lodash');

module.exports = function setupArticleRoutes(app) {
    logger.debug('Setting up article routes');

    app.get('/articles', (req, res) => {
        app.models.article.find().exec((err, models) => {
            if (err) {
                return res.status(500).json({
                    meta: {
                        code: 500,
                        status: 'Error',
                        message: 'Server Error'
                    }
                });
            }
            //res.json(models);
            res.json(_.map(models, (article) => {
                return _.omit(article, ['body']);
            }));
        });
    });

    app.post('/articles', (req, res) => {
        logger.debug('POST /articles');
        logger.silly('Request Body: ', req.body);
        app.models.article.create(req.body, (err, model) => {
            if (err) {
                logger.error(err);
                Object.keys(err).map(key => logger.debug(err[key]));
                return res.status(500).json({
                    meta: {
                        code: 500,
                        status: 'Error',
                        message: 'Server Error'
                    }
                });
            }
            logger.silly('Response Body: ', model);
            res.json(model);
        });
    });

    app.get('/articles/:id', (req, res) => {
        app.models.article.findOne({
            id: req.params.id
        }, function(err, model) {
            if (err) {
                return res.status(500).json({
                    meta: {
                        code: 500,
                        status: 'Error',
                        message: 'Server Error'
                    }
                });
            }
            if (model) { // Return model if it exists
                res.json(_.omit(model, ['summary']));
            } else { // Return 404 if no data returned
                res.status(404).json({
                    meta: {
                        code: 404,
                        status: 'Error',
                        message: 'Not found'
                    }
                });
            }
        });
    });

    app.delete('/articles/:id', (req, res) => {
        app.models.article.destroy({
            id: req.params.id
        }, (err) => {
            if (err) {
                logger.error(err);
                return res.status(500).json({
                    meta: {
                        code: 500,
                        status: 'Error',
                        message: 'Server Error'
                    }
                });
            }
            res.status(200).json({
                meta: {
                    code: 200,
                    status: 'Ok',
                    message: 'Deletion successful'
                }
            });
        });
    });

    app.put('/articles/:id', (req, res) => {
        // Don't pass ID to update
        delete req.body.id;

        app.models.article.update({
            id: req.params.id
        }, req.body, (err, model) => {
            if (err) {
                return res.status(500).json({
                    meta: {
                        code: 500,
                        status: 'Error',
                        message: 'Server Error'
                    }
                });
            }
            if(_.isArray(model) && model.length === 1){
              res.json(model[0]);
            } else {
              res.json(model);
            }
        });
    });
};
