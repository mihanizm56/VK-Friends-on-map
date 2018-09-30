const gulp = require('gulp');
const concatCss = require('gulp-concat-css');
const cleanCss = require('gulp-clean-css');
const rename = require('gulp-rename');
const rimraf = require('rimraf');
const browserify = require('browserify')
const babel = require('gulp-babel');
const source = require('vinyl-source-stream');
const browserSync = require("browser-sync");
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const reload = browserSync.reload;

// конфиг для browserSync
const config = {
  server: {
    baseDir: "./build/"
  },
  tunnel: true,
  host: 'localhost',
  port: 8080,
  logPrefix: "mihanizm56"
};

const path = {
  build: { //Тут мы укажем куда складывать готовые после сборки файлы
    html: 'build/',
    js: 'build/js/',
    css: 'build/css/',
    img: 'build/img/'
  },
  src: { //Пути откуда брать исходники
    html: 'src/index.html', 
    js: 'src/js/app-start.js',
    css: 'src/css/main.css',
    img: 'src/img/*.png'
  },
  watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
    html: 'src/index.html',
    js: 'src/js/*.js',
    css: 'src/css/main.css',
  },
  clean: './build', //Тут мы укажем путь для очистки
  transpile: 'build/js/bundle.js'
};


gulp.task('test', function () {
  console.log('Пройден тест галпа!')
});


gulp.task('clean', function (cb) {
  rimraf(path.clean, cb);
});


gulp.task('html', function () {
  return gulp.src(path.src.html) //Выберем файлы по нужному пути
    .pipe(gulp.dest(path.build.html)) //Выплюнем их в папку build
    .pipe(reload({ stream: true })); //И перезагрузим наш сервер для обновлений
});


gulp.task('css', function () {
  return gulp.src(path.src.css)
    .pipe(concatCss('bundle.css'))
    .pipe(cleanCss({ compatibility: 'ie8' }))
    .pipe(rename('bundle.min.css'))
    .pipe(gulp.dest(path.build.css));
});


gulp.task('img', function () {
  gulp.src(path.src.img) //Выберем наши картинки
    .pipe(imagemin({ //Сожмем их
      progressive: true,
      svgoPlugins: [{ removeViewBox: false }],
      use: [pngquant()],
      interlaced: true
    }))
    .pipe(gulp.dest(path.build.img)) //И бросим в build
    .pipe(reload({ stream: true }));
});

gulp.task('scripts', function () {
  return browserify(path.src.js)
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest(path.build.js));
});


gulp.task('scripts:transpile', () => {
  return gulp.src(path.transpile)
    .pipe(babel({ presets: ['es2015'] }))
    .pipe(gulp.dest(path.build.js));
});


gulp.task('build', [
  'html',
  'img',
  'css',
  'scripts'
]);


gulp.task('webserver', function () {
  browserSync(config);
});


gulp.task('watch', function () {
  gulp.watch([path.watch.html], function () {
    gulp.start('html');
  });
  gulp.watch([path.watch.css], function () {
    gulp.start('css');
  });
  gulp.watch([path.watch.js], function () {
    gulp.start('scripts');
  })
});


gulp.task('default', ['build', 'webserver', 'watch']);