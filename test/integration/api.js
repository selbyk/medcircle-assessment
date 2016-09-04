'use strict';
const logger = require('winston');
const request = require('supertest');
const _ = require('lodash');

process.env.PORT = 3434;
process.env.NODE_ENV = 'testing';
process.env.LOG_LEVEL = 'debug';

logger.level = 'silly';

let articleData = [{
    "id": 1,
    "title": "White Veggies to Add to Your Meal",
    "summary": "Laboriosam dignissimos est quis sint. Voluptate dolore nostrum similique nulla iure error ex. Aliquid eum alias neque pariatur sit quae amet ut nemo. Esse quam aut dolores aut unde unde praesentium voluptas.",
    "media_url": "https://medcircle-coding-project.s3.amazonaws.com/api/articles/1.jpg",
    "published_at": "2016-07-27T04:41:58.933Z",
    "likes_count": 42,
    "author": {
        "name": "Amy Kovacek",
        "icon_url": "https://s3.amazonaws.com/uifaces/faces/twitter/adellecharles/128.jpg"
    }
}, {
    "id": 2,
    "title": "Zika Virus Potentially Transmitted in Florida",
    "summary": "Non dolores illo occaecati ratione quia qui. Non aliquid modi nemo aut ducimus. Tempore reiciendis beatae. Ullam vitae aut dolor voluptatem fugit sit autem necessitatibus ad.",
    "media_url": "https://medcircle-coding-project.s3.amazonaws.com/api/articles/2.jpg",
    "published_at": "2016-07-26T03:40:20.505Z",
    "likes_count": 38,
    "author": {
        "name": "Ernest Reynolds",
        "icon_url": "https://s3.amazonaws.com/uifaces/faces/twitter/jsa/128.jpg"
    }
}, {
    "id": 3,
    "title": "Protecting Yourself From Dangerous Temperatures",
    "summary": "Dignissimos eveniet distinctio magni. Aut magni nihil expedita voluptas. Iste sit in dolores vel fuga. Pariatur id veritatis dolore.",
    "media_url": "https://medcircle-coding-project.s3.amazonaws.com/api/articles/3.jpg",
    "published_at": "2016-07-24T01:09:10.123Z",
    "likes_count": 90,
    "author": {
        "name": "Randy Pipes",
        "icon_url": "https://s3.amazonaws.com/uifaces/faces/twitter/chrismerritt/128.jpg"
    }
}, {
    "id": 4,
    "title": "Sitting is the New Smoking",
    "summary": "Enim molestias illum rerum blanditiis. Dolor dolor omnis nemo ducimus omnis animi quam. Voluptates nesciunt laudantium soluta blanditiis et. Aut aperiam in id est dolor facere eaque.",
    "media_url": "https://medcircle-coding-project.s3.amazonaws.com/api/articles/4.jpg",
    "published_at": "2016-07-23T04:48:00.978Z",
    "likes_count": 25,
    "author": {
        "name": "Alejandro Ramos",
        "icon_url": "https://s3.amazonaws.com/uifaces/faces/twitter/mahmoudilyan/128.jpg"
    }
}, {
    "id": 5,
    "title": "Job Stress Might Be Making You Sick",
    "summary": "Debitis voluptatem consequuntur ullam molestias voluptatem. Cupiditate quia et quia qui vitae. In facilis consequuntur dolores quos consectetur ratione cupiditate et ab.",
    "media_url": "https://medcircle-coding-project.s3.amazonaws.com/api/articles/5.jpg",
    "published_at": "2016-07-22T08:59:45.460Z",
    "likes_count": 7,
    "author": {
        "name": "Emily White",
        "icon_url": "https://s3.amazonaws.com/uifaces/faces/twitter/kfriedson/128.jpg"
    }
}, {
    "id": 6,
    "title": "Healing Effects of Yoga",
    "summary": "Maiores suscipit ab inventore optio ad aliquam ducimus eos perspiciatis. Odit aut enim. Vel suscipit quo ipsam ad ducimus consequatur. Dolor omnis omnis sit ea tempore et ea.",
    "media_url": "https://medcircle-coding-project.s3.amazonaws.com/api/articles/6.jpg",
    "published_at": "2016-07-20T01:12:30.172Z",
    "likes_count": 14,
    "author": {
        "name": "Rohit Chadha",
        "icon_url": "https://s3.amazonaws.com/uifaces/faces/twitter/smartmohi/128.jpg"
    }
}, {
    "id": 7,
    "title": "Is TV Binging Hazardous to Your Health?",
    "summary": "Eius et perferendis. Voluptate blanditiis est. Non blanditiis fugit assumenda eum commodi. Earum labore nisi hic eos. Rerum quia laborum quasi. Ipsum qui quod.",
    "media_url": "https://medcircle-coding-project.s3.amazonaws.com/api/articles/7.jpg",
    "published_at": "2016-07-19T02:58:10.892Z",
    "likes_count": 4,
    "author": {
        "name": "Tina Wu",
        "icon_url": "https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg"
    }
}, {
    "id": 8,
    "title": "Studies Show Gut Bacteria Linked to Fatigue",
    "summary": "Quae natus aliquid nesciunt aperiam veniam non molestiae repudiandae qui. Est saepe doloribus eos. Libero nulla voluptas voluptatibus sequi et laboriosam dolores enim veniam.",
    "media_url": "https://medcircle-coding-project.s3.amazonaws.com/api/articles/8.jpg",
    "published_at": "2016-07-17T03:12:56.203Z",
    "likes_count": 0,
    "author": {
        "name": "Angela Blom",
        "icon_url": "https://s3.amazonaws.com/uifaces/faces/twitter/esthercrawford/128.jpg"
    }
}, {
    "id": 9,
    "title": "Detecting Early-Onset Alzheimerâ€™s Disease",
    "summary": "Hic quia iusto facilis quidem et soluta. Repudiandae dolores et omnis nulla. Corporis non earum laborum consequatur. Consequatur rem cupiditate totam enim.",
    "media_url": "https://medcircle-coding-project.s3.amazonaws.com/api/articles/9.jpg",
    "published_at": "2016-07-17T05:02:44.615Z",
    "likes_count": 31,
    "author": {
        "name": "Mike Sams",
        "icon_url": "https://s3.amazonaws.com/uifaces/faces/twitter/davidburlton/128.jpg"
    }
}, {
    "id": 10,
    "title": "Diet & Nutrition Tips: Fact vs. Fad",
    "summary": "In est et odio in minima unde consequatur nam aut. Quam sed sed perferendis aliquam sed. Voluptatem nulla non qui reprehenderit. Similique rem laudantium quo delectus id odio. Vel rem reiciendis nemo ipsam sint.",
    "media_url": "https://medcircle-coding-project.s3.amazonaws.com/api/articles/10.jpg",
    "published_at": "2016-07-15T01:54:37.752Z",
    "likes_count": 17,
    "author": {
        "name": "Dwayne Rhodes",
        "icon_url": "https://s3.amazonaws.com/uifaces/faces/twitter/aaronalfred/128.jpg"
    }
}];

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
            });;
    });
}

describe('loading express', () => {
    const createServer = require('../../server');
    let server;

    beforeEach((done) => {
        createServer().then((app) => {
            server = app.listen(process.env.PORT, () => {
                Promise
                    .all(articleData.map((article) => {
                        return postArticle(server, article);
                    }))
                    .then(() => done());
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
