// Utilities
var autoprefixer = require('autoprefixer');
var cssnano = require('cssnano');
var fs = require('fs');

// Gulp
var gulp = require('gulp');

// Gulp plugins
var concat = require('gulp-concat');
var gutil = require('gulp-util');
var header = require('gulp-header');
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var rename = require('gulp-rename');
var runSequence = require('run-sequence');
var sourcemaps = require('gulp-sourcemaps');
var watchSass = require("gulp-watch-sass");

// Misc/global vars
var pkg = JSON.parse(fs.readFileSync('package.json'));

// Task options
var opts = {
  destPath: './',
  concatName: 'mime-icons.css',

  autoprefixer: {
    browsers: ['last 1 versions'],
    cascade: false
  },

  minRename: {
    suffix: '.min'
  },

  sass: {
    outputStyle: 'nested',
	errLogToConsole: true
  },

  banner: [
    '@charset "UTF-8";\n',
    '/*!',
    ' * <%= name %> -<%= homepage %>',
    ' * Version - <%= version %>',
    ' * Licensed under the MIT license - http://opensource.org/licenses/MIT',
    ' *',
    ' * Copyright (c) <%= new Date().getFullYear() %> <%= author.name %>',
    ' */\n\n'
  ].join('\n')
};

// ----------------------------
// Gulp task definitions
// ----------------------------

gulp.task('default', function() {
  runSequence('style');
});

gulp.task('style', function () {
 return gulp.src('*.scss')
   .pipe(sass(opts.sass))
   .pipe(concat(opts.concatName))
   .pipe(postcss([
      autoprefixer(opts.autoprefixer)
    ]))
   .pipe(header(opts.banner, pkg))
   .pipe(gulp.dest(opts.destPath))
   .pipe(postcss([
      cssnano({reduceIdents: {keyframes: false}})
    ]))
   .pipe(rename(opts.minRename))   
   .pipe(gulp.dest(opts.destPath));
});

gulp.task("sass:watch", () => watchSass([
  "./mime-icons.scss"
])
	.pipe(sourcemaps.init())
	.pipe(sass(opts.sass).on('error', sass.logError))
	.pipe(sourcemaps.write('.'))
	.pipe(gulp.dest(opts.destPath)));