'use strict';
// Include gulp
const gulp = require('gulp');

// Include Our Plugins
const jshint = require('gulp-jshint');
const mocha = require('gulp-mocha');

let srcPaths = ['./*.js', './!(node_modules)/**/*.js'];
let testPaths = {
    unit: [],
    integration: ['test/integration/*.js']
};
let watching = false;

/*{reporter: 'nyan'}*/
let mochaConfig = {
    reporter: 'spec'
};

function handleError(err) {
    console.error(err.toString());
    if (watching) {
        this.emit('end'); // jshint ignore:line
    } else {
        // if you want to be really specific
        process.exit(1);
    }
}

// Run tests
gulp.task('test', ['lint'], () => {
    gulp
        .src(testPaths.integration, {
            read: false
        })
        // gulp-mocha needs filepaths so you can't have any plugins before it
        .pipe(mocha(mochaConfig))
        .on('error', handleError);
});

// Lint Task
gulp.task('lint', () => {
    return gulp.src(srcPaths)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Watch Files For Changes
gulp.task('watch', () => {
    watching = true;
    gulp.watch(srcPaths, ['test']);
});

// Default Task
gulp.task('default', ['test', 'watch']);
