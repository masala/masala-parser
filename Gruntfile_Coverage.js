'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    nodeunit: {
      files: ['test/**/*_test.js'],
      options: {
        reporter: 'lcov',
        reporterOutput:'lib-cov/report'
      }
    },
    jscoverage: {
        lib: {
            expand: true,
            cwd: 'lib/',
            src: ['**/*.js'],
            dest: 'lib-cov/',
            ext: '.js',
        },
        options: {
            // Nothing
        }
    },      
    env: {
        coverage: {
            add: {
                COVERAGE: '-cov'
            },
        }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks("grunt-jscoverage");
  grunt.loadNpmTasks('grunt-env');    
  
  // Tasks
  grunt.registerTask('default', ['env:coverage', 'nodeunit']);
};
