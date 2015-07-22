/*
 * grunt-teamcity
 * http://gruntjs.com/
 *
 * Copyright (c) 2015 Tobias Lundin
 * Licensed under the ISC license.
 */

'use strict';

module.exports = function(grunt){
	
	grunt.registerMultiTask('teamcity', 'Adds TeamCity blocks around each provided tasks result', function () {
		var opts = this.options({
			blockNamePrefix:''
		});
		var cb = this.async();
		var tasks = this.data.tasks || this.data;
		var flags = grunt.option.flags();

		grunt.verbose.writeflags(tasks);
		grunt.verbose.writeflags(flags);

		var taskCounter = tasks.length;

		tasks.forEach(function (task) {
			grunt.util.spawn({
				grunt: true,
				args: [task].concat(flags),
				opts: {
					stdio: ['ignore', 'pipe', 'pipe']
				}
			}, function done(err, result) {
				taskCounter--;
				grunt.log.writeln('##teamcity[blockOpened name="' + opts.blockNamePrefix + task + '"]');
				grunt.log.writeln(result);
				grunt.log.writeln('##teamcity[blockClosed name="' + opts.blockNamePrefix + task + '"]');
				if (taskCounter === 0) {
					cb();
				}
			});
		});
	});
	
};
