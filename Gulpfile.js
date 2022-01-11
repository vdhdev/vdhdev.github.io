'use strict';


// -----------------------------------------------------------------------------
// Dependencies
// -----------------------------------------------------------------------------

var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
var nunjucksRender = require('gulp-nunjucks-render');
var eclint = require('eclint');
var reporter = require('gulp-reporter');
var path = require('path');
var siteOutput = 'dist';


// -----------------------------------------------------------------------------
// Configuration
// -----------------------------------------------------------------------------

var input = 'src/scss/*.scss';
var inputMain = 'src/scss/main.scss';
var output = siteOutput + '/css';
var inputTemplates = 'src/pages/*.html';
var sassOptions = { outputStyle: 'expanded' };


// -----------------------------------------------------------------------------
// Sass compilation
// -----------------------------------------------------------------------------

gulp.task('sass', function () {
  return gulp
    .src(inputMain)
    .pipe(sass(sassOptions).on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(gulp.dest(output))
    .pipe(browserSync.stream());
});


// -----------------------------------------------------------------------------
// Javascript
// -----------------------------------------------------------------------------

gulp.task('scripts', function () {
  return gulp.src(['src/js/main.js'])
    .pipe(browserSync.reload({ stream: true }))
    .pipe(gulp.dest(siteOutput + '/js'));
});


// -----------------------------------------------------------------------------
// Templating
// -----------------------------------------------------------------------------

gulp.task('nunjucks', function () {
  nunjucksRender.nunjucks.configure(['src/templates']);
  // Gets .html and .nunjucks files in pages
  return gulp.src(inputTemplates)
    // Renders template with nunjucks
    .pipe(nunjucksRender({
      path: ['src/templates'] // String or Array
    }))
    // output files in dist folder
    .pipe(gulp.dest(siteOutput))
});


// -----------------------------------------------------------------------------
// Image
// -----------------------------------------------------------------------------

gulp.task('img', function () {
  return gulp.src('src/assets/img/**/*')
    .pipe(gulp.dest(siteOutput + '/img'));
});


// -----------------------------------------------------------------------------
// Fonts
// -----------------------------------------------------------------------------

gulp.task('fonts', function () {
  return gulp.src(['src/assets/fonts/*'])
    .pipe(gulp.dest(siteOutput + '/fonts/'));
});

// -----------------------------------------------------------------------------
// Files
// -----------------------------------------------------------------------------

gulp.task('files', function () {
  return gulp.src(['src/assets/files/*', 'src/assets/files/.*'])
    .pipe(gulp.dest(siteOutput));
});


// -----------------------------------------------------------------------------
// Watchers
// -----------------------------------------------------------------------------

gulp.task('serve', function () {
  // create server
  browserSync.init({
    server: {
      baseDir: siteOutput,
      serveStaticOptions: {
        extensions: ["html"]
      }
    }
  });
  // Watch the sass input folder for change,
  // and run `sass` task when something happens
  gulp.watch(input, gulp.series('sass'));

  // gulp.watch('js/*', gulp.series('scripts')).on('change', browserSync.reload);

  // Watch nunjuck templates and reload browser if change
  gulp.watch(inputTemplates, gulp.series('nunjucks')).on('change', browserSync.reload);

});

gulp.task('fix', function () {
  return gulp.src([
    'src/**/*.js'
  ],
    {
      base: './'
    })
    .pipe(eclint.fix())
    .pipe(gulp.dest('.'));
});

// -----------------------------------------------------------------------------
// Build task
// -----------------------------------------------------------------------------

gulp.task('build', gulp.parallel('sass', 'nunjucks', 'img', 'scripts', 'fonts'));

// -----------------------------------------------------------------------------
// Build for deployment task
// -----------------------------------------------------------------------------

gulp.task('build-to-deploy', gulp.parallel('build', 'files'));

// -----------------------------------------------------------------------------
// Default task
// -----------------------------------------------------------------------------

gulp.task('default', gulp.parallel('build', 'serve', 'fix'));
