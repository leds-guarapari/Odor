const { task, src, dest, series, parallel } = require("gulp");
const csso = require("gulp-csso");
const eslint = require("gulp-eslint");
const htmlmin = require("gulp-htmlmin");
const rename = require("gulp-rename");
const terser = require("gulp-terser");

/**
 * 
 * Task of copy from images and generate distribution files.
 * 
 */
task("images", function () {
  return src(["images/*.png", "images/*.jpg", "images/*.ico"])
    .pipe(dest("public/images/"));
});

/**
 * 
 * Tasks of build from libraries and generate public files.
 * 
 */
task("lib/exceljs", () => {
  return src("node_modules/exceljs/dist/exceljs.min.js")
    .pipe(dest("public/lib/exceljs/dist/"));
});
task("lib/firebase", () => {
  return src(["node_modules/firebase/firebase-app.js",
    "node_modules/firebase/firebase-app.js.map",
    "node_modules/firebase/firebase-auth.js",
    "node_modules/firebase/firebase-auth.js.map",
    "node_modules/firebase/firebase-database.js",
    "node_modules/firebase/firebase-database.js.map"])
    .pipe(dest("public/lib/firebase/"));
});
task("lib/glide", () => {
  return src(["node_modules/@glidejs/glide/dist/glide.min.js",
    "node_modules/@glidejs/glide/dist/css/glide.core.min.css",
    "node_modules/@glidejs/glide/dist/css/glide.theme.min.css"])
    .pipe(dest("public/lib/glide/dist/"));
});
task("lib/googlemaps", () => {
  return src("node_modules/@googlemaps/js-api-loader/dist/index.min.js")
    .pipe(dest("public/lib/googlemaps/dist/"));
});
task("lib/material-components-web", () => {
  return src(["node_modules/material-components-web/dist/material-components-web.min.css",
    "node_modules/material-components-web/dist/material-components-web.min.css.map",
    "node_modules/material-components-web/dist/material-components-web.min.js"])
    .pipe(dest("public/lib/material-components-web/dist/"));
});
task("lib/material-design-icons", () => {
  return src(["node_modules/material-design-icons/iconfont/MaterialIcons-Regular.eot",
    "node_modules/material-design-icons/iconfont/MaterialIcons-Regular.ijmap",
    "node_modules/material-design-icons/iconfont/MaterialIcons-Regular.svg",
    "node_modules/material-design-icons/iconfont/MaterialIcons-Regular.ttf",
    "node_modules/material-design-icons/iconfont/MaterialIcons-Regular.woff",
    "node_modules/material-design-icons/iconfont/MaterialIcons-Regular.woff2"])
    .pipe(dest("public/lib/material-design-icons/iconfont/"));
});
task("lib/material-icons", () => {
  return src("node_modules/material-design-icons/iconfont/material-icons.css")
    .pipe(csso())
    .pipe(rename("material-icons.min.css"))
    .pipe(dest("public/lib/material-design-icons/iconfont/"));
});
task("lib/moment", () => {
  return src("node_modules/moment/min/moment.min.js")
    .pipe(dest("public/lib/moment/"));
});
task("lib/moment", () => {
  return src("node_modules/moment/min/moment.min.js")
    .pipe(dest("public/lib/moment/"));
});
task("lib/moment-duration-format", () => {
  return src("node_modules/moment-duration-format/lib/moment-duration-format.js")
    .pipe(rename("moment-duration-format.min.js"))
    .pipe(terser())
    .pipe(dest("public/lib/moment-duration-format/"));
});
task("lib/polyfill", () => {
  return src("node_modules/@babel/polyfill/dist/polyfill.min.js")
    .pipe(dest("public/lib/polyfill/dist/"));
});

/**
 * 
 * Task of minified from code sources and generate distribution files.
 * 
 */
task("minified/controls", function () {
  return src("src/controls/*.js")
    .pipe(eslint())
    .pipe(terser())
    .pipe(rename({
      prefix: "controls.",
      suffix: ".min"
    }))
    .pipe(dest("public/js/"));
});
task("minified/models", function () {
  return src("src/models/*.js")
    .pipe(eslint())
    .pipe(terser())
    .pipe(rename({
      prefix: "models.",
      suffix: ".min"
    }))
    .pipe(dest("public/js/"));
});
task("minified/services", function () {
  return src("src/services/*.js")
    .pipe(eslint())
    .pipe(terser())
    .pipe(rename({
      prefix: "services.",
      suffix: ".min"
    }))
    .pipe(dest("public/js/"));
});
task("minified/views", function () {
  return src("src/views/*.js")
    .pipe(eslint())
    .pipe(terser())
    .pipe(rename({
      prefix: "views.",
      suffix: ".min"
    }))
    .pipe(dest("public/js/"));
});

/**
 * 
 * Task of build from page sources and generate distribution files.
 * 
 */
task("build", function () {
  return src("src/pages/*.html")
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(dest("public/"));
});

/**
 * 
 * Default task.
 * 
 */
task("default", series("images", parallel("lib/exceljs", "lib/firebase", "lib/glide", "lib/googlemaps", "lib/material-components-web", "lib/material-design-icons", "lib/material-icons", "lib/moment", "lib/moment-duration-format", "lib/polyfill"), parallel("minified/controls", "minified/models", "minified/services", "minified/views"), "build"));