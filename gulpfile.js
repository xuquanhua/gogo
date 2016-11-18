/**
 * 组件安装
 * npm install gulp-imagemin gulp-sass gulp-replace gulp-minify-css gulp-rename gulp-concat gulp-clean gulp-livereload gulp-plumber --save-dev
 */

var gulp = require('gulp'),
    imagemin = require('gulp-imagemin'),
    sass = require('gulp-sass'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    plumber = require('gulp-plumber'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    minifycss = require('gulp-minify-css'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    replace = require('gulp-replace'),
    browserSync = require('browser-sync');

gulp.task('s', function() {
    browserSync({
        server: {
            baseDir: "./dist"
        }
    });
    gulp.watch('.src//sass/*.scss', ['sass']);
    gulp.watch("./src/**/*.html", ['html']);
    gulp.watch("./src/**/*.js", ['js']);
    gulp.watch("./dist/**/*.html").on('change', browserSync.reload);
});


gulp.task('html', function() {
    var htmlSrc = ['./src/*.html'],
    htmlDst = './dist';
    return gulp.src(htmlSrc)
        .pipe(gulp.dest(htmlDst));
});

gulp.task('lib_css', function() {
    var libSrc = './src/lib/*.css',
        libDst = './dist/lib';
    return gulp.src(libSrc)
                .pipe(rename({suffix: '.min'}))
                .pipe(minifycss())
                .pipe(gulp.dest(libDst));
});
gulp.task('lib_js', function() {
    var libSrc = './src/lib/*.js',
        libDst = './dist/lib';
    return gulp.src(libSrc)
                .pipe(rename({suffix: '.min'}))
                .pipe(uglify())
                .pipe(gulp.dest(libDst));
});

gulp.task('sass', function () {
    return gulp.src('./src/scss/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./src/css'));
});

gulp.task('css', ['sass'], function() {
    return gulp.src('./src/css/*.css')
        .pipe(concat('main.css'))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest('./dist/css/'));
});

gulp.task('replaceCssSrc', ['html'], function () {
    var dateString = (new Date()).getTime()+'">';
    return gulp.src(['./dist/*.html'])
                .pipe(replace(/\.css.*/g, '.min.css?v=' + dateString ))
                .pipe(gulp.dest('./dist'));
});

gulp.task('replaceJsSrc', ['replaceCssSrc'], function () {
    var dateString = new Date().getTime()+ '"></script>';
    return gulp.src(['./dist/*.html'])
                .pipe(replace(/\.js.*/g, '.min.js?v=' + dateString ))
                .pipe(gulp.dest('./dist'));
});

gulp.task('js', function() {
    var jsSrc = ['./src/lib/zepto.js','./src/lib/sm.js','./src/js/Common.js'],
        jsDst = './dist/js';
    return gulp.src(jsSrc)
        .pipe(concat('all.js'))
        .pipe(gulp.dest("./src/js"))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest(jsDst));
})

gulp.task('images', function() {
    var imgSrc = './src/images/*',
        imgDst = './dist/images';
    return gulp.src(imgSrc)
                .pipe(imagemin())
                .pipe(gulp.dest(imgDst));
})

gulp.task('clean', function() {
    return gulp.src(['./dist/css', './dist/js', './dist/images','./dist/lib'], { read: false })
                .pipe(clean());
});

gulp.task('default', ['clean'], function() {
    return gulp.start('images', 'sass', 'js', 'lib_css', 'lib_js', 'css', 'html', 'replaceCssSrc','replaceJsSrc');
});
