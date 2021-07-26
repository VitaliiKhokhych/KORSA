const gulp = require('gulp');
const plumber = require('gulp-plumber');
const notify = require("gulp-notify");
const concat = require('gulp-concat');
const rename = require("gulp-rename");

const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const mmq = require('gulp-merge-media-queries');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');

const pug = require('gulp-pug');
const clean = require('gulp-clean');

const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');

let src = {
	html: [
    'dev/index.pug',
    'dev/components/**/*.pug'
  ],
	style: [
    'dev/bootstrap-3.0.3-dist/css/bootstrap.min.css',
    'dev/bootstrap-3.0.3-dist/css/bootstrap-theme.min.css',
    'dev/slicknav/slicknav.min.css',
    'dev/slick/slick.scss',
    'dev/slick/slick-theme.scss',
    'dev/fonts/**/**.css',
    'dev/variables.scss',
		'dev/mixins.scss', 
		'dev/general.scss', 
    'dev/components/**/**.scss'
	],
	script: [
    'dev/jquery-3.6.0.min.js',
    'dev/bootstrap-3.0.3-dist/js/**.js',
    'dev/slicknav/jquery.slicknav.min.js',
    'dev/slick/slick.min.js',
    'dev/components/**/**.js',
  ],
  image: [
    './dev/favicon.ico', 
    './dev/components/**/images/*.+(png|jpg|svg)'
  ],
  font: './dev/fonts/**/*.+(woff)',
};

let dest = 'production/';

const error = { errorHandler: notify.onError("Error: <%= error.message %>") };
const prodScript = 'all.js'

gulp.task('pug2html', function buildHTML() {
  return gulp.src('dev/index.pug')
  .pipe(plumber(error))
  .pipe(pug({ pretty: true }))
	.pipe(gulp.dest( dest ))
});

gulp.task('style:dev', function() {
  return gulp.src(src.style)
  .pipe(plumber(error))
  .pipe(sourcemaps.init())
  .pipe(concat('style.scss'))
  .pipe(sass())
  .pipe(sourcemaps.write('./'))
  .pipe(gulp.dest( dest ))
});

gulp.task('style:prod', function() {
  return gulp.src(src.style)
  .pipe(plumber(error))
  .pipe(concat('style.scss'))
  .pipe(sass())
  .pipe(mmq({ 
    log: true, 
  }))
  .pipe(autoprefixer())
  .pipe(cleanCSS({ level: 2}))
  .pipe(gulp.dest( dest ))
  .pipe(notify());
});

gulp.task('script:dev', function () {
  return gulp.src(src.script)
  .pipe(plumber(error))
  .pipe(concat(prodScript))
  .pipe(gulp.dest( dest ))
});
  
gulp.task('script:prod', function() {
  return gulp.src(src.script)
  .pipe(plumber(error))
  .pipe(concat(prodScript))
  .pipe(uglify())
  .pipe(gulp.dest( dest ))
  .pipe(notify());
});

gulp.task('image:dev', function () {
  return gulp.src(src.image)
  .pipe(rename({
    dirname: "images",
  }))
  .pipe(gulp.dest( dest ));
});

gulp.task('image:prod', function () {
  return gulp.src(src.image)
  .pipe(imagemin([
    imagemin.gifsicle({interlaced: true}),
    imagemin.mozjpeg({quality: 75, progressive: true}),
    imagemin.optipng({optimizationLevel: 5}),
    imagemin.svgo({
      plugins: [
        {removeViewBox: true},
        {cleanupIDs: false}
      ]
    })
  ], 
  {
    verbose: true, 
  }
  ))
  .pipe(rename({
    dirname: "images",
  }))
  .pipe(gulp.dest( dest ));
});

gulp.task('font', function () {
  return gulp.src(src.font)
  .pipe(rename({
    dirname: "fonts",
  }))
  .pipe(gulp.dest( dest ));
});

gulp.task('clean', function () {
  return gulp.src( dest, {read: false})
  .pipe(clean()) 
});

gulp.task('watch:dev', function() {
  gulp.watch(src.html, gulp.parallel('pug2html'));
  gulp.watch(src.style, gulp.parallel('style:dev'));
  gulp.watch(src.script, gulp.parallel('script:dev'));
  gulp.watch(src.image, gulp.parallel('image:dev'));
  gulp.watch(src.font, gulp.parallel('font'));
});

gulp.task('dev', gulp.series(
  gulp.parallel('pug2html', 'style:dev', 'script:dev', 'image:dev', 'font'),
  gulp.parallel('watch:dev')
));
  
  
gulp.task('watch:prod', function () {
  gulp.watch('dev/index.pug', gulp.parallel('pug2html'));
  gulp.watch('dev/components/**/*.pug', gulp.parallel('pug2html'));
  gulp.watch(src.style, gulp.parallel('style:prod'));
  gulp.watch(src.script, gulp.parallel('script:prod'));
  gulp.watch(src.image, gulp.parallel('image:prod'));
  gulp.watch(src.font, gulp.parallel('font'));
});

gulp.task('prod', gulp.series(
  gulp.parallel('clean'),
  gulp.parallel('pug2html', 'style:prod', 'script:prod', 'font'),
  gulp.parallel('watch:prod')
));
  