'use strict';
const fs = require('fs');
const logger = require('winston');
const _ = require('lodash');
const request = require('supertest');
const chance = require('chance').Chance();

const handleError = require('./error');

const ExpectHelpers = require('./expect');

/**
 * Collection of static functions to help with testing article endpoints
 */
class ArticleHelpers {

  /**
   * Test if article does not exist
   *
   * @param  {App.server} server
   * @param  {Object} article
   * @return {Promise}
   */
  static articleDoesNotExist(server, article) {
      let articleId = this.determineArticleId(article);
      if (articleId) {
          logger.verbose(`Checking that article ${articleId} doesn't exist`);
          return new Promise((resolve, reject) => {
              try {
                  request(server)
                      .get(`/articles/${articleId}`)
                      .set('Accept', 'application/json')
                      .expect('Content-Type', /json/)
                      .expect(404)
                      .end((err, res) => {
                          if (err) {
                              resolve(handleError(err, true));
                          } else {
                              if (res.body.id === articleId) {
                                  handleError(new Error('Article exists when it should not'), reject);
                              } else {
                                  resolve(res.body);
                              }
                          }
                      });
              } catch (err) {
                  logger.error(err);
                  reject(err);
              }
          });
      } else {
          return handleError(new Error('No article id to test'), true);
      }
  }

  /**
   * Test if article exists
   *
   * @param  {App.server} server
   * @param  {Object} article
   * @return {Promise}
   */
  static articleExists(server, article) {
      return new Promise((resolve, reject) => {
          let articleId = this.determineArticleId(article);
          if (articleId) {
              logger.verbose(`Checking that article ${articleId} exists`);
              logger.debug(article);
              request(server)
                  .get(`/articles/${articleId}`)
                  .set('Accept', 'application/json')
                  .expect('Content-Type', /json/)
                  .expect(200)
                  .end((err, res) => {
                      if (err) {
                          resolve(handleError(err, true));
                      } else {
                          if (res.body.id === articleId) {
                              resolve(res.body);
                          } else {
                              handleError(new Error('Article ids do not match'), reject);
                          }
                      }
                  });
          } else {
              return handleError(new Error('No article id to test'), reject);
          }
      });
  }

  /**
   * Deletes an article
   *
   * @param  {App.server} server
   * @param  {Object} article
   * @return {Promise}
   */
  static deleteArticle(server, article) {
      let articleId = this.determineArticleId(article);
      if (articleId) {
          logger.verbose(`Deleting article ${articleId}`);
          return new Promise((resolve, reject) => {
              request(server)
                  .delete(`/articles/${articleId}`)
                  .set('Accept', 'application/json')
                  .expect('Content-Type', /json/)
                  .expect(200)
                  .end((err, res) => {
                      if (err) {
                          handleError(err, reject);
                      } else {
                          if (res.body) {
                              logger.silly(res.body);
                              resolve(res.body);
                          } else {
                              handleError(new Error('Failed to get an article'), reject);
                          }
                      }
                  });
          });
      } else {
          return handleError(new Error('No article id to test'), true);
      }
  }

  /**
   * Test if article exists
   *
   * @param  {Object|Number|Array} article
   * @return {Number}
   */
    static determineArticleId(article) {
        let articleId;

        if (_.isArray(article) && article.length === 1) {
            article = article[0];
        }

        if (_.isInteger(article)) {
            articleId = article;
        } else if (_.isObject(article) && article.id) {
            articleId = article.id;
        } else if (_.isString(article)) {
            articleId = parseInt(article);
        }

        return articleId;
    }

    /**
     * Generates an Article object with random values for testing
     *
     * @return {Object}
     */
    static genArticleObject() {
        logger.verbose('Generating random article object');
        return {
            title: chance.sentence(),
            body: this.genPassageStr(),
            mediaUrl: chance.url({
                extensions: ['gif', 'jpg', 'png']
            }),
            likesCount: chance.integer({
                min: 0,
                max: 10000
            }),
            author: {
                name: chance.name(),
                iconUrl: chance.url({
                    extensions: ['gif', 'jpg', 'png']
                })
            },
            publishedAt: chance.date().toISOString()
        };
    }

    /**
     * Generates a passage between 3-7 paragraphs in length
     *
     * @return {String}
     */
    static genPassageStr() {
        let passage = [];
        let passageLength = chance.integer({
            min: 3,
            max: 7
        });
        for (let i = 0; i < passageLength; ++i) {
            passage.push(chance.paragraph());
        }
        return passage.join('\r\n');
    }

    /**
     * Gets a random article from the api
     *
     * @param  {App.server} server
     * @return {Promise}
     */
    static getRandArticle(server) {
        logger.verbose('Getting random article');
        return new Promise((resolve, reject) => {
            request(server)
                .get('/articles')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    if (err) {
                        handleError(err, reject);
                    } else {
                        let article = res.body[Math.floor(Math.random() * res.body.length)];
                        if (article) {
                            resolve(article);
                        } else {
                            handleError(new Error('Failed to get an article'), reject);
                        }
                    }
                });
        });
    }

    /**
     * Load article fixtures into server for testing
     *
     * @param  {App.server} server
     * @return {Promise}
     */
    static loadArticleFixtures(server) {
        return new Promise((resolve, reject) => {
            fs.readFile('./test/fixtures/articles.json', 'utf8', (err, data) => {
                if (err) {
                    logger.debug('Failed to load articles: ', err);
                    reject(err); // we'll not consider error handling for now
                }
                let articleData = JSON.parse(data);
                Promise
                    .all(articleData.map((article) => {
                        return this.postArticle(server, article);
                    }))
                    .then(() => resolve())
                    .catch(err => reject(err));
            });
        });
    }

    /**
     * Posts an article to the api
     *
     * @param  {App.server} server
     * @param  {Object} article
     * @return {Promise}
     */
    static postArticle(server, article) {
        logger.verbose('Posting article ');
        logger.silly(JSON.stringify(article, null, 2));
        return new Promise((resolve, reject) => {
            try {
                request(server)
                    .post('/articles')
                    .send(article)
                    .set('Accept', 'application/json')
                    .expect(200)
                    .end((err, res) => {
                        if (err) {
                            handleError(err, reject);
                            return;
                        }
                        logger.silly(res.body);
                        resolve(res.body);
                    });
            } catch (err) {
                handleError(err, reject);
            }
        });
    }

    /**
     * Puts an article to the api
     *
     * @param  {App.server} server
     * @param  {Object} article
     * @return {Promise}
     */
    static putArticle(server, article) {
        logger.verbose('Putting article');
        logger.debug(JSON.stringify(article, null, 2));
        return new Promise((resolve, reject) => {
            try {
                request(server)
                    .put(`/articles/${article.id}`)
                    .send(article)
                    .set('Accept', 'application/json')
                    .expect(ExpectHelpers.isObject)
                    .expect(200)
                    .end((err, res) => {
                        if (err) {
                            logger.error('hmmmm', err);
                            handleError(err, reject);
                        }
                        logger.silly(JSON.stringify(res.body, null, 2));
                        resolve(res.body);
                    });
            } catch (err) {
                handleError(err, reject);
            }
        });
    }
}

module.exports = ArticleHelpers;
