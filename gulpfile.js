var gulp = require('gulp');
var useref = require('gulp-useref');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var gulpif = require('gulp-if');
var jshint = require('gulp-jshint');
var gutil = require('gulp-util');
var replace = require('gulp-replace');
var del = require('del');
var license = require('gulp-license');


var $buildDest = './dist/';
var $year = 2016;
var $organization = "Ignacio X. Domínguez";

gulp.task('default', function() {
  // place code for your default task here
});

gulp.task('build', function() {

	gulp.src('src/index.htm')
	  .pipe(useref({ searchPath: './src/' }))
	  .pipe(gulpif('*.js', concat('jivui.js')))
		.pipe(gulpif('*.js', license('MIT', {tiny: false, year: $year, organization: $organization})))
		.pipe(gulp.dest($buildDest))
	  .pipe(gulpif('*.js', uglify().on('error', gutil.log)))
		.pipe(gulpif('*.js', concat('jivui.min.js')))
	  .pipe(gulpif('*.js', license('MIT', {tiny: true, year: $year, organization: $organization})))

		.pipe(gulp.dest($buildDest));
});

// cleans the build directory
gulp.task('clean', function() {
	return del([$buildDest + '/**/*'], {force: true});
});

gulp.task('lint_core', function() {
	return gulp.src(['./src/**/*.js'])
		.pipe(jshint({
			esnext: true
		}))
    .pipe(jshint.reporter('default'));
});


gulp.task('lint', function() {
	return gulp.src(['./src/**/*.js', './plugins/**/*.js'])
		.pipe(jshint({
			esnext: true
		}))
    .pipe(jshint.reporter('default'));
});


gulp.task('license', function() {
	gulp.src(['./src/**/*.js', './plugins/**/*.js'], { base: "./" })
		.pipe(license('MIT', {tiny: false, year: $year, organization: $organization}))
		.pipe(gulp.dest('.'));
});
