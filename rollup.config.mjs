import terser  from '@rollup/plugin-terser';

export default {
  input: 'src/lib/index.js',
  output: {
    file: 'dist/masala-parser.js',      // single ESM bundle
    format: 'es',
    sourcemap: true,
    plugins: [
      terser({
        format: {
          comments: false // 🔥 Removes ALL comments
        },
        compress: false, // 🚫 Don't compress
        mangle: false    // 🚫 Don't rename variables
      })
    ]
  },
  treeshake: false
};
