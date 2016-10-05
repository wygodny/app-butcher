#!/usr/bin/env node
'use strict';

const fs = require('fs')
const path = require('path')
const log = require('verbalize')
const argv = require('minimist')(process.argv.slice(2))
const _ = require('underscore')

log.runner = 'app-butcher'

const file  = argv.f || argv.file

if (!file) {
  log.error('Please provide a config file [-f, -file]')
  process.exit(1)
}

if (!fs.existsSync(file)) {
  log.error('Config file not found!')
  process.exit(2)
}

let config = null

try {
  config = JSON.parse(fs.readFileSync(file, 'utf8'))
} catch (e) {
  log.error(e)
}

if (!config || !config.projectPath) {
  log.error('Invalid config file!')
  process.exit(3)
}

const steps = {
  remove: (stepConfig, info, filePath)=> {
    fs.unlinkSync(path.normalize(filePath))
  },
  clean: (stepConfig, info, filePath)=> {
    fs.truncateSync(path.normalize(filePath), 0)
  },
  filter: (stepConfig, info, filePath)=> {
    const lines = info.lines
    const match = info.match

    try {
      const data = fs.readFileSync(filePath, 'utf8')
      let dataArray = data.split('\n')
      const lastIndex = function() {
        for (let j = dataArray.length - 1; j > -1; j -= 1) {
          if (dataArray[j].match(match)) return j;
        }
      }()

      for (let k = lastIndex; k < (lastIndex + lines); k+=1) {
        dataArray[k] = ''
      }
      fs.unlinkSync(filePath)
      fs.writeFileSync(filePath, dataArray.join('\n'))
    } catch(e) {
      log(e)
    }
  },
  rmdir:(stepConfig, info, dirPath)=> {
    fs.readdirSync(dirPath).forEach(function(file,index){
      const curPath = dirPath + "/" + file
      if(fs.lstatSync(curPath).isDirectory()) { 
        deleteFolderRecursive(curPath)
      } else { 
        fs.unlinkSync(curPath)
      }
    })
    fs.rmdirSync(dirPath)
  }
}

_.each(config.steps, (stepConfig)=> {
  if (stepConfig) {
    log(`Step ${stepConfig.type} :: starting`)
    _.each(stepConfig.paths, (info)=> {
      try {
        let filePath = path.join(config.projectPath, info.path)
        log(`\t${filePath}`)
        steps[stepConfig.type](stepConfig, info, filePath)
      } catch(e) {
        log.error(e)
      }
    })
    log(`Step ${stepConfig.type} :: done`)
  }
})

log('All done :)')