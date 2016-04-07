import gulp from 'gulp';
import sass from 'gulp-sass';
import concat from 'gulp-concat';
import imagemin from 'gulp-imagemin';
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';
import uglify from 'gulp-uglify';
import babel from 'gulp-babel';
import sourcemaps from 'gulp-sourcemaps';
import cssnano from 'gulp-cssnano';
import eslint from 'gulp-eslint';

import browserSync from 'browser-sync';
// browserSync.create;
const reload = browserSync.reload;

// error handler
let plumberErrorHandler = {errorHandler: notify.onError({
	title: 'Gulp',
	message: 'Error <%= error.message %>'
	})
};

// boilerplate a new theme
import json from 'json-file';
import cpr from 'cpr';

let themeName = json.read('./package.json').get('themeName');
let themeDir = '../' + themeName;


// Init task to create a new theme
gulp.task('init', () => {
	cpr('./theme_boilerplate', themeDir, (err, files) => {
		console.log('theme files and directories structure succefully created');
	});
	
	cpr('./package.json', themeDir, (err, files) => {
		console.log('package.json file succefully copied');
	});

	cpr('./gulpfile.js', themeDir, (err, files) => {
		console.log('gulpfile.js file succefully copied');
	});

	cpr('./.babelrc', themeDir, (err, files) => {
		console.log('.babelrc file succefully copied');
	});

});

// tasks

gulp.task('sass', function(){
	gulp.src('./css/src/*.scss')
		.pipe(plumber(plumberErrorHandler))
		.pipe(sourcemaps.init())
		.pipe(sass.sync({
      		outputStyle: 'expanded',//comment this 3 lines an uncomment cssnano for minify the css
      		precision: 10, //
      		includePaths: ['.'] //
    	}))
        // .pipe(cssnano())
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('./css'))
		.pipe(reload({stream: true}))
		.pipe(notify({ message: 'Custom sass task complete', onLast: true }));

	});

gulp.task('js', () => {
	gulp.src('./js/src/*.js')
		.pipe(plumber(plumberErrorHandler))
		.pipe(sourcemaps.init())
		.pipe(babel())
		.pipe(concat('theme.js'))
		.pipe(uglify())
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('./js'))
		.pipe(reload({stream: true}))
		.pipe(notify({ message: 'Custom scripts task complete', onLast: true }));

	});

gulp.task('img', () => {
	gulp.src('./img/src/*.{png,jpg,gif}')
		.pipe(plumber(plumberErrorHandler))
		.pipe(imagemin({
			optimizationLevel: 1,
			progressive: true
		}))
		.pipe(gulp.dest('./img'))
		.pipe(reload({stream: true}))	
		.pipe(notify({ message: 'Custom image task complete', onLast: true }));

	});

gulp.task('lint', () => {
	gulp.src(['./js/*.js','!node_modules/**'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('serve', ['sass', 'js', 'img', 'lint'], () => {
	browserSync.init({
        proxy: 'http://localhost:8888/'
    });
	gulp.watch('./css/src/*.scss', ['sass']);
	gulp.watch('./js/src/*.js', ['lint', 'js']);
	gulp.watch('./img/src/*.{png,jpg,gif}', ['img']);
	gulp.watch('./*.php').on('change', reload);
	gulp.watch('./**/*.php').on('change', reload);
});

gulp.task('default', ['serve']); 



