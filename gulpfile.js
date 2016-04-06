var gulp = require('gulp');
var sass = require('gulp-sass');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var imagemin = require('gulp-imagemin');
var plumber = require('gulp-plumber');
var notify = require('gulp-notify');
var livereload = require('gulp-livereload');
var uglify = require('gulp-uglify');
var babel = require('gulp-babel');
var sourcemaps = require('gulp-sourcemaps');

// error handler
var plumberErrorHandler = {errorHandler: notify.onError({
	title: 'Gulp',
	message: 'Error <%= error.message %>'
	})
};

// boilerplate a new theme
var json = require('json-file');
var cpr = require('cpr');

var themeName = json.read('./package.json').get('themeName');
var themeDir = '../' + themeName;

gulp.task('init', function(){
	cpr('./theme_boilerplate', themeDir, function(err, files){
		console.log('theme files and directories structure succefully created');
	});
	
	cpr('./package.json', themeDir, function(err, files){
		console.log('package.json file succefully copied');
	});

	cpr('./gulpfile.js', themeDir, function(err, files){
		console.log('gulpfile.js file succefully copied');
	});

	cpr('./.babelrc', themeDir, function(err, files){
		console.log('.babelrc file succefully copied');
	});

});

// tasks

gulp.task('sass', function(){
	gulp.src('./css/src/*.scss')
		.pipe(plumber(plumberErrorHandler))
		.pipe(sass())
		.pipe(gulp.dest('./css'))
		.pipe(livereload());
});

gulp.task('js', function(){
	gulp.src('./js/src/*.js')
		.pipe(plumber(plumberErrorHandler))
		.pipe(sourcemaps.init())
		.pipe(babel())
		.pipe(jshint())
		.pipe(jshint.reporter('fail'))
		.pipe(concat('theme.js'))
		.pipe(uglify())
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('./js'))
		.pipe(livereload());
});

gulp.task('img', function(){
	gulp.src('./img/src/*.{png,jpg,gif}')
		.pipe(plumber(plumberErrorHandler))
		.pipe(imagemin({
			optimizationLevel: 1,
			progressive: true
		}))
		.pipe(gulp.dest('./img'))
		.pipe(livereload());
});

gulp.task('php', function(){
	gulp.src('./*.php')
		.pipe(livereload());
});

gulp.task('watch', function(){
	livereload.listen();
	gulp.watch('./css/src/*.scss', ['sass']);
	gulp.watch('./js/src/*.js', ['js']);
	gulp.watch('./img/src/*.{png,jpg,gif}', ['img']);
	gulp.watch('./*.php', ['php']);
});



gulp.task('default', ['sass', 'js', 'img', 'php', 'watch']); 







