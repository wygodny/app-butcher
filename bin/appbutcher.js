#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var log = require('verbalize');
var argv = require('minimist')(process.argv.slice(2));
var path = require('path');


/**
 * Everything in the file should be customized
 */


// Verbalize `runner`
log.runner = 'app-butcher';

// Use `-f` or `--file` to specify the source file
var file  = argv.f || argv.file

if (!file) {
  log.error('Please provide a config file [-f, -file]');
  process.exit(1)
}

/**
 * Application
 */

if (!fs.existsSync(file)) {
  log.error('Config file not found!');
  process.exit(2)
}

var config = null

try {
  config = JSON.parse(fs.readFileSync(file, 'utf8'))
} catch (e) { }

if (!config || !config.projectPath) {
  log.error('Invalid config file!');
  process.exit(3)
}

if (config.remove) {
  log("Removing files ...")
  for (var i = 0, length = config.remove.length; i < length; i+=1) {
    var filePath = path.join(config.projectPath, config.remove[i])
    if (filePath) {
      try {
        fs.unlinkSync(path.normalize(filePath));
      } catch(e) {
        log(e)
      }
    }
  }
  log("Removing files done")
}

if (config.remove) {
  log("Cleaning files ...")
  for (var i = 0, length = config.clean.length; i < length; i+=1) {
    var filePath = path.join(config.projectPath, config.clean[i])
    if (filePath) {
      try {
        fs.truncateSync(path.normalize(filePath), 0);
      } catch(e) {
        log(e)
      }
    }
  }
  log("Cleaning files done")
}

if (config.remove) {
  log("Filtering files ...")
  for (var i = 0, length = config.filter.length; i < length; i+=1) {
    var fileInfo = config.filter[i]

    if (fileInfo) {
      var filePath = path.join(config.projectPath, fileInfo.path)
      var lines = fileInfo.lines
      var match = fileInfo.match

      try {
        var data = fs.readFileSync(filePath, 'utf8')
        var dataArray = data.split('\n')
        var lastIndex = function() {
          for (var j = dataArray.length - 1; j > -1; j -= 1) {
            if (dataArray[j].match(match)) return j;
          }
        }();

        for (var k = lastIndex; k < (lastIndex + lines); k+=1) {
          dataArray[k] = ''
        }
        fs.unlinkSync(filePath)
        fs.writeFileSync(filePath, dataArray.join('\n'))
      } catch(e) {
        log(e)
      }
    }
  }
  log("Filtering files done")
}

if (config.remove) {
  log("Removing dirs ...")
  for (var i = 0, length = config.rmdirs.length; i < length; i+=1) {
    var path = path.join(config.projectPath, config.rmdirs[i])
    if (path) {
      try {
        fs.readdirSync(path).forEach(function(file,index){
          var curPath = path + "/" + file;
          if(fs.lstatSync(curPath).isDirectory()) { // recurse
            deleteFolderRecursive(curPath);
          } else { // delete file
            fs.unlinkSync(curPath);
          }
        });
        fs.rmdirSync(path);
      } catch(e) {
        log(e)
      }
    }
  }
  log("Removing dirs done")
}
