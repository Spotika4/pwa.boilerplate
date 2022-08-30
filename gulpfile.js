


const gulp = require('gulp'),
	webserver = require('browser-sync'),                        // сервер для работы и автоматического обновления страниц
	plumber = require('gulp-plumber'),                          // модуль для отслеживания ошибок
	rigger = require('gulp-rigger'),                            // модуль для импорта содержимого одного файла в другой
	sourcemaps = require('gulp-sourcemaps'),                    // модуль для генерации карты исходных файлов
	sass = require('gulp-sass')(require('sass')),               // модуль для компиляции SASS (SCSS) в CSS
	autoprefixer = require('gulp-autoprefixer'),                // модуль для автоматической установки автопрефиксов
	cleanCSS = require('gulp-clean-css'),                       // плагин для минимизации CSS
	cache = require('gulp-cache'),                              // модуль для кэширования
	del = require('del'),                                       // модуль для удаления файлов и каталогов
	rename = require('gulp-rename')                             //
;


const path = {
	dist: {
		css: 'dist/css/',
		img: 'dist/img/',
		fonts: 'dist/fonts/'
	},
	build: {
		html: 'build/',
		css: 'build/css/',
		img: 'build/img/',
		fonts: 'build/fonts/'
	},
	src: {
		html: 'src/*.html',
		scss: 'src/sass/main.scss',
		img: 'src/img/**/*.*',
		fonts: 'src/fonts/*.*'
	},
	watch: {
		html: 'src/**/*.html',
		scss: 'src/sass/*.scss',
		img: 'src/img/**/*.*',
		fonts: 'src/fonts/*.*'
	},
	clean: {
		build: './build/*',
		dist: './dist/*'
	}
};


gulp.task('webserver', function () {
	webserver({
		server: {
			baseDir: './build'
		},
		notify: false
	});
});


gulp.task('html:build', function () {
	return gulp.src(path.src.html)                              // выбор всех html файлов по указанному пути
		.pipe(plumber())                                        // отслеживание ошибок
		.pipe(rigger())                                         // импорт вложений
		.pipe(gulp.dest(path.build.html))                       // выкладывание готовых файлов
		.pipe(webserver.reload({ stream: true }));              // перезагрузка сервера
});


gulp.task('css:build', function () {
	return gulp.src(path.src.scss)                              // получим main.scss
		.pipe(sass())                                           // scss -> css
		.pipe(plumber())                                        // для отслеживания ошибок
		.pipe(sourcemaps.init())                                // инициализируем sourcemap
		.pipe(autoprefixer())                                   // добавим префиксы
		.pipe(gulp.dest(path.build.css))
		.pipe(sourcemaps.write('./'))                           // записываем sourcemap
		.pipe(gulp.dest(path.build.css))                        // выгружаем в build
		.pipe(webserver.reload({ stream: true }));              // перезагрузим сервер
});


gulp.task('css:dist', function () {
	return gulp.src(path.src.scss)                              // получим main.scss
		.pipe(sass())                                           // scss -> css
		.pipe(plumber())                                        // для отслеживания ошибок
		.pipe(sourcemaps.init())                                // инициализируем sourcemap
		.pipe(autoprefixer())                                   // добавим префиксы
		.pipe(gulp.dest(path.dist.css))
		.pipe(rename({ suffix: '.min' }))
		.pipe(cleanCSS())                                       // минимизируем CSS
		.pipe(sourcemaps.write('./'))                           // записываем sourcemap
		.pipe(gulp.dest(path.dist.css))                         // выгружаем в dist
		.pipe(webserver.reload({ stream: true }));              // перезагрузим сервер
});


gulp.task('fonts:build', function () {
	return gulp.src(path.src.fonts)
		.pipe(gulp.dest(path.build.fonts))
});


gulp.task('fonts:dist', function () {
	return gulp.src(path.src.fonts)
		.pipe(gulp.dest(path.dist.fonts));
});


gulp.task('image:build', function () {
	return gulp.src(path.src.img)
		.pipe(gulp.dest(path.build.img))
});


gulp.task('image:dist', function () {
	return gulp.src(path.src.img)
		.pipe(gulp.dest(path.dist.img));
});


gulp.task('clean:build', function () {
	return del(path.clean.build);
});


gulp.task('clean:dist', function () {
	return del(path.clean.dist);
});


gulp.task('cache:clear', function () {
	cache.clearAll();
});


gulp.task('dist',
	gulp.series('clean:dist',
		gulp.parallel(
			'css:dist',
			'fonts:dist',
			'image:dist'
		)
	)
);


gulp.task('build',
	gulp.series('clean:build',
		gulp.parallel(
			'html:build',
			'css:build',
			'fonts:build',
			'image:build'
		)
	)
);


gulp.task('watch', function () {
	gulp.watch(path.watch.html, gulp.series('html:build'));
	gulp.watch(path.watch.scss, gulp.series('css:build'));
	gulp.watch(path.watch.img, gulp.series('image:build'));
	gulp.watch(path.watch.fonts, gulp.series('fonts:build'));
});


gulp.task('default', gulp.series(
	'build',
	gulp.parallel('webserver','watch')
));
