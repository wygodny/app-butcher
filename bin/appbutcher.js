#!/usr/bin/env node
'use strict';

const fs = require('fs')
const path = require('path')
const log = require('verbalize')
const argv = require('minimist')(process.argv.slice(2))
const _ = require('underscore')

log.runner = 'app-butcher'

const file  = argv.f || argv.file
const projectPath  = argv.p || argv.project

const steps = {
  remove: (info, filePath)=> {
    fs.unlinkSync(path.normalize(filePath))
  },
  clean: (info, filePath)=> {
    fs.truncateSync(path.normalize(filePath), 0)
  },
  filter: (info, filePath)=> {
    const lines = info.lines
    const match = info.match

    const data = fs.readFileSync(filePath, 'utf8')
    let dataArray = data.split('\n')
    const lastIndex = function() {
      for (let j = dataArray.length - 1; j > -1; j -= 1) {
        if (dataArray[j].match(match)) return j;
      }
    }()
    for (let k = lastIndex; k < (lastIndex + parseInt(lines)); k+=1) {
      dataArray[k] = ''
    }
    fs.unlinkSync(filePath)
    fs.writeFileSync(filePath, dataArray.join('\n'))
  },
  rmdir:(info, dirPath)=> {
    fs.readdirSync(dirPath).forEach(function(file,index){
      const curPath = dirPath + "/" + file
      if(fs.lstatSync(curPath).isDirectory()) { 
        steps.rmdir(null, null, curPath)
      } else { 
        fs.unlinkSync(curPath)
      }
    })
    fs.rmdirSync(dirPath)
  }
}

const jsonMode = ()=> {
  let config
  if (!fs.existsSync(file)) {
    log.error('Config file not found!')
    process.exit(2)
  }

  try {
    config = JSON.parse(fs.readFileSync(file, 'utf8'))
  } catch (e) {
    log.error(e)
  }

  if (!config || !config.projectPath) {
    log.error('Invalid config file!')
    process.exit(3)
  }

  _.each(config.steps, (stepConfig)=> {
    if (stepConfig) {
      _.each(stepConfig.paths, (info)=> {
        try {
          let filePath = path.join(config.projectPath, info.path)
          log(`${stepConfig.type} :: ${filePath}`)
          steps[stepConfig.type](info, filePath)
        } catch(e) {
          log.error(e)
        }
      })
      log(`Step ${stepConfig.type} :: done`)
    }
  })
}

const projectMode = ()=> {
  let config
  if (!fs.existsSync(projectPath)) {
    log.error('Project dir not found!')
    process.exit(3)
  }
  const configFile = path.join(projectPath, 'app-butcher.conf')
  if (!fs.existsSync(configFile)) {
    log.error(`${configFile} file not found!`)
    process.exit(4)
  }

  try {
    config = fs.readFileSync(configFile, 'utf8')
  } catch(e) {
    log.error(e)
  }

  let fileLines = config.split('\n')  
  _.each(fileLines, function(line) {
    let fields = line.trim().split(' ')
    if (fields.length >= 2 && fields[0]) {
      try {
        let filePath = path.join(projectPath, fields[1])
        log(`${fields[0]} :: ${filePath}`)
        steps[fields[0]]({
          path: fields[1],
          lines: fields[2],
          match: fields[3],
        }, filePath)
      } catch(e) {
        log.error(`\t${e}`)
      }
    }
  })
}

if (file) {
  jsonMode()
} else if (projectPath) {
  projectMode()
} else {
  log.error('Please provide a config file [-f, -file] or project path [-p, -project]')
  process.exit(5)
}

log('All done :)')