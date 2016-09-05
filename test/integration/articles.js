/* globals describe: false, it: false, beforeEach: false, afterEach: false */
'use strict';
const logger = require('winston');
const request = require('supertest');

const ExpectHelpers = require('../helpers/expect');
const ArticleHelpers = require('../helpers/article');

const handleError = require('../helpers/error');

process.env.PORT = 3434;
process.env.NODE_ENV = 'testing';
process.env.LOG_LEVEL = 'error';

describe('/articles endpoint', () => {
    const createServer = require('../../server');
    let server;

    beforeEach((done) => {
        createServer().then((app) => {
            server = app.listen(process.env.PORT, () => {
                ArticleHelpers.loadArticleFixtures(server)
                    .then(done)
                    .catch(done);
            });
        });
    });

    afterEach((done) => {
        server.close(done);
    });

    it('GET /articles returns list of articles', (done) => {
        logger.info('Testing article list GET request');
        request(server)
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
        request(server)
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
        ArticleHelpers.postArticle(server, ArticleHelpers.genArticleObject())
            //.then(article => articleDoesNotExist(server, article))
            .then(article => ArticleHelpers.articleExists(server, article))
            .catch(e => handleError(e, done, true))
            .then(() => done());
    });

    it('DELETE /articles/<id> deletes article with id <id>', (done) => {
        logger.info('Testing article deletion');

        let deletedArticle;
        ArticleHelpers.getRandArticle(server)
            .then(article => ArticleHelpers.articleExists(server, article))
            .then(article => {
                deletedArticle = article;
                return ArticleHelpers.deleteArticle(server, article);
            })
            //.then(article => articleExists(server, deletedArticle))
            .then(() => ArticleHelpers.articleDoesNotExist(server, deletedArticle))
            .catch(e => handleError(e, done, true))
            .then(() => done());
    });

    it('PUT /articles/<id> updates article with id <id>', (done) => {
        logger.info('Testing article deletion');

        ArticleHelpers.getRandArticle(server)
            .then(article => ArticleHelpers.articleExists(server, article))
            .then(article => ArticleHelpers.putArticle(server, article))
            .then(article => ArticleHelpers.articleExists(server, article))
            //.then(res => articleDoesNotExist(server, updatedArticle))
            .catch(e => handleError(e, done, true))
            .then(() => done());
    });
});
