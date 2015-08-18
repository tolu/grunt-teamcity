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
		
		var spawnedTasks = [];
		var done = this.async();
		var tasks = this.data.tasks || this.data;
		var flags = getFlags();
		
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
			spawnedTasks.push(grunt.util.spawn({
				grunt: true,
				args: [taskName].concat(flags),
				opts: {
					stdio: ['ignore', 'pipe', 'pipe']
				}
			}, function done(err, result) {
				taskCounter--;
				reportTaskResult({result:result, prefix:opts.blockNamePrefix, name: taskName});
				checkResult(result, taskName, flags); 
				
				// Failed or no more tasks = done
				if (result.failed || taskCounter === 0) {
					exit(result.error);
				}
				// run sync and still more tasks, call next
				else if(!opts.runAsync){
					spawnTask(task);
				}
			}));
		}
		
		function exit(error){
			// abort all tasks in list
			spawnedTasks.filter(function(task){
				return !task.killed;
			}).forEach(function(task){
				task.kill();
			});
			
			// call async callback
			done(error);
		}
	});
	
	function checkResult(result, name, flags) {
		if(!/Done, without errors/.test(result) && !flags.force){
			result.failed = true;
			result.error = new Error('teamcity-task failed when running ' + name);
		}
	}
	
	function reportTaskResult(taskResult){
		grunt.log.writeln("##teamcity[blockOpened name='" + taskResult.prefix + taskResult.name + "']");
		grunt.log.writeln(taskResult.result);
		grunt.log.writeln("##teamcity[blockClosed name='" + taskResult.prefix + taskResult.name + "']");
	}
	
	function getFlags(){
		// get flag array, set force at param of object
		// as sending it down the line prevents some tasks from finishing
		var flags = grunt.option.flags();
		flags.force = false;
		var forceFlagIdx = flags.indexOf('--force');
		if(forceFlagIdx >= 0){
			flags.force = true;
			flags.splice(forceFlagIdx, 1);
		}
		return flags;
	}
};
