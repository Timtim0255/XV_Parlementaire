var gulp = require("gulp");
var babel = require("gulp-babel");
var browserSync = require("browser-sync").create();
var sass = require("gulp-sass");
var concat = require("gulp-concat");
var rename = require("gulp-rename");
var autoprefixer = require("gulp-autoprefixer");
var fancylog = require("fancy-log");
var cleanCSS = require("gulp-clean-css");

// Uglify and minify JS
var jsSource = "js",
  jsDest = "dist/js";

function build_javascript() {
  return gulp
    .src(["js/lib/*.js", "js/*.js", "!js/generated.js"])
    .pipe(babel())
    .on("error", fancylog.error)
    .pipe(concat("generated.js"))
    .on("error", fancylog.error)
    .pipe(gulp.dest(jsSource))
    .pipe(rename("app.min.js"))
    .pipe(gulp.dest(jsDest))
    .pipe(browserSync.stream());
}

// Compile sass into CSS & auto-inject into browsers
function build_sass() {
  return gulp
    .src("scss/**/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(autoprefixer())
    .pipe(cleanCSS({ compatibility: "ie8" }))
    .pipe(gulp.dest("dist/css"))
    .pipe(browserSync.stream());
}

// Static Server + watching scss/php/js files
function watch(done) {
  // BrowserSync hmr
  browserSync.init({
    proxy: "localhost:8880",
    open: false,
    ghostMode: false,
    // notify: false,
  });

  gulp.watch("scss/**/*.scss", build_sass);
  gulp.watch(["js/**/*.js", "!js/generated.js"], build_javascript);
  gulp.watch("*.php").on("change", browserSync.reload);

  done();
}

exports.default = gulp.series(build_sass, build_javascript, watch);
