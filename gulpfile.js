var gulp = require('gulp'),
	server = require('gulp-express'),
	source = require('vinyl-source-stream'),
	watchify = require('watchify'),
	browserify = require('browserify'),
	browserSync = require('browser-sync').create();

gulp.task('bundle-client', function(){
	var b = watchify(browserify({entries: ['src/bundle/client.js']}));

    b.on('update', function(){
        console.log('Update detected... Re-bundling files...');
        rebundle();
    });

    function rebundle(){
        var stream = b.bundle();
        return stream
            .pipe(source('bundle.js'))
            .pipe(gulp.dest('public/js/'));    
    };

    return rebundle();
});

gulp.task('server', function(){
	server.run(['app.js']);
});

gulp.task('default', ['server', 'bundle-client']);