//copy the graphqlfiles to bin/
const concat = require('gulp-concat');
const gulp = require('gulp')
gulp.src(['src/**/*.graphql'])
    .pipe(concat('devcore.graphql'))
    .pipe(gulp.dest('bin'));