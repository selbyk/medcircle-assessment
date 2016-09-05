Medcircle Assessment
---

### Prerequites

- [Node](https://nodejs.org/) >=4
- [Gulp](http://gulpjs.com/)
- [Mocha](https://mochajs.org/)

### Setup

```bash
npm i -g gulp
npm i -g mocha
git clone <path to this repo>
cd ./medcircle-assessment
npm i
```

### Usage

##### Run

```bash
node app.js
```

```bash
gulp server
```

```bash
npm start
```

##### Run Test Suite

```bash
gulp test
```

Example Output

```spec
[19:41:06] Starting 'lint'...
[19:41:06] Finished 'lint' after 186 ms
[19:41:06] Starting 'test'...
[19:41:06] Finished 'test' after 1.47 ms


  /articles endpoint
    ✓ GET /articles returns list of articles
    ✓ GET /articles/<id> returns the article with id <id>
    ✓ POST /articles creates article with posted data
    ✓ DELETE /articles/<id> deletes article with id <id>
    ✓ PUT /articles/<id> updates article with id <id>

  root endpoint
    ✓ responds 200 to / GET requests
    ✓ responds 404 to GET requests without route handlers


  7 passing (356ms)
```

##### Run w/ Live Reload & Automatic Testing

```bash
gulp
```

##### Generate Documentation

Generate html, json, and markdown documentation in `./docs`

```bash
gulp doc
```
