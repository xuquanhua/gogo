/**
 * 组件安装
 */

// 引入 gulp及组件
var gulp = require('gulp'), //基础库
    rename = require('gulp-rename'), //重命名
    concat = require('gulp-concat'), //合并文件
    clean = require('gulp-clean'), //清空文件夹
    replace = require('gulp-replace'), //字符串替换
    gutil = require('gulp-util'), //抛错误
    minifycss = require('gulp-minify-css'),
    uglify = require('gulp-uglify'), //js压缩
    gulpSequence = require('gulp-sequence'),
    gulpif = require('gulp-if'),
    cheerio = require('gulp-cheerio'),
    run = require('gulp-run'),
    webpack = require('webpack'),
    webpackConfig = require('./webpack.config.js'),
    md5 = require('gulp-md5-plus');

var srcDst = './src/';
var relDst = './dist/';
var nestedSrc = function() {
    var temp = false;
    if (process.argv.indexOf('--uglify') !== -1) {
        temp = true;
    }
    return temp
};
// HTML处理
gulp.task('html', function() {
    var Src = [srcDst + './**/*.html'],
        Dst = relDst + './';
    return gulp.src(Src)
        .pipe(cheerio({
            run: function($) {
                var replace = $('script[compress]').remove();
                var tempArray = [];
                var tempStr;
                for (var i = 0, length = replace.length; i < length; i++) {
                    tempStr = $(replace[i]).attr('compress');
                    console.log(tempStr);
                    if (tempArray.indexOf(tempStr) === -1) {
                        $('body').append('<script src="' + tempStr + '"></script>');
                        tempArray.push(tempStr);
                    }
                }
            },
            parserOptions: {
                decodeEntities: false
            }
        }))
        .pipe(gulp.dest(Dst));
});

//目前只对单个css压缩
gulp.task('css', function() {
    var Src = srcDst + 'css/**/*.*',
        Dst = relDst + 'css/';
    return gulp.src(Src)
        .pipe(gulpif(nestedSrc, minifycss()))
        .pipe(gulp.dest(Dst));
});

//js concat index
gulp.task('index_js', function() {
    var Src = ['./src/js/index/a.js', './src/js/index/b.js'],
        Dst = relDst + 'js/index/';
    return gulp.src(Src)
        .pipe(concat('all.js'))
        .pipe(gulpif(nestedSrc, uglify()))
        .pipe(gulp.dest(Dst));
});

//目前只对单个js压缩(少了lib)
gulp.task('js', function() {
    var Src = srcDst + 'js/*.*',
        Dst = relDst + 'js/';
    return gulp.src(Src)
        .pipe(gulpif(nestedSrc, uglify()))
        .pipe(gulp.dest(Dst));
});

//复制images
gulp.task('images', function() {
    var Src = srcDst + 'images/**/*.*',
        Dst = relDst + 'images/';
    return gulp.src(Src)
        .pipe(gulp.dest(Dst));
});

//给js加md5并插入hmtl里
gulp.task('md5:js', function(done) {
    gulp.src([relDst + 'js/**/*.js', '!' + relDst + 'js/log/**/*.js'])
        .pipe(md5(10, relDst + './**/*.html'))
        .pipe(gulp.dest(relDst+ 'js/'))
        .on('end', done);
});

//给css加md5并插入hmtl里
gulp.task('md5:css', function(done) {
    gulp.src(relDst + 'css/**/*.css')
        .pipe(md5(10, relDst + './**/*.html'))
        .pipe(gulp.dest(relDst+ 'css/'))
        .on('end', done);
});

// 清空图片、样式、js
gulp.task('clean', function() {
    return gulp.src([relDst], { read: false })
        .pipe(clean({ force: true }));
});

var myDevConfig = Object.create(webpackConfig);
var devCompiler = webpack(myDevConfig);

//引用webpack对js进行操作
gulp.task("build-js",  function(callback) {
    devCompiler.run(function(err, stats) {
        if(err) throw new gutil.PluginError("webpack:build-js", err);
        gutil.log("[webpack:build-js]", stats.toString({
            colors: true
        }));
        callback();
    });
});




// gulp test --uglify
gulp.task('test', gulpSequence("clean", 'css','images', 'js', "build-js", 'html', 'md5:css', 'md5:js'));
