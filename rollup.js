/**
 * @module rollup
 * @license MIT
 * @version 2017/11/28
 */

'use strict';

const fs = require('fs');
const rollup = require('rollup');
const uglify = require('uglify-es');
const pkg = require('./package.json');

const banner = `/**
* @module ${pkg.name}
* @author ${pkg.author.name}
* @license ${pkg.license}
* @version ${pkg.version}
* @description ${pkg.description}
* @see ${pkg.homepage}
*/
`;

rollup
  .rollup({
    legacy: true,
    context: 'window',
    input: 'src/index.js'
  })
  .then(bundle => {
    fs.stat('dist', error => {
      if (error) {
        fs.mkdirSync('dist');
      }

      const src = 'dist/microtask.js';
      const min = 'dist/microtask.min.js';
      const map = 'microtask.js.map';

      bundle
        .generate({
          name: 'microtask',
          format: 'umd',
          indent: true,
          strict: true,
          banner: banner,
          amd: { id: 'microtask' }
        })
        .then(result => {
          fs.writeFileSync(src, result.code);
          console.log(`  Build ${src} success!`);

          result = uglify.minify(
            {
              'microtask.js': result.code
            },
            {
              ecma: 5,
              ie8: true,
              mangle: { eval: true },
              sourceMap: { url: map }
            }
          );

          fs.writeFileSync(min, banner + result.code);
          console.log(`  Build ${min} success!`);
          fs.writeFileSync(src + '.map', result.map);
          console.log(`  Build ${src + '.map'} success!`);
        })
        .catch(error => {
          console.error(error);
        });
    });
  })
  .catch(error => {
    console.error(error);
  });
