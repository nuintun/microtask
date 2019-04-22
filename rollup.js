/**
 * @module rollup
 * @license MIT
 * @author nuintun
 */

'use strict';

const path = require('path');
const fs = require('fs-extra');
const terser = require('terser');
const rollup = require('rollup');
const pkg = require('./package.json');

/**
 * @function build
 * @param {Object} inputOptions
 * @param {Object} outputOptions
 */
async function build(inputOptions, outputOptions) {
  await fs.remove('dist');

  const bundle = await rollup.rollup(inputOptions);
  const { output } = await bundle.generate(outputOptions);
  const [result] = output;

  const file = outputOptions.file;
  const min = file.replace(/\.js$/i, '.min.js');
  const map = `${file}.map`;
  const minify = terser.minify(
    { 'microtask.js': result.code },
    { ie8: true, mangle: { eval: true }, sourceMap: { url: path.basename(map) } }
  );

  await fs.outputFile(file, result.code);
  console.log(`Build ${file} success!`);

  await fs.outputFile(min, banner + minify.code);
  console.log(`Build ${min} success!`);

  await fs.outputFile(map, minify.map);
  console.log(`Build ${map} success!`);
}

const banner = `/**
 * @module ${pkg.name}
 * @author ${pkg.author.name}
 * @license ${pkg.license}
 * @version ${pkg.version}
 * @description ${pkg.description}
 * @see ${pkg.homepage}
 */
`;

const inputOptions = {
  context: 'window',
  input: 'src/index.js'
};

const outputOptions = {
  banner,
  indent: true,
  strict: true,
  legacy: true,
  format: 'umd',
  name: 'microtask',
  amd: { id: 'microtask' },
  file: 'dist/microtask.js'
};

build(inputOptions, outputOptions);
