'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Configuration to be run
    teamcity: {
      myTask: {
        tasks: ['myTask']
      },
      multiTask: {
        tasks: ['myTask', 'myAsyncTask', 'myFinalTask']
      },
      withOpts : {
        options: { blockNamePrefix: 'myPreFixTo ' },
        tasks: ['myTask']
      },
      runSync:{
        options: { runAsync: false },
        tasks: ['myAsyncTask', 'myTask']
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_tests.js']
    }
  });
  
  // register some test tasks
  grunt.registerTask('myTask', function(){
    grunt.log.writeln('this is my task');
  });
  grunt.registerTask('myAsyncTask', function(){
    var done = this.async();
    setTimeout(function(){
      grunt.log.writeln('this is my task');
      done();
    }, 150);
  });
  grunt.registerTask('myFinalTask', function(){
    grunt.log.oklns('this is my final task');
  });
  
  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  grunt.registerTask('test', ['jshint', 'nodeunit']);
  grunt.registerTask('default', ['test']);

};
