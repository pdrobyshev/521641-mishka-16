"use strict";

var gulp = require("gulp");
var plumber = require("gulp-plumber");
var sourcemap = require("gulp-sourcemaps");
var sass = require("gulp-sass");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync").create();
var csso = require("gulp-csso");
var rename = require("gulp-rename");
var imagemin = require("gulp-imagemin");
var webp = require("gulp-webp");
var svgstore = require("gulp-svgstore");
var del = require("del");

gulp.task("clean", function () {
  return del("build");
});

gulp.task("copy", function () {
  return gulp.src([
    "source/fonts/**/*.{woff,woff2}",
    "source/img/**",
    "source/js/**",
    "source/*.ico"
  ], {
    base: "source"
  })
      .pipe(gulp.dest("build"))
});

gulp.task("copy-js-libs", function () {
  return gulp.src([
    "node_modules/picturefill/dist/picturefill.min.js",
    "node_modules/svg4everybody/dist/svg4everybody.min.js"
  ])
      .pipe(gulp.dest("build/js"))
});

gulp.task("css", function () {
  return gulp.src("source/sass/style.scss")
      .pipe(plumber())
      .pipe(sourcemap.init())
      .pipe(sass())
      .pipe(postcss([ autoprefixer() ]))
      .pipe(gulp.dest("build/css"))
      .pipe(csso())
      .pipe(rename("style.min.css"))
      .pipe(sourcemap.write("."))
      .pipe(gulp.dest("build/css"))
});

gulp.task("refresh", function (done) {
  server.reload();
  done();
});

gulp.task("server", function () {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("source/sass/**/*.{scss,sass}", gulp.series("css", "refresh"));
  gulp.watch("source/img/icon-*.svg", gulp.series("create-sprite", "copy-html", "refresh"));
  gulp.watch("source/*.html", gulp.series("copy-html", "refresh"));
});

gulp.task("optimize-images", function () {
  return gulp.src("build/img/**/*.{png,jpg,svg}")
      .pipe(imagemin([
        imagemin.optipng({optimizationLevel: 3}),
        imagemin.jpegtran({progressive: true}),
        imagemin.svgo()
      ]))
      .pipe(gulp.dest("build/img"))
});

gulp.task("convert-to-webp", function () {
  return gulp.src("build/img/**/*.{png,jpg}")
      .pipe(webp({quality: 90}))
      .pipe(gulp.dest("source/img"))
});

gulp.task("create-sprite", function () {
  return gulp.src([
    "build/img/icon-*.svg",
    "build/img/logo-footer.svg",
    "build/img/logo-htmlacademy.svg"
  ])
      .pipe(svgstore({
        inlineSvg: true
      }))
      .pipe(rename("sprite.svg"))
      .pipe(gulp.dest("build/img"))
});

gulp.task("copy-html", function () {
  return gulp.src("source/*.html")
      .pipe(gulp.dest("build"))
});

gulp.task("dev-build", gulp.series(
    "clean",
    "copy",
    "copy-js-libs",
    "css",
    "create-sprite",
    "copy-html"
));

gulp.task("build", gulp.series(
    "clean",
    "convert-to-webp",
    "copy",
    "copy-js-libs",
    "css",
    "optimize-images",
    "create-sprite",
    "copy-html"
));

gulp.task("start", gulp.series("build", "server"));
