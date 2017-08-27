// Utilities
var cssnano = require('cssnano');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var gzip = require('gulp-gzip');
var fs = require('fs');

// Gulp
var gulp = require('gulp');

// Gulp plugins
var header = require('gulp-header');
var watch = require('gulp-watch');
var sass = require('gulp-sass');
var rename = require('gulp-rename');
var runSequence = require('run-sequence');
var sourcemaps = require('gulp-sourcemaps');
var notify = require("gulp-notify");


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
  
  cssnano: {reduceIdents: {keyframes: false}},

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

gulp.task('build', function () {

  return gulp.src('./mime-icons.scss')
    
    .pipe(sass(opts.sass))
    .on('error', notify.onError('Error: <%= error.message %>'))
    .pipe(header(opts.banner, pkg))
    .pipe(gulp.dest('./dist/'))
    .pipe(postcss([
      autoprefixer({
        browsers: ['> 1%', 'last 2 versions', 'Firefox > 20', 'iOS > 5', 'ie > 7'],
        cascade: false
      }),
      cssnano(opts.cssnano)
    ]))
    .pipe(rename(opts.minRename))
    .pipe(gulp.dest('./dist/'));
});
  
gulp.task('sass', function () {
  
  return style = gulp.src('./mime-icons.scss')
  
    .pipe(sourcemaps.init())
    .pipe(sass(opts.sass))
    .on('error', notify.onError('Error: <%= error.message %>'))
    .pipe(postcss([
      autoprefixer(opts.autoprefixer)
    ]))    
    .pipe(sourcemaps.write(opts.destPath))
    .pipe(gulp.dest(opts.destPath));

});

gulp.task('compress', function() {
  gulp.src('./dist/mime-icons.min.css')
    .pipe(gzip())
    .pipe(gulp.dest('./dist/'));
});

gulp.task('watch', function () {
  watch('./**/*.scss', function () {
    gulp.start('sass');
  });
});

gulp.task('default', ['watch']);

gulp.task('finalize', function(callback) {
  return runSequence('build','compress');
});