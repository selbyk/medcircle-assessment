'use strict';
// Include gulp
const gulp = require('gulp');

// Include Our Plugins
const jshint = require('gulp-jshint');
const mocha = require('gulp-mocha');

// Run tests
gulp.task('test', ['lint'], () => {
    gulp.src('test/integration/api.js', {
            read: false
        })
        // gulp-mocha needs filepaths so you can't have any plugins before it
        .pipe(mocha( /*{reporter: 'nyan'}*/ ));
});

// Lint Task
gulp.task('lint', () => {
    return gulp.src('*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Watch Files For Changes
gulp.task('watch', () => {
    gulp.watch('*.js', ['test']);
});

// Default Task
gulp.task('default', ['test', 'watch']);
