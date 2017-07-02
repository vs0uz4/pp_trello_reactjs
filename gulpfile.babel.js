/*
* Importing Packages
*/

import gulp from 'gulp'
import notify from 'gulp-notify'
import connect from 'gulp-connect'
import livereload from 'gulp-livereload'
import changed from 'gulp-changed'
import util from 'gulp-util'
import concat from 'gulp-concat'
import plumber from 'gulp-plumber'
import imagemin from 'gulp-imagemin'
import minifyCss from 'gulp-minify-css'
import minifyHtml from 'gulp-minify-html'
import uglify from 'gulp-uglify'
import sass from 'gulp-sass'
import rev from 'gulp-rev'
import revCollector from 'gulp-rev-collector'
import babel from 'gulp-babel'
import del from 'del'

/*
* Defining Constants
*/

const PATH = {
    htmlSrc: 'src/',
    sassSrc: 'src/styles',
    imgSrc: 'src/images',
    jsSrc: 'src/javascripts',

    buildDir: 'build/',
    revDir: 'rev/',
    distDir: 'dist/'
}

const onError = (Error) => {
    util.beep()
    util.log(util.colors.red(Error))
}

const igniteServer = () => {
    return connect.server({
        root: 'src',
        livereload: true
    })
}

/*
* Defining Tasks
*/

gulp.task('build-html', () => {
    return gulp
            .src(PATH.htmlSrc.concat('**/*.html'))
            .pipe(gulp.dest(PATH.buildDir.concat('/')))
            .pipe(livereload())
})

gulp.task('build-css', () => {
    return gulp
        .src(PATH.sassSrc.concat('**/*.scss'))
        .pipe(sass({
            includePaths: require('node-neat').includePaths,
            style: 'nested',
            onError: () => {
                console.log('Opps!! Something happens when compile SASS')
            }
        }))
        .pipe(plumber({ errorHandler: onError}))
        .pipe(gulp.dest(PATH.buildDir.concat('/css')))
        .pipe(livereload())
})

gulp.task('build-js', () => {
    return gulp
        .src(PATH.jsSrc.concat('*.js'))
        .pipe(plumber({ errorHandler: onError }))
        .pipe(changed(PATH.buildDir.concat('/js')))
        .pipe(gulp.dest(PATH.buildDir.concat('/js')))
        .pipe(livereload())
})

gulp.task('build-img', () => {
    return gulp
        .src(PATH.imgSrc.concat('**/*.+(png|jpg|jpeg|gif|svg)'))
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(changed(PATH.buildDir.concat('/images')))
        .pipe(gulp.dest(PATH.buildDir.concat('/images')))
        .pipe(livereload())
})

gulp.task('watch', () => {
    livereload.listen(35729)
    gulp.watch(PATH.htmlSrc.concat('/*.html'), ['build-html'])
    gulp.watch(PATH.sassSrc, ['build-css'])
    gulp.watch(PATH.jsSrc.concat('**/*.js'), ['build-js'])
    gulp.watch(PATH.imgSrc.concat('**/*.+(png|jpg|jpeg|gif|svg)'), ['build-img'])
})

gulp.task('build', ['build-html', 'build-css', 'build-js', 'build-img'], () =>{
    return igniteServer()
})

const ENV = process.env.SERVER_ENV || 'development'

if (ENV === 'development') {
    gulp.task('default', ['build', 'watch'])
}