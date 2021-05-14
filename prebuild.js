const rimraf = require('rimraf');
const gulp = require('gulp')
rimraf('./dist', function (err) {
    // gulp.src(['database/**/*.js', 'database/**/*.json']).pipe(gulp.dest('dist/database'));
    // gulp.src(['src/**/*.graphql']).pipe(gulp.dest('dist'));
});