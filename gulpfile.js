const gulp = require('gulp');
const gutil = require('gulp-util');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const insertLines = require('gulp-insert-lines');
const sass = require('gulp-sass');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const imagemin = require('gulp-imagemin');
const imageminPngquant = require('imagemin-jpeg-recompress');
const imageminJpegRecompress = require('imagemin-jpeg-recompress');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();

gulp.task('install', function(done) {
    gulp.src('node_modules/bootstrap/scss/_variables.scss')
        .pipe(rename('_variables-reference.scss'))
        .pipe(gulp.dest('scss'));

    gulp.src(['node_modules/bootstrap/scss/bootstrap.scss'])
        .pipe(replace('@import "', '@import "../node_modules/bootstrap/scss/'))
        .pipe(insertLines({
            'before': '@import "../node_modules/bootstrap/scss/variables";',
            'lineBefore': '@import "custom";'
        }))
        .pipe(rename('_bootstrap.scss'))
        .pipe(gulp.dest('scss'));

    gulp.src(['node_modules/slick-carousel/slick/*.scss'])
        .pipe(rename({
            prefix: "_"
        }))
        .pipe(gulp.dest('scss'));

    done();
});

gulp.task('log', function() {
    gutil.log('== My Log Task ==')
});

gulp.task('sass', function(done) {
    gulp.src('scss/**/*.scss')
        .pipe(sass({outputStyle: 'expanded'}))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .on('error', gutil.log)
        .pipe(gulp.dest('css'))
        .pipe(browserSync.reload({stream:true}));

    gulp.src('scss/**/*.scss')
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(sourcemaps.init())
        .on('error', gutil.log)
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('assets/css'))
        .pipe(browserSync.reload({stream:true}))

    done();
});

gulp.task('js', function(done) {
    gulp.src([
        'node_modules/lazysizes/**/*.min.js',
        'node_modules/slick-carousel/**/*.min.js',
        'js/*.js',
        '!js/gutenberg.js',
    ])
        .pipe(uglify({compress: { unused: false } }))
        .on('error', gutil.log)
        .pipe(gulp.dest('assets/js'))
        .pipe(browserSync.reload({stream:true}))

    done();
});

gulp.task('php', function(done) {
    gulp.src('**/*.php')
        .pipe(browserSync.reload({stream:true}))

    done();
});

gulp.task('imagesreduced', function () {
    return gulp.src('images/**/*.{png,jpeg,jpg,svg,gif}')
        .pipe(imagemin())
        .pipe(gulp.dest('assets/images'));
});

gulp.task('imagescompress', function () {
    return gulp.src('images/**/*.{png,jpeg,jpg,svg,gif}')
        .pipe(imagemin([ //override the default by setting our own
            //because we overrode, we want to call all the defaults that were called behind the scene
            imagemin.optipng(), //call default for imagemin
            imagemin.svgo(), //call default for imagemin
            imagemin.gifsicle(),//call default for imagemin
            imagemin.jpegtran(),//call default for imagemin
            imageminPngquant(), //call the lossy compression for PNG
            imageminJpegRecompress()//call the lossy compression for JPEG/JPG
        ]))
        .pipe(gulp.dest('assets/images'));
});

// Static server
/*
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
});
*/

// Proxy
gulp.task('browser-sync', function(done) {
    browserSync.init({
        proxy: "localhost:8080/wpbs4/"
    });
    done();
});


gulp.task('watch', function(done) {
    gulp.watch('js/*.js', gulp.parallel('js'));
    gulp.watch('scss/**/*.scss', gulp.parallel('sass'));
    gulp.watch('**/*.php', gulp.parallel('php'));
    gulp.watch('images/**/*.{png,jpeg,jpg,svg,gif}', gulp.parallel('imagesreduced'));

    done();
});

//gulp.task('default', ['js', 'sass', 'imagesreduced', 'browser-sync', 'watch']);

gulp.task('default', gulp.parallel(['js', 'sass', 'imagesreduced', 'browser-sync', 'watch']));