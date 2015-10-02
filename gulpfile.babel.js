import gulp from 'gulp';
import browserify from 'browserify';
import babelify from 'babelify';
import source from 'vinyl-source-stream';
import watchify from 'watchify';
import browserSync from 'browser-sync';


let compile = (isWatch) => {
	let bundler = browserify('./src/js/app.js', { debug: true }).transform(babelify);

	if (isWatch) {
	  bundler = watchify(bundler);
		bundler.on('update', () => {
			console.log('-> partical bundling.');
			rebundle();
		});
	}

	rebundle();

	function rebundle() {
		bundler
		.bundle()
		.on('error', (err) => {
			console.log("Error: " + err.message);
		})
		.pipe(source('bundle.js'))
		.pipe(gulp.dest('./src/js'))
	}
};

gulp.task('browserify', () => {
	browserify('./src/js/app.js', { debug: true }).transform(babelify)
	.bundle()
	.on('error', (err) => {
		console.log("Bundle Error: " + err.message);
	})
	.pipe(source('bundle.js'))
	.pipe(gulp.dest('./src/js'))
});


gulp.task('browser-sync', () => {
	browserSync({
		server: {
			baseDir: "src"
		}
	})

	gulp.watch("src/js/bundle.js", () => {
		browserSync.reload();
	});
});

gulp.task('watch', () => {
	compile(true);
});

gulp.task('build', () => {
	compile(false);
});

gulp.task('default', ['browser-sync', 'watch']);
