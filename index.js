/*
 * grunt-teamcity
 * http://gruntjs.com/
 *
 * Copyright (c) 2015 Tobias Lundin
 * Licensed under the ISC license.
 */

'use strict';

module.exports = function(grunt){
	
	grunt.registerMultiTask('teamcity', 'Adds TeamCity blocks around each task', function () {
		var opts = this.options({
			blockNamePrefix:'',
			teamCityBlockOpen: '##teamcity[blockOpened name="',
			teamCityBlockClose: '##teamcity[blockClosed name="'
		});
		var cb = this.async();
		var tasks = this.data.tasks || this.data;
		var flags = grunt.option.flags();

		grunt.verbose.writeln(JSON.stringify(opts));
		grunt.verbose.writeflags(tasks);
		grunt.verbose.writeflags(flags);

		var taskCounter = tasks.length;

		tasks.forEach(function (task) {
			grunt.verbose.oklns('Spawn task: ' + task);
			grunt.util.spawn({
				grunt: true,
				args: [task].concat(flags),
				opts: {
					stdio: ['ignore', 'pipe', 'pipe']
				}
			}, function done(err, result) {
				taskCounter--;
				grunt.log.writeln(opts.teamCityBlockOpen + opts.blockNamePrefix + task + '"]');
				grunt.log.writeln(result);
				grunt.log.writeln(opts.teamCityBlockClose + opts.blockNamePrefix + task + '"]');
				if (taskCounter === 0) {
					cb();
				}
			});
		});
	});
	
};
