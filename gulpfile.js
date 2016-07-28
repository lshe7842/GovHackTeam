var gulp = require('gulp'),
	server = require('gulp-express'),
	source = require('vinyl-source-stream'),
    sass = require('gulp-ruby-sass'),
    rename = require('gulp-rename'),
	watchify = require('watchify'),
	browserify = require('browserify');

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

gulp.task('css', function(){
    return sass('./sass/main/main.scss', { style: 'compressed' })
        .pipe(rename('styles.css'))
        .pipe(gulp.dest('./public/css'));
});

gulp.task('server', function(){
	server.run(['app.js']);

    gulp.watch('./sass/**/*.scss', ['css']);
    gulp.watch(['./public/js/*.js'], server.notify);
    gulp.watch(['./public/css/*.css'], server.notify);
    gulp.watch(['./templates/*.hbs'], server.notify);
});

gulp.task('default', ['bundle-client', 'css', 'server']);