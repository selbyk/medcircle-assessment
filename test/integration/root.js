/* globals describe: false, it: false, beforeEach: false, afterEach: false */
'use strict';
const logger = require('winston');
const request = require('supertest');

process.env.PORT = 3434;
process.env.NODE_ENV = 'testing';
process.env.LOG_LEVEL = 'error';

const App = require('../../app');

describe('root endpoint', () => {
    let app;

    beforeEach((done) => {
        app = new App();
        app.start().then(() => done());
    });

    afterEach((done) => {
        app.stop().then(() => done());
    });

    it('responds 200 to / GET requests', (done) => {
        logger.info('Testing root GET response status');
        request(app.server)
            .get('/')
            .expect(200, done);
    });

    it('responds 404 to GET requests withour route handlers', (done) => {
        request(app.server)
            .get('/foo/bar')
            .expect(404, done);
    });
});
