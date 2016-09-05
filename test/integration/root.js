/* globals describe: false, it: false, beforeEach: false, afterEach: false */
'use strict';
const logger = require('winston');
const request = require('supertest');

process.env.PORT = 3434;
process.env.NODE_ENV = 'testing';
process.env.LOG_LEVEL = 'error';

describe('root endpoint', () => {
    const createServer = require('../../server');
    let server;

    beforeEach((done) => {
        createServer().then((app) => {
            server = app.listen(process.env.PORT, () => done());
        });
    });

    afterEach((done) => {
        server.close(done);
    });

    it('responds 200 to / GET requests', (done) => {
        logger.info('Testing root GET response status');
        request(server)
            .get('/')
            .expect(200, done);
    });

    it('responds 404 to GET requests withour route handlers', (done) => {
        request(server)
            .get('/foo/bar')
            .expect(404, done);
    });
});
