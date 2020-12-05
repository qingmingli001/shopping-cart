
const { src, dest, series } = require('gulp');

const concat = require('gulp-concat');
const minify = require('gulp-minify');
var sourcemaps = require('gulp-sourcemaps');
const imagemin = require('gulp-imagemin');

function javascript() {
  return src('src/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(concat('all.js'))
    .pipe(minify())
    .pipe(sourcemaps.write())
    .pipe(dest('dist/js'));
};
 
function imageTask() {
  return src('src/images/*')
  .pipe(imagemin())
  .pipe(dest('dist/mages'));
}

function css() {
  return src('src/**/*.css')
    .pipe(sourcemaps.init())
    .pipe(concat('all.css'))
    .pipe(minify())
    .pipe(sourcemaps.write('.'))
    .pipe(dest('dist/css'))
}


exports.javascript = javascript;
exports.imageTask = imageTask;
exports.css = css;

exports.default = series(javascript, css, imageTask);