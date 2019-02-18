// Utilities
const sourcemaps = require('gulp-sourcemaps');
const cssnano = require('cssnano');
const postcss = require('gulp-postcss');
const autoprefixer = require("autoprefixer");
const gzip = require('gulp-gzip');
const fs = require('fs');

// Gulp
const gulp = require('gulp');

// Gulp plugins
const header = require('gulp-header');
const sass = require('gulp-sass');
const del = require("del");
const rename = require('gulp-rename');
const notify = require("gulp-notify");


// Misc/global vars
var pkg = JSON.parse(fs.readFileSync('package.json'));

// Task options
var opts = {
  destPath: './',
  buildPath: './dist',

  autoprefixer: {
    dev: {
      browsers: ['last 1 versions'],
      cascade: false
    },
    build: {
      browsers: ['> 1%', 'last 2 versions'],
      cascade: false
    }
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

// Clean assets
function clean() {
  return del(["./dist/**"]);
}

function compress() {
  return gulp
  .src(opts.buildPath + '/mime-icons.min.css')
  .pipe(gzip())
  .pipe(gulp.dest(opts.buildPath));
}

function buildStyle() {
  return gulp
    .src("./mime-icons.scss")
    .pipe(sass(opts.sass))
    .on('error', notify.onError('Error: <%= error.message %>'))
    .pipe(gulp.dest(opts.buildPath))
    .pipe(postcss([
      autoprefixer(opts.autoprefixer.build),
      cssnano(opts.cssnano)
    ]))
    .pipe(header(opts.banner, pkg))
    .pipe(rename(opts.minRename))
    .pipe(gulp.dest(opts.buildPath));
}

function css() {
  return gulp
    .src("./mime-icons.scss")
    .pipe(sourcemaps.init())
    .pipe(sass(opts.sass))
    .on('error', notify.onError('Error: <%= error.message %>'))
    .pipe(postcss([
      autoprefixer(opts.autoprefixer.dev)
    ]))
    .pipe(header(opts.banner, pkg))
    .pipe(gulp.dest(opts.destPath))
    .pipe(sourcemaps.write(opts.destPath))
    .pipe(gulp.dest(opts.destPath));
}

// Watch files
function watchFiles() {
  gulp.watch("./**/*.scss", css);
}

const build = gulp.series(clean, buildStyle, compress);
const watch = gulp.series(watchFiles);

exports.css = css;
exports.clean = clean;
exports.build = build;
exports.watch = watch;
exports.default = build;