'use strict';

module.exports = function(grunt) {
    
  // Project configuration.
  grunt.initConfig({
    clean: [
        'test/coverage/'
    ],
    nodeunit: {
      files: ['test/**/*_test.js']
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      gruntfile: {
        src: ['Gruntfile_*.js'],
      },
      src: {
        src: ['lib/**/*.js']
      },
      test: {
        src: ['test/**/*.js']
      },
    },
    env: {
      coverage: {
        APP_DIR_FOR_CODE_COVERAGE: '../test/coverage/instrument/lib/'
      }
    },
    instrument: {
      files: 'lib/**/*.js',
      options: {
        lazy: true,
        basePath: 'test/coverage/instrument/'
      }
    },
    storeCoverage: {
      options: {
        dir: 'test/coverage/reports'
      }
    },
    makeReport: {
      src: 'test/coverage/reports/**/*.json',
      options: {
        type: 'lcov',
        dir: 'test/coverage/reports'
      }
    }  
  });

  grunt.loadNpmTasks('grunt-istanbul');
  grunt.loadNpmTasks('grunt-env');        
  grunt.loadNpmTasks('grunt-contrib-clean');        
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');  
  grunt.loadNpmTasks('grunt-exec');    
    
  grunt.registerTask('default', 
                     ['clean',
                      'jshint', 
                      'nodeunit']);
    
  grunt.registerTask('coverage', 
                     ['env:coverage', 
                      'instrument', 
                      'nodeunit',
                      'storeCoverage', 
                      'makeReport']);
};

