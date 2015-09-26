import gulp from 'gulp';
import browserify from 'browserify';
import babelify from 'babelify';
import source from 'vinyl-source-stream';

gulp.task('default', () => {
	console.log("default log");
});

gulp.task('build', () => {
	browserify('./src/app.jsx', { debug: true })
		.transform(babelify)
		.bundle()
		.on('error', (err) => {
			console.debug("Error: " + err.message);
		})
		.pipe(source('bundle.js'))
		.pipe(gulp.dest('./built'))
});

gulp.task('default', ['build']);
