/* globals describe: false, it: false, beforeEach: false, afterEach: false */
'use strict';
const logger = require('winston');
const request = require('supertest');

process.env.PORT = 3434;
process.env.NODE_ENV = 'testing';
process.env.LOG_LEVEL = 'error';

const App = require('../../app');

const ExpectHelpers = require('../helpers/expect');
const ArticleHelpers = require('../helpers/article');

const handleError = require('../helpers/error');

describe('/articles endpoint', () => {
    let app;

    beforeEach((done) => {
        app = new App();
        app.start().then(() => {
            ArticleHelpers.loadArticleFixtures(app.server)
                .then(done)
                .catch(done);
        });
    });

    afterEach((done) => {
        app.stop().then(() => done());
    });

    it('GET /articles returns list of articles', (done) => {
        logger.info('Testing article list GET request');
        request(app.server)
            .get('/articles')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(ExpectHelpers.isArray)
            .expect(ExpectHelpers.hasSummaryAttr)
            .expect(ExpectHelpers.doesNotHaveBodyAttr)
            .expect(200, done);
    });

    it('GET /articles/<id> returns the article with id <id>', (done) => {
        logger.info('Testing single article GET request');
        request(app.server)
            .get('/articles/1')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(ExpectHelpers.isObject)
            .expect(ExpectHelpers.hasBodyAttr)
            .expect(ExpectHelpers.doesNotHaveSummary)
            .expect(200, done);
    });

    it('POST /articles creates article with posted data', (done) => {
        logger.info('Testing article creation');
        ArticleHelpers.postArticle(app.server, ArticleHelpers.genArticleObject())
            //.then(article => articleDoesNotExist(app.server, article))
            .then(article => ArticleHelpers.articleExists(app.server, article))
            .catch(e => handleError(e, done, true))
            .then(() => done());
    });

    it('DELETE /articles/<id> deletes article with id <id>', (done) => {
        logger.info('Testing article deletion');

        let deletedArticle;
        ArticleHelpers.getRandArticle(app.server)
            .then(article => ArticleHelpers.articleExists(app.server, article))
            .then(article => {
                deletedArticle = article;
                return ArticleHelpers.deleteArticle(app.server, article);
            })
            //.then(article => articleExists(app.server, deletedArticle))
            .then(() => ArticleHelpers.articleDoesNotExist(app.server, deletedArticle))
            .catch(e => handleError(e, done, true))
            .then(() => done());
    });

    it('PUT /articles/<id> updates article with id <id>', (done) => {
        logger.info('Testing article deletion');

        ArticleHelpers.getRandArticle(app.server)
            .then(article => ArticleHelpers.articleExists(app.server, article))
            .then(article => ArticleHelpers.putArticle(app.server, article))
            .then(article => ArticleHelpers.articleExists(app.server, article))
            //.then(res => articleDoesNotExist(app.server, updatedArticle))
            .catch(e => handleError(e, done, true))
            .then(() => done());
    });
});
