import gulp from 'gulp';
import browserify from 'browserify';
import source from 'vinyl-source-stream';
import bower from 'gulp-bower';

const CLIENT_ROOT = 'client';
const PUBLIC_ROOT = 'public';
const paths = {
  static_files: 'client/**/*.html',
  entry: 'client/src/app.js',
  src: 'client/src/**/*',
  bower: 'public/lib'
};
const static_files = 'app/**/*.html';

gulp.task('bower', function() {
  return bower()
    .pipe(gulp.dest(paths.bower));
});

gulp.task('default', ['build', 'watch']);

gulp.task('move-static', () => {
  return gulp.src(paths.static_files)
    .pipe(gulp.dest(PUBLIC_ROOT));
});

gulp.task('transpile', () => {

  return browserify(paths.entry)
    .transform('babelify')
    .bundle()
    .on('error', function(error){
      console.error( '\nError: ', error.message, '\n');
      this.emit('end');
    })
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('public'));
});

gulp.task('build', ['bower', 'transpile', 'move-static']);

gulp.task('watch', ['transpile'], () => {
  gulp.watch([paths.src, static_files], ['transpile', 'move-static']);
});