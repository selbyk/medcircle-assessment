'use strict';
// Include gulp
const gulp = require('gulp');

// Include Our Plugins
const documentation = require('gulp-documentation');
const jshint = require('gulp-jshint');
const mocha = require('gulp-mocha');

// Setup some configuration variables
let srcPaths = ['./*.js', './!(node_modules|docs)/**/*.js'];
let testPaths = {
    unit: [],
    integration: ['test/integration/*.js']
};
let watching = false;
let mochaConfig = {
    //reporter: 'nyan'
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

// Generate documentation
gulp.task('doc', function() {
    gulp.src(srcPaths)
        .pipe(documentation({
            format: 'md'
        }))
        .pipe(gulp.dest('./docs/md'));
    gulp.src(srcPaths)
        .pipe(documentation({
            format: 'html'
        }))
        .pipe(gulp.dest('./docs/html'));
    gulp.src(srcPaths)
        .pipe(documentation({
            format: 'json'
        }))
        .pipe(gulp.dest('./docs/json'));
});

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
