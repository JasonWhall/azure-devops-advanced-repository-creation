const gulp = require("gulp");
const ts = require("gulp-typescript");

var tsProject = ts.createProject('tsconfig.json');

function build(cb) {

  tsProject.src()
    .pipe(tsProject()).js
    .pipe(gulp.src("src/**/*.html"))
    .pipe(gulp.dest("dist"));

  cb();
}

exports.default = build
