# grunt-teamcity-blocks [![Build Status](https://travis-ci.org/tolu/grunt-teamcity-blocks.svg?branch=master)](https://travis-ci.org/tolu/grunt-teamcity-blocks)
> Runs Grunt tasks and reports each result inside a TeamCity block  
> See [TeamCity Script Interaction](https://confluence.jetbrains.com/display/TCD8/Build+Script+Interaction+with+TeamCity) for more info.

## TeamCity task
_Run this task with the `grunt teamcity` command._

Task targets, files and options may be specified according to the grunt [Configuring tasks](http://gruntjs.com/configuring-tasks) guide.

### Usage
```shell
npm install grunt-teamcity-blocks --save-dev
```
```js
require('load-grunt-tasks')(grunt); // npm install --save-dev load-grunt-tasks

grunt.initConfig({
	teamcity: {
	  options: {
	    blockNamePrefix:'Grunt: '
	  },
		tasks: ['coffee', 'sass', 'jshint', 'mocha']
	}
});
```
Generates the following output:
```shell
##teamcity[blockOpened name="Grunt: coffee"]
{coffe-task result}
##teamcity[blockClosed name="Grunt: coffee"]
...
```


### Options

#### blockNamePrefix

Type: `String`
Default: ``

A prefix added to the name of the opening and closing teamcity block

#### runAsync

Type: `Boolean`
Default: `true`

Set to false to have task-order respected
