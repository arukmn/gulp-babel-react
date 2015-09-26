import gulp from 'gulp';
import browserify from 'browserify';
import babelify from 'babelify';
import source from 'vinyl-source-stream';
import watchify from 'watchify';
import browserSync from 'browser-sync';

gulp.task('default', () => {
	console.log("default log");
});

let watching = false;
gulp.task('enable-watch', () => {
	watching = true;
	compile(watching);
});

gulp.task('disable-watch', () => {
	watching = false;
	compile(watching);
});


let compile = (isWatch) => {
	let bundler = watchify(browserify('./src/app.jsx', { debug: true }).transform(babelify));

	if (isWatch) {
//	  bundler = watchify(browserify('./src/app.jsx', { debug: true }).transform(babelify));
		bundler.on('update', () => {
			console.log('-> partical bundling.');
			rebundle();
		});
	} else {
//	  bundler = browserify('./src/app.jsx', { debug: true }).transform(babelify);
	}

	function rebundle() {
		bundler
		.bundle()
		.on('error', (err) => {
			console.log("Error: " + err.message);
		})
		.pipe(source('bundle.js'))
		.pipe(gulp.dest('./built'))
	}

	rebundle();
};

gulp.task('browserify', () => {
	browserify('./src/app.jsx', { debug: true }).transform(babelify)
	.bundle()
	.on('error', (err) => {
		console.log("Error: " + err.message);
	})
	.pipe(source('bundle.js'))
	.pipe(gulp.dest('./built'))
	.pipe(browserSync.reload())
});

//gulp.task('browser-sync', () => {
//	browserSync({
//		server:
//			baseDir: "./src"
//	});
//});

gulp.task('watch', ['enable-watch']);
gulp.task('unwatch', ['disable-watch']);

gulp.task('default', ['browserify']);
