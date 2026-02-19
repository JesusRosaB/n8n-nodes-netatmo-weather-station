const gulp = require('gulp');
const path = require('path');
const fs = require('fs');

// Copia iconos a dist/icons para que coincida con `icon: file:../icons/...`
gulp.task('build:icons', function () {
  const iconsPath = path.join(__dirname, 'icons', '**', '*.{png,svg}');
  const hasIcons = fs.existsSync(path.join(__dirname, 'icons'));

  if (hasIcons) {
    return gulp.src(iconsPath).pipe(gulp.dest('dist/icons'));
  }

  console.log('No icons to copy');
  return Promise.resolve();
});

gulp.task('default', gulp.series('build:icons'));
