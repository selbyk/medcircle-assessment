'use strict';
// Build Express Routes (CRUD routes for /articles)
const logger = require('winston');
const _ = require('lodash');

module.exports = function setupArticleRoutes(app) {
    logger.debug('Setting up article routes');

    app.get('/articles', (req, res) => {
        app.models.article.find().exec((err, models) => {
            if (err) {
                return res.json({
                    err: err
                }, 500);
            }
            //res.json(models);
            res.json(_.map(models, (article) => {
                return _.omit(article, ['body']);
            }));
        });
    });

    app.post('/articles', (req, res) => {
        app.models.article.create(req.body, (err, model) => {
            if (err) {
                return res.json({
                    err: err
                }, 500);
            }
            res.json(model);
        });
    });

    app.get('/articles/:id', (req, res) => {
        app.models.article.findOne({
            id: req.params.id
        }, function(err, model) {
            if (err) {
                return res.json({
                    err: err
                }, 500);
            }
            //res.json(model);
            res.json(_.omit(model, ['summary']));
        });
    });

    app.delete('/articles/:id', (req, res) => {
        app.models.article.destroy({
            id: req.params.id
        }, (err) => {
            if (err) {
                return res.json({
                    err: err
                }, 500);
            }
            res.json({
                status: 'ok'
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
                return res.json({
                    err: err
                }, 500);
            }
            res.json(model);
        });
    });
};
