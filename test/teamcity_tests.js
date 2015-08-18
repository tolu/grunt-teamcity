'use strict';
var exec = require('child_process').exec;
// var grunt = require('grunt');
// var task = require('../tasks/teamcity')(grunt);

exports.teamcity = {
  addsBlocksAroundSingleTaskResult: function(test) {
    test.expect(3);
    
    exec('grunt myTask --no-color', function (err, taskOutput) {    
			exec('grunt teamcity:myTask --no-color', function (err, result) {
        
        test.ok(/##teamcity\[blockOpened name=\'myTask\'\]/.test(result), 'should contain opening block statement');
        test.ok(/##teamcity\[blockClosed name=\'myTask\'\]/.test(result), 'should contain closing block statement');
        
        result = result.replace("##teamcity\[blockOpened name='myTask']", '[#]');
        result = result.replace("##teamcity\[blockClosed name='myTask']", '[#]');
        
        test.ok(result.split('[#]')[1].trim() === taskOutput.trim(), 'should add result inside block');
        
        test.done();
  		});
		});
  },
  addsBlockForEachTaskAsyncOrNot: function(test) {
    test.expect(3);
		exec('grunt teamcity:multiTask --no-color', function (err, result) {
      
      test.ok(/##teamcity\[blockOpened name=\'myTask\'\]/.test(result), 'add opening block statement for myTask');
      test.ok(/##teamcity\[blockOpened name=\'myAsyncTask\'\]/.test(result), 'add opening block for myAsyncTask');
      test.ok(/##teamcity\[blockOpened name=\'myFinalTask\'\]/.test(result), 'add opening block for myFinalTask');
      
      test.done();
		});
  },
  usesNamePrefixFromSettings: function(test){
    test.expect(1);
    exec('grunt teamcity:withOpts --no-color', function (err, result) {
      
      test.ok(/##teamcity\[blockOpened name=\'myPreFixTo myTask\'\]/.test(result), 'adds name prefix before task name');
      
      test.done();
		});
  },
  runSyncOutputsTasksInOrder: function(test){
    test.expect(1);
    exec('grunt teamcity:runSync --no-color', function (err, result) {
      var asyncTaskIdx = result.indexOf("blockOpened name='myAsyncTask'");
      var myTaskIdx = result.indexOf("blockOpened name='myTask'");
      
      test.ok(myTaskIdx > asyncTaskIdx, 'respects task order when running sync');
      
      test.done();
		});
  }
};
