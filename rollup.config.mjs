import terser  from '@rollup/plugin-terser';

export default {
  input: 'src/lib/index.js',
  output: {
    file: 'dist/index.js',      // single ESM bundle
    format: 'es',
    sourcemap: true,
    plugins: [terser()]         // optional: minify
  },
  treeshake: true
};
