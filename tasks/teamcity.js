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
			blockNamePrefix:'',
			runAsync: true
		});
		var cb = this.async();
		var tasks = this.data.tasks || this.data;
		var flags = grunt.option.flags();

		grunt.verbose.writeflags(tasks);
		grunt.verbose.writeflags(flags);

		var taskCounter = tasks.length;
		if(opts.runAsync){
			tasks.forEach(spawnTask);
		} else {
			spawnTask(tasks);
		}
		
		function spawnTask(task) {
			var taskName = task;
			if(!opts.runAsync){
				taskName = task.shift();
			}
			grunt.util.spawn({
				grunt: true,
				args: [taskName].concat(flags),
				opts: {
					stdio: ['ignore', 'pipe', 'pipe']
				}
			}, function done(err, result) {
				taskCounter--;
				grunt.log.writeln("##teamcity[blockOpened name='" + opts.blockNamePrefix + taskName + "']");
				grunt.log.writeln(result);
				grunt.log.writeln("##teamcity[blockClosed name='" + opts.blockNamePrefix + taskName + "']");
				// no more tasks = done
				if (taskCounter === 0) {
					cb();
				}
				// run sync and still more tasks, call next
				else if(!opts.runAsync){
					spawnTask(task);
				}
			});
		}
	});
	
};
