'use strict';
const fs = require('fs');
const logger = require('winston');
const request = require('supertest');
const _ = require('lodash');

process.env.PORT = 3434;
process.env.NODE_ENV = 'testing';
process.env.LOG_LEVEL = 'debug';

logger.level = 'silly';

function isArray(res) {
    if (!_.isArray(res.body)) {
        throw new Error('Body isn\'t an array');
    }
}

function isObject(res) {
    if (!_.isPlainObject(res.body)) {
        throw new Error('Body isn\'t a plain object');
    }
}

function hasSummaryAttr(res) {
    if (_.isArray(res.body)) {
        for (let article of res.body) {
            if (!('summary' in article)) {
                throw new Error("missing summary");
            }
        }
    } else {
        if (!('summary' in res.body)) {
            throw new Error("missing summary");
        }
    }
}

function doesNotHaveSummary(res) {
    if (_.isArray(res.body)) {
        for (let article of res.body) {
            if (('summary' in article)) {
                throw new Error("summary present");
            }
        }
    } else {
        if (('summary' in res.body)) {
            throw new Error("summary present");
        }
    }
}

function hasBodyAttr(res) {
    if (_.isArray(res.body)) {
        for (let article of res.body) {
            if (!('body' in article)) {
                throw new Error("missing body");
            }
        }
    } else {
        if (!('body' in res.body)) {
            throw new Error("missing body");
        }
    }
}

function doesNotHaveBodyAttr(res) {
    if (_.isArray(res.body)) {
        for (let article of res.body) {
            if (('body' in article)) {
                throw new Error("body present");
            }
        }
    } else {
        if (('body' in res.body)) {
            throw new Error("body present");
        }
    }
}

function postArticle(server, article) {
    return new Promise((resolve, reject) => {
        request(server)
            .post('/articles')
            .send(article)
            .set('Accept', 'application/json')
            .end(function(err, res) {
                if (err) {
                    logger.error(err);
                    reject(err);
                }
                resolve(server);
            });
    });
}

/**
 * Load articles
 * @return {Promise}
 */
function loadArticleCollection(server) {
    return new Promise((resolve, reject) => {
        fs.readFile('./fixtures/articles.json', 'utf8', (err, data) => {
            if (err) {
                logger.debug('Failed to load articles: ', err);
                reject(err); // we'll not consider error handling for now
            }
            let articleData = JSON.parse(data);
            Promise
                .all(articleData.map((article) => {
                    return postArticle(server, article);
                }))
                .then(() => resolve())
                .catch(err => reject(err));
        });
    });
};

describe('loading express', () => {
    const createServer = require('../../server');
    let server;

    beforeEach((done) => {
        createServer().then((app) => {
            server = app.listen(process.env.PORT, () => {
                loadArticleCollection(server)
                    .then(done)
                    .catch(done);
            });
        });
    });

    afterEach((done) => {
        server.close(done);
    });

    it('responds to /', (done) => {
        request(server)
            .get('/')
            .expect(200, done);
    });

    it('GET /articles returns list of articles', (done) => {
        request(server)
            .get('/articles')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(isArray)
            .expect(hasSummaryAttr)
            .expect(doesNotHaveBodyAttr)
            .expect(200, done);
    });

    it('GET /articles/1 returns a single article', (done) => {
        request(server)
            .get('/articles/1')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(isObject)
            .expect(hasBodyAttr)
            .expect(doesNotHaveSummary)
            .expect(200, done);
    });

    it('404 everything else', (done) => {
        request(server)
            .get('/foo/bar')
            .expect(404, done);
    });
});
