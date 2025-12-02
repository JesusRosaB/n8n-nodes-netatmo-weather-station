const gulp = require('gulp');
const path = require('path');

// Task para copiar iconos (si tienes alguno)
gulp.task('build:icons', function() {
  // Si tienes iconos personalizados en una carpeta 'icons', los copia a 'dist'
  // Si no tienes iconos, simplemente retorna una promise resuelta
  const iconPath = path.join(__dirname, 'nodes', '**', '*.{png,svg}');
  const hasIcons = require('fs').existsSync(path.join(__dirname, 'nodes'));
  
  if (hasIcons) {
    return gulp.src(iconPath)
      .pipe(gulp.dest('dist/nodes'));
  } else {
    console.log('No icons to copy');
    return Promise.resolve();
  }
});

// Task por defecto
gulp.task('default', gulp.series('build:icons'));