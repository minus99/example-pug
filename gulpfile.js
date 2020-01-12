const { src, dest, series, parallel, lastRun, watch } = require('gulp');
const browserSync = require('browser-sync').create();
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');

function html(done) {
  return src([ 'src/pug/*.pug' ], 
    { since: lastRun(html) }
  )
  .pipe(pug({
    pretty: true
  }))
  .pipe(dest('dist/'))
  .pipe(browserSync.stream())
  done();
}

function css(done) {
  return src([
    'src/scss/*.scss'
  ])
  .pipe(sass({
    outputStyle: 'compressed'
  }))
  .pipe(autoprefixer({
    cascade: false,
    grid: 'autoplace'
  }))
  .pipe(dest('dist/css'))
  .pipe(browserSync.stream())
  done();
}

function js(done) {
  return src(['src/js/libs/jquery.min.js', 'src/js/libs/bootstrap.bundle.min.js', 'src/js/libs/swiper.min.js', 'src/js/libs/jquery.countdown.js', 'src/js/libs/jquery.countdown-tr.js', 'src/js/libs/customEvents-99.1.0.min.js', 'src/js/custom-plugins.js', 'src/js/config.js', 'src/js/allScripts.js'])
  .pipe(uglify())
  .pipe(concat('all.js'))
  .pipe(dest('dist/js'))
  .pipe(browserSync.stream())
  done();
}

function pwa(done) {
  return src([
    'src/manifest-min.json', 
    'src/sw.js'
  ])
  .pipe(dest('dist/'))
  .pipe(browserSync.stream())
  done();
}

function fonts(done) {
  return src([
    'src/fonts/**',
  ])
  .pipe(dest('dist/css/fonts'))
  .pipe(browserSync.stream())
  done();
}

function images(done) {
  return src([
    'src/images/**',
  ])
  .pipe(dest('dist/images'))
  .pipe(browserSync.stream())
  done();
}

function host(done) {
  browserSync.init({
    server: {
      baseDir: ["src", "dist"]
    }
  });
  done();
}

function watchFiles(done) {
  watch(['src/manifest-min.json', 'src/sw.js'], series(pwa));
  watch('src/pug/**/*.pug', series(html));
  watch('src/scss/**/*.scss', series(css));
  watch('src/js/**', series(js));
  watch('src/fonts/**', series(fonts));
  watch('src/images/**', series(images));
  done();
}

exports.css = css;
exports.js = js;


exports.default = series(css, parallel(pwa, html, js, fonts, images), host, watchFiles);