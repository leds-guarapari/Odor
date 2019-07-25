const { task, src, dest, series } = require("gulp");
const concat = require("gulp-concat");
const eslint = require("gulp-eslint");
const exec = require("gulp-exec");
const htmlmin = require("gulp-htmlmin");
const terser = require("gulp-terser");

/**
 * 
 * Task of minified from source and generate distribution file.
 * 
 */
task("minified", function() {
 return src(["src/firebase.js", "src/index.js"])
  .pipe(concat("index.min.js"))
  .pipe(eslint())
  .pipe(terser())
  .pipe(dest("public/"));
});

/**
 * 
 * Task of build from source and generate distribution file.
 * 
 */
task("build", function() {
 return src("src/index.html")
  .pipe(htmlmin({collapseWhitespace: true}))
  .pipe(dest("public/"));
});

/**
 * 
 * Default task.
 * 
 */
task("default", series("minified", "build"));